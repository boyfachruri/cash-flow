"use client";

import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
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
  createExpensesList,
  fetchExpensesListById,
  ExpensesDetailsFormInterface,
  updateExpenses,
} from "@/utils/expenses";
import Loader from "@/components/loader";
import { capitalizeFirstLetter } from "@/components/functions/CapitalFirstLetter";

interface ExpensesFormInterface {
  id?: string;
  mode?: string;
}

interface CashOutInterface {
  id?: string;
  expensesId?: string;
  desc: string;
  amount: number;
}

export const amountTypeList = ["balance", "wallet"];

const ExpensesForm = ({ id, mode }: ExpensesFormInterface) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [valueTitle, setValueTitle] = useState<string>("");
  const [valueDesc, setValueDesc] = useState<string>("");
  const [valueExpensesAmount, setValueExpensesAmount] =
    useState<string>("0,00");
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
  const [amountType, setAmountType] = useState("");

  function parseFormattedNumber(str: string) {
    return parseFloat(str.replace(/\./g, "").replace(",", "."));
  }

  const [cashin, setCashin] = useState<ExpensesDetailsFormInterface>();
  const [allCashin, setAllCashin] = useState<ExpensesDetailsFormInterface[]>(
    []
  );

  const [language, setLanguage] = useState("EN");
  

  const formatNumberToIDR = (num: number): string => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const calculateTotalCashin = (data: ExpensesDetailsFormInterface[]) => {
    const totalAmount = data.reduce((total, cashin) => {
      return total + (cashin.amount || 0); // Pastikan cashin.amount ada, jika tidak default ke 0
    }, 0);

    setValueAmount(totalAmount);
  };

  const handleBackPage = () => {
    router.push(`/main/expenses`);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    const lang = localStorage.getItem("language");
    setLanguage(lang || "EN");

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
                const response = await fetchExpensesListById(
                  tokens,
                  id,
                  userId
                );
                setValueTitle(response?.title || "");
                const dateString = response?.date || "";
                const parsedDate = dayjs(dateString);
                setSelectedDate(parsedDate);
                setAllCashin(response?.expensesDetails);
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
      setValueExpensesAmount("0,00");
      setAmountType("")
    } else {
      if (cashin) {
        setValueDesc(cashin?.description);
        const formatAmount = formatNumberToIDR(cashin?.amount);
        setValueExpensesAmount(formatAmount);
        setAmountType(cashin?.amountType)
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

  const handleEdit = (data: ExpensesDetailsFormInterface) => {
    setCashin(data);
    setOpenDialogAdd(true);
    handleMenuClose();
  };

  const handleDeleteClick = (data?: ExpensesDetailsFormInterface) => {
    setCashin(data);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = (data?: ExpensesDetailsFormInterface) => {
    if (data) {
      setAllCashin((prevCashin) =>
        prevCashin.filter((item) => item._id !== data._id)
      );
    }

    setOpenDialog(false);
  };

  const handleSubmitCashOut = (data?: ExpensesDetailsFormInterface) => {
    if (!data) {
      const newCashin = {
        id: crypto.randomUUID(),
        description: valueDesc,
        amount: parseFormattedNumber(valueExpensesAmount),
        amountType: amountType,
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
                amount: parseFormattedNumber(valueExpensesAmount),
                amountType: amountType,
                date: selectedDate ? selectedDate.toDate() : new Date(),
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
        expensesDetails: allCashin,
      };
      const submitData = async () => {
        try {
          const response = await updateExpenses(id, userId, dataObj);
          router.push(`/main/expenses`);
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
        expensesDetails: allCashin,
      };
      const submitData = async () => {
        try {
          const response = await createExpensesList(dataObj);
          router.push(`/main/expenses`);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      submitData();
    }
  };

  const handleAmountTypeChange = (event: SelectChangeEvent) => {
    setAmountType(event.target.value as string);
  };

  return (
    <>
      {isLoading === true && <Loader />}
      <div>
        <Typography variant="h6" paddingBottom={3} fontWeight="bold">
          {language === 'ID' ? 'Form Pengeluaran' : "Expenses Form"}
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
              label={language === 'ID' ? 'Judul' : "Title"}
              variant="standard"
              color="secondary"
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
                    fullWidth: true, // ✅ Agar input full width
                    variant: "standard",
                    color: "secondary", // ✅ Menggunakan variant "standard"
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
                {language === 'ID' ? 'Tambah Uang Keluar' : "Add Cash-out"}
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
                      {language === 'ID' ? 'Daftar Uang Keluar' : "Cash-out List"}
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
                    {language === 'ID' ? 'Tidak ada data' : "No Data"}
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
                              <Typography
                                component="span"
                                variant="body2"
                                fontWeight="bold"
                                color={x?.amountType == 'balance' ? "#504BFD" : "#904cee"}
                              >
                                {capitalizeFirstLetter(x?.amountType)}
                              </Typography>
                            </Box>
                          </Typography>
                        }
                        secondary={
                          <Typography component="div">
                            <Box display="flex" justifyContent="space-between">
                              <Typography
                                component="span"
                                color="error"
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
                  {id ? (language === 'ID' ? 'Ubah' : "Update") : (language === 'ID' ? 'Simpan' : "Save")}
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
              {language === 'ID' ? 'Batal' : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDialogAdd}
          onClose={() => setOpenDialogAdd(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{language === 'ID' ? 'Uang Keluar' : "Cash-out"}</DialogTitle>
          <DialogContent>
            <Box width="100%" display="flex" gap={3} flexDirection="column">
              <Box width="100%">
                {" "}
                {/* Full width di mobile */}
                <TextField
                  fullWidth
                  id="standard-basic"
                  label={language === 'ID' ? 'Deskripsi' : "Description"}
                  color="secondary"
                  variant="standard"
                  value={valueDesc}
                  onChange={handlDescChange}
                />
              </Box>
              <Box width="100%">
                <Autocomplete
                  fullWidth
                  disablePortal
                  options={amountTypeList}
                  // sx={{ width: 300 }}
                  value={capitalizeFirstLetter(amountType)}
                  onChange={(event, newValue) => setAmountType(newValue || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      color="secondary"
                      label={language === 'ID' ? 'Tipe Pembayaran' : "Payment Type"}
                      variant="standard"
                    />
                  )}
                />
              </Box>
              <Box width="100%">
                <NumberTextField
                  label={language === 'ID' ? 'Jumlah Pengeluaran' : "Expenses Amount"}
                  color="secondary"
                  value={valueExpensesAmount}
                  onChange={setValueExpensesAmount}
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
              disabled={
                amountType && valueDesc && valueExpensesAmount != "0,00" ? false : true
              }
            >
              {language === 'ID' ? 'Simpan' : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ExpensesForm;
