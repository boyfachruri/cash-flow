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
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatCurrencyIDR } from "@/components/functions/IDRFormatter";
import dayjs, { Dayjs } from "dayjs";
import NumberTextField from "@/components/NumberTextField";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";
import {
  createIncomeList,
  fetchIncomeListById,
  IncomeDetailsFormInterface,
  updateIncome,
} from "@/utils/income";
import Loader from "@/components/loader";

interface IncomeFormInterface {
  id?: string;
  mode?: string;
}

interface CashOutInterface {
  id?: string;
  incomeId?: string;
  desc: string;
  amount: number;
}

const IncomeForm = ({ id, mode }: IncomeFormInterface) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [valueTitle, setValueTitle] = useState<string>("");
  const [valueDesc, setValueDesc] = useState<string>("");
  const [valueIncomeAmount, setValueIncomeAmount] = useState<string>("0,00");
  const [valueAmount, setValueAmount] = useState<number>(0);
  const [menuAnchor, setMenuAnchor] = useState<{
    anchorEl: HTMLElement | null;
    id: string | null;
  }>({
    anchorEl: null,
    id: null,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [userId, setUserId] = useState("");
  const [tokens, setTokens] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  function parseFormattedNumber(str: string) {
    return parseFloat(str.replace(/\./g, "").replace(",", "."));
  }

  const [cashin, setCashin] = useState<IncomeDetailsFormInterface>();
  const [allCashin, setAllCashin] = useState<IncomeDetailsFormInterface[]>([]);
  const [language, setLanguage] = useState("EN");

  const formatNumberToIDR = (num: number): string => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const calculateTotalCashin = (data: IncomeDetailsFormInterface[]) => {
    const totalAmount = data.reduce((total, cashin) => {
      return total + (cashin.amount || 0); // Pastikan cashin.amount ada, jika tidak default ke 0
    }, 0);

    setValueAmount(totalAmount);
  };

  const handleBackPage = () => {
    router.push(`/main/income`);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    const lang = localStorage.getItem("language");
    setLanguage(lang || 'EN');
    if (userData && token) {
      const user = JSON.parse(userData);
      setUserId(user?._id);
      setTokens(token);
      if (!isAuthenticated()) {
        // Redirect hanya di klien
        router.push("/login");
      } else {
        if (id) {
          if (userId && tokens) {
            const fetchData = async () => {
              try {
                const response = await fetchIncomeListById(tokens, id, userId);
                setValueTitle(response?.title || "");
                const dateString = response?.date || "";
                const parsedDate = dayjs(dateString);
                setSelectedDate(parsedDate);
                setAllCashin(response?.incomeDetails);
              } catch (err) {
                console.error(err);
              } finally {
                setIsLoading(false);
              }
            };
            fetchData();
          }
        } else {
          setIsLoading(false);
        } // Jika sudah login, selesai loading
      }
    }
  }, [id, userId, tokens]);

  useEffect(() => {
    if (openDialogAdd == false) {
      if (openDialog == false) {
        setCashin(undefined);
      }
      setValueDesc("");
      setValueIncomeAmount("0,00");
    } else {
      if (cashin) {
        setValueDesc(cashin?.description);
        const formatAmount = formatNumberToIDR(cashin?.amount);
        setValueIncomeAmount(formatAmount);
      }
    }
  }, [openDialogAdd, cashin, openDialog]);

  useEffect(() => {
    calculateTotalCashin(allCashin);
  }, [allCashin]);

  const handlDescChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setValueDesc(event.target.value); // Pastikan mengambil value dari event
  };

  const handleTitleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setValueTitle(event.target.value); // Pastikan mengambil value dari event
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ anchorEl: event.currentTarget, id });
  };

  const handleMenuClose = () => {
    setMenuAnchor({ anchorEl: null, id: null });
  };

  const handleAdd = () => {
    setOpenDialogAdd(true);
  };

  const handleEdit = (data: IncomeDetailsFormInterface) => {
    setCashin(data);
    setOpenDialogAdd(true);
    handleMenuClose();
  };

  const handleDeleteClick = (data?: IncomeDetailsFormInterface) => {
    setCashin(data);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = (data?: IncomeDetailsFormInterface) => {
    if (data) {
      setAllCashin((prevCashin) =>
        prevCashin.filter((item) => item._id !== data._id)
      );
    }

    setOpenDialog(false);
  };

  const handleSubmitCashOut = (data?: IncomeDetailsFormInterface) => {
    if (!data) {
      const newCashin = {
        _id: crypto.randomUUID(),
        description: valueDesc,
        amount: parseFormattedNumber(valueIncomeAmount),
        date: selectedDate ? selectedDate.toDate() : new Date(),
      };
      setAllCashin([...allCashin, newCashin]);
      setCashin(undefined);
    } else {
      setAllCashin((prevCashin) =>
        prevCashin.map((item) =>
          item._id === data._id
            ? {
                ...item,
                description: valueDesc,
                amount: parseFormattedNumber(valueIncomeAmount),
              }
            : item
        )
      );
      setCashin(undefined);
    }
    setOpenDialogAdd(false);
  };

  const handleSubmitData = () => {
    setIsLoading(true);
    if (id) {
      const dataObj = {
        title: valueTitle,
        amount: valueAmount,
        date: selectedDate ? selectedDate.toDate() : new Date(),
        userId: userId,
        incomeDetails: allCashin,
      };
      const submitData = async () => {
        try {
          const response = await updateIncome(id, userId, dataObj);
          router.push(`/main/income`);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      submitData();
    } else {
      const dataObj = {
        title: valueTitle,
        amount: valueAmount,
        date: selectedDate ? selectedDate.toDate() : new Date(),
        userId: userId,
        incomeDetails: allCashin,
      };
      const submitData = async () => {
        try {
          const response = await createIncomeList(dataObj);
          router.push(`/main/income`);
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
      {isLoading === true && <Loader />}
      <div>
        <Typography variant="h6" paddingBottom={3} fontWeight="bold">
          {language === 'ID' ? 'Form Pemasukan' : "Income Form"}
        </Typography>
        <Box
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", md: "row" }} // Column di mobile, row di desktop
          gap={2} // Jarak antar box
        >
          <Box width={{ xs: "100%", md: "50%" }}>
            {" "}
            {/* Full width di mobile */}
            <TextField
              disabled={mode == "view" ? true : false}
              fullWidth
              id="standard-basic"
              color="secondary"
              label={language === 'ID' ? 'Judul' : "Title"}
              variant="standard"
              value={valueTitle}
              onChange={handleTitleChange}
            />
          </Box>
          <Box width={{ xs: "100%", md: "50%" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                format="DD/MM/YYYY"
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    color: "secondary",
                    fullWidth: true, // ✅ Agar input full width
                    variant: "standard", // ✅ Menggunakan variant "standard"
                  },
                }}
                label={language === 'ID' ? 'Tanggal' : "Date"}
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                disabled={mode == "view" ? true : false}
              />
            </LocalizationProvider>
          </Box>
        </Box>
        <Box width="100%">
          {mode != "view" && (
            <Box width="100%" marginTop={5}>
              <Button
                // fullWidth
                variant="contained"
                sx={{ bgcolor: "#904cee" }}
                onClick={handleAdd}
              >
                {language === 'ID' ? 'Tambah Uang Masuk' : "Add Cash-in"}
              </Button>
            </Box>
          )}

          <Box
            width="100%"
            //   border={1}
            marginTop={3}
            paddingBottom={2}
            //   borderColor="#904cee"
            boxShadow={1}
          >
            <Box marginRight={2} marginLeft={2} marginBottom={1} marginTop={1}>
              <Box width="100%" display="flex">
                <Box
                  width="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Box>
                    <Typography
                      variant="body1"
                      paddingTop={2}
                      fontWeight="bold"
                    >
                      {language === 'ID' ? 'Daftar Uang Masuk' : "Cash-in List"}
                    </Typography>
                  </Box>
                </Box>
                <Box width="50%" display="flex" justifyContent="flex-end">
                  <Box>
                    <Typography
                      variant="body2"
                      paddingTop={2}
                      fontWeight="bold"
                    >
                      Total: {formatCurrencyIDR(valueAmount)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {allCashin?.length === 0 ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height={100}
                >
                  <Typography variant="body2" color="textSecondary">
                    {language === 'ID' ? 'Tidak Ada Data' : "No Data"}
                  </Typography>
                </Box>
              ) : (
                <List>
                  {allCashin?.map((x, index) => (
                    <ListItem
                      key={x?._id || `cashin-${index}`}
                      alignItems="flex-start"
                      sx={{ borderRadius: "5px", marginTop: 1, boxShadow: 1 }}
                      secondaryAction={
                        mode != "view" && (
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
                                menuAnchor.anchorEl !== null &&
                                menuAnchor.id === x._id
                              }
                              onClose={handleMenuClose}
                            >
                              <MenuItem onClick={() => handleEdit(x)}>
                                <Typography component="span" variant="body2">
                                  {language === 'ID' ? 'Ubah' : "Edit"}
                                </Typography>
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleDeleteClick(x)}
                                sx={{ color: "error.main" }}
                              >
                                <Typography component="span" variant="body2">
                                  {language === 'ID' ? 'Hapus' : "Delete"}
                                </Typography>
                              </MenuItem>
                            </Menu>
                          </>
                        )
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography component="div">
                            <Box display="flex" justifyContent="space-between">
                              <Typography
                                component="span"
                                variant="body2"
                                fontWeight="bold"
                              >
                                {x?.description}
                              </Typography>
                            </Box>
                          </Typography>
                        }
                        secondary={
                          <Typography component="div">
                            <Box display="flex" justifyContent="space-between">
                              <Typography
                                component="span"
                                color="success"
                                variant="body2"
                              >
                                {formatCurrencyIDR(x?.amount)}
                              </Typography>
                            </Box>
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          position="fixed"
          bottom={0}
          left={0}
          width="100%"
          bgcolor="white"
          boxShadow={3}
          p={2}
          display="flex"
          gap={2}
        >
          {mode != "view" ? (
            <>
              <Box width="50%">
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: "#904cee" }}
                  onClick={handleBackPage}
                >
                  {language === 'ID' ? 'Batal' : "Cancel"}
                </Button>
              </Box>
              <Box width="50%">
                <Button
                  disabled={
                    valueTitle && valueAmount && selectedDate ? false : true
                  }
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: "#904cee" }}
                  onClick={handleSubmitData}
                >
                  {id ? (language === 'ID' ? 'Ubah' : "Update" ): (language === 'ID' ? 'Simpan' : "Save")}
                </Button>
              </Box>
            </>
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
              onClick={handleBackPage}
            >
              {language === 'ID' ? 'Kembali' : "Back"}
            </Button>
          )}
        </Box>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{language === 'ID' ? 'Konfirmasi Hapus' : "Delete Confirmation"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {language === 'ID' ? 'Apakah kamu yakin ingin menghapus data ini?' : "Are you sure you want to delete?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
            >
              {language === 'ID' ? 'Batal' : "Cancel"}
            </Button>
            <Button
              onClick={() => handleDeleteConfirm(cashin)}
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
            >
              {language === 'ID' ? 'Hapus' : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDialogAdd}
          onClose={() => setOpenDialogAdd(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{language === 'ID' ? 'Uang Masuk' : "Cash-in"}</DialogTitle>
          <DialogContent>
            <Box width="100%" display="flex" gap={3} flexDirection="column">
              <Box width="100%">
                {" "}
                {/* Full width di mobile */}
                <TextField
                  fullWidth
                  id="standard-basic"
                  color="secondary"
                  label={language === 'ID' ? 'Deskripsi' : "Description"}
                  variant="standard"
                  value={valueDesc}
                  onChange={handlDescChange}
                />
              </Box>
              <Box width="100%">
                <NumberTextField
                  label={language === 'ID' ? 'Jumlah Pemasukan' : "Income Amount"}
                  color="secondary"
                  value={valueIncomeAmount}
                  onChange={setValueIncomeAmount}
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
              {language === 'ID' ? 'Batal' : "Cancel"}
            </Button>
            <Button
              onClick={() => handleSubmitCashOut(cashin)}
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
              disabled={valueDesc && valueIncomeAmount != "0,00" ? false : true}
            >
              {language === 'ID' ? 'Simpan' : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default IncomeForm;
