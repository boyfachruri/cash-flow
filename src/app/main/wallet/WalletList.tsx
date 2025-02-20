"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Search from "@/components/Search";
import Grid from "@mui/material/Grid2";
import { formatCurrencyIDR } from "@/components/functions/IDRFormatter";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";
import { DateFormatter } from "@/components/functions/DateFormatter";
// import { WalletListInterface } from "./interfaceProps";
import { isAuthenticated } from "@/utils/auth";
import Loader from "@/components/loader";
import {
  createWalletList,
  deleteWallet,
  fetchWalletList,
  updateWallet,
} from "@/utils/wallet";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import NumberTextField from "@/components/NumberTextField";
import dayjs, { Dayjs } from "dayjs";
import { fetchDashboard } from "@/utils/dashboard";

interface WalletListInterface {
  _id: string;
  amount: number;
  userId: string;
  date: Date;
}

const WalletList = () => {
  const router = useRouter();
  const [menuAnchor, setMenuAnchor] = useState<{
    anchorEl: HTMLElement | null;
    id: string | null;
  }>({
    anchorEl: null,
    id: null,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState("");

  const [walletList, setWalletList] = useState<WalletListInterface[]>([]);
  const [walletListById, setWalletListById] = useState<WalletListInterface>();
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [userId, setUserId] = useState("");
  const [walletById, setWalletById] = useState<WalletListInterface>();
  const [valueAmount, setValueAmount] = useState<string>("0,00");
  const [balance, setBalance] = useState<string>("0,00");
  const [disabledSave, setDisabledSave] = useState(false);

  function parseFormattedNumber(str: string) {
    return parseFloat(str.replace(/\./g, "").replace(",", "."));
  }

  const formatNumberToIDR = (num: number): string => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (!isAuthenticated()) {
      // Redirect hanya di klien
      router.push("/login");
    } else {
      if (userData && token) {
        setTokens(token);
        const user = JSON.parse(userData);
        if (user) {
          setUserId(user?._id);
          const fetchData = async () => {
            try {
              const response = await fetchWalletList(token, user?._id);

              const responseDashboard = await fetchDashboard(token, user?._id);
              const formatBalanceAmount = formatNumberToIDR(
                responseDashboard?.calculateBalance
              );
              setBalance(formatBalanceAmount);
              setWalletList(response);
            } catch (err) {
              setError("Failed to fetch dashboard data");
            } finally {
              setIsLoading(false);
            }
          };
          fetchData();
        }
      } // Jika sudah login, selesai loading
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  // Filter data berdasarkan pencarian
  const filteredData = walletList.filter(
    (item) =>
      DateFormatter(String(item.date)).includes(searchQuery) ||
      item.amount.toString().includes(searchQuery)
  );

  // Handle open/close menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ anchorEl: event.currentTarget, id });
  };

  const handleMenuClose = () => {
    setMenuAnchor({ anchorEl: null, id: null });
  };
  const handleAdd = async () => {
    setWalletById(undefined);
    setValueAmount("0,00");
    setSelectedDate(dayjs);
    setOpenDialogAdd(true);
  };

  // Aksi untuk pindah screen
  const handleView = async (data: WalletListInterface) => {
    setIsLoading(true);

    try {
      await router.push(`/main/wallet/view/${data._id}`);
    } finally {
      setIsLoading(false);
    }

    handleMenuClose();
  };

  const handleEdit = async (data: WalletListInterface) => {
    console.log(data, "data");
    const dateString = data?.date || "";
    const parsedDate = dayjs(dateString);
    setSelectedDate(parsedDate);

    const formatAmount = formatNumberToIDR(data?.amount);
    setValueAmount(formatAmount);

    setWalletById(data);
    setOpenDialogAdd(true);
    handleMenuClose();
  };

  // Handle delete dialog
  const handleDeleteClick = (data: WalletListInterface) => {
    setWalletListById(data);
    setOpenDialog(true);
    handleMenuClose();
  };

  useEffect(() => {
    if (valueAmount && balance) {
      const parseAmount = parseFormattedNumber(valueAmount);
      const parseBalance = parseFormattedNumber(balance);

      if (parseAmount > parseBalance) {
        setDisabledSave(true);
      } else {
        setDisabledSave(false);
      }
    }
  }, [valueAmount, balance]);

  const handleDeleteConfirm = () => {
    setIsLoading(true);
    const deleteData = async () => {
      try {
        const response = await deleteWallet(
          walletListById?._id || "",
          walletListById?.userId || ""
        );

        const responseData = await fetchWalletList(
          tokens,
          walletListById?.userId || ""
        );

        setWalletList(responseData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    deleteData();
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    console.log(walletListById);

    if (!walletById) {
      const newData = {
        amount: parseFormattedNumber(valueAmount),
        date: selectedDate ? selectedDate.toDate() : new Date(),
        userId: userId,
      };
      const submitData = async () => {
        try {
          const response = await createWalletList(newData);

          const responseData = await fetchWalletList(tokens, userId || "");
          setWalletList(responseData);
          setOpenDialogAdd(false);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      submitData();
    } else {
      const newData = {
        amount: parseFormattedNumber(valueAmount),
        date: selectedDate ? selectedDate.toDate() : new Date(),
        userId: userId,
      };
      const submitData = async () => {
        try {
          const response = await updateWallet(
            walletById?._id || "",
            userId,
            newData
          );
          const responseData = await fetchWalletList(tokens, userId || "");
          setWalletList(responseData);
          setOpenDialogAdd(false);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      submitData();
    }
  };

  return (
    <>
      {isLoading == true && <Loader />}
      <div>
        {/* <div> */}
        <Typography variant="h6" paddingBottom={3} fontWeight="bold">
          Wallet List
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 9, md: 11 }}>
            <Search onSearch={handleSearch} />
          </Grid>
          <Grid size={{ xs: 3, md: 1 }} textAlign="right">
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
              onClick={handleAdd}
            >
              Add
            </Button>
          </Grid>
        </Grid>
        {/* </div> */}

        {filteredData?.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={100}
          >
            <Typography variant="body2" color="textSecondary">
              No Data
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredData?.map((x) => (
              <ListItem
                key={x?._id}
                alignItems="flex-start"
                sx={{ borderRadius: "5px", marginTop: 1, boxShadow: 1 }}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      onClick={(e) => handleMenuOpen(e, x._id!)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={menuAnchor.anchorEl}
                      open={
                        menuAnchor.anchorEl !== null && menuAnchor.id === x._id
                      }
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleView(x)}>
                        <Typography component="span" variant="body2">
                          View
                        </Typography>
                      </MenuItem>
                      <MenuItem onClick={() => handleEdit(x)}>
                        <Typography component="span" variant="body2">
                          Edit
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDeleteClick(x)}
                        sx={{ color: "error.main" }}
                      >
                        <Typography component="span" variant="body2">
                          Delete
                        </Typography>
                      </MenuItem>
                    </Menu>
                  </>
                }
              >
                <ListItemText
                  primary={
                    <Typography component="div">
                      <Box display="flex" justifyContent="space-between">
                        <Typography
                          component="span"
                          color="#904cee"
                          variant="body2"
                        >
                          {formatCurrencyIDR(x?.amount)}
                        </Typography>
                        <Typography component="span" variant="body2">
                          {DateFormatter(String(x?.date))}
                        </Typography>
                      </Box>
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteConfirm()}
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDialogAdd}
          onClose={() => setOpenDialogAdd(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Wallet</DialogTitle>
          <DialogContent>
            <Box width="100%" display="flex" gap={3} flexDirection="column">
              <Box width="100%">
                {" "}
                {/* Full width di mobile */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        color: "secondary",
                        fullWidth: true, // ✅ Agar input full width
                        variant: "standard", // ✅ Menggunakan variant "standard"
                      },
                    }}
                    label="Date"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                  />
                </LocalizationProvider>
              </Box>
              {/* <Box width="100%">
                <NumberTextField
                  label="Balance Amount"
                  color="secondary"
                  value={balance}
                  disabled
                />
              </Box> */}
              <Box width="100%">
                <NumberTextField
                  label="Wallet Amount"
                  color="secondary"
                  value={valueAmount}
                  onChange={setValueAmount}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialogAdd(false)}
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit()}
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
              disabled={
                // disabledSave == false &&
                 selectedDate && valueAmount != "0,00"
                  ? false
                  : true
              }
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default WalletList;
