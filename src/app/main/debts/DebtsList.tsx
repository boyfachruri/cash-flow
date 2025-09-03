"use client";

import {
  Alert,
  AlertTitle,
  Autocomplete,
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
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Search from "@/components/Search";
import Grid from "@mui/material/Grid2";
import { formatCurrencyIDR } from "@/components/functions/IDRFormatter";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";
import { DateFormatter } from "@/components/functions/DateFormatter";
import { isAuthenticated } from "@/utils/auth"; // kamu bikin API mirip expenses
import Loader from "@/components/loader";
import {
  addPayment,
  DebtPaymentFormInterface,
  deleteDebt,
  fetchDebtsList,
} from "@/utils/debts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { capitalizeFirstLetter } from "@/components/functions/CapitalFirstLetter";
import NumberTextField from "@/components/NumberTextField";

interface DebtsListInterface {
  _id: string;
  creditor: string;
  debtor: string;
  amount: number;
  userId: string;
  dueDate: Date;
  total_payment: number;
  status: "paid" | "unpaid";
}

export const amountTypeList = ["balance", "wallet"];

function parseFormattedNumber(str: string) {
  return parseFloat(str.replace(/\./g, "").replace(",", "."));
}

const DebtsList = () => {
  const router = useRouter();
  const [menuAnchor, setMenuAnchor] = useState<{
    anchorEl: HTMLElement | null;
    id: string | null;
  }>({ anchorEl: null, id: null });

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState("");
  const [debtsList, setDebtsList] = useState<DebtsListInterface[]>([]);
  const [selectedDebt, setSelectedDebt] = useState<DebtsListInterface>();
  const [language, setLanguage] = useState("EN");
  const [tabValue, setTabValue] = useState<"unpaid" | "paid">("unpaid");
  const [openDialogAdd, setOpenDialogAdd] = useState(false);

  const [valuePaymentAmount, setValuePaymentAmount] = useState("0,00");
  const [valuePaymentDesc, setValuePaymentDesc] = useState("");
  const [amountType, setAmountType] = useState("");
  const [paymentDate, setPaymentDate] = useState<Dayjs | null>(dayjs());
  const [payment, setPayment] = useState<DebtPaymentFormInterface>();
  const [debtsById, setDebtsById] = useState<DebtsListInterface>();
  const [outstanding, setOutstanding] = useState<number>(0);
  const [userId, setUserId] = useState("");

  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    const lang = localStorage.getItem("language");
    setLanguage(lang || "EN");

    if (!isAuthenticated()) {
      router.push("/login");
    } else if (userData && token) {
      setTokens(token);
      const user = JSON.parse(userData);
      setUserId(user?._id);
      if (user) {
        const fetchData = async () => {
          try {
            const response = await fetchDebtsList(token, user?._id);
            setDebtsList(response);
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
      }
    }
  }, []);

  const loadDebts = async () => {
    const response = await fetchDebtsList(tokens, userId);
    setDebtsList(response); // simpan ke state
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  // Filter berdasarkan search + tab status
  const filteredData = debtsList.filter(
    (item) =>
      item.status === tabValue &&
      (item.creditor.toLowerCase().includes(searchQuery) ||
        item.debtor.toLowerCase().includes(searchQuery) ||
        DateFormatter(String(item.dueDate)).includes(searchQuery) ||
        item.amount.toString().includes(searchQuery))
  );

  // menu action
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ anchorEl: event.currentTarget, id });
  };
  const handleMenuClose = () => {
    setMenuAnchor({ anchorEl: null, id: null });
  };

  // add new debt
  const handleAdd = async () => {
    setIsLoading(true);
    try {
      await router.push(`/main/debts/add`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async (data: DebtsListInterface) => {
    setIsLoading(true);
    try {
      await router.push(`/main/debts/view/${data._id}`);
    } finally {
      setIsLoading(false);
    }
    handleMenuClose();
  };

  const handlePayment = async (data: DebtsListInterface) => {
    // setIsLoading(true);
    // try {
    //   await router.push(`/main/debts/edit/${data._id}`);
    // } finally {
    //   setIsLoading(false);
    // }
    setDebtsById(data);
    setOutstanding(data.amount - data.total_payment);
    setOpenDialogAdd(true);
    handleMenuClose();
  };

  const handleDeleteClick = (data: DebtsListInterface) => {
    setSelectedDebt(data);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    setIsLoading(true);
    const deleteData = async () => {
      try {
        await deleteDebt(selectedDebt?._id || "", selectedDebt?.userId || "");
        const responseData = await fetchDebtsList(
          tokens,
          selectedDebt?.userId || ""
        );
        setDebtsList(responseData);
      } finally {
        setIsLoading(false);
      }
    };
    deleteData();
    setOpenDialog(false);
  };

  const handlePaymentAmountChange = (val: string) => {
    setValuePaymentAmount(val);
  };

  const handleSubmitPayment = () => {
    console.log(payment, "payment");

    // if (!payment) {
    //   const newPayment = {
    //     _id: crypto.randomUUID(),
    //     description: valuePaymentDesc,
    //     amount: parseFormattedNumber(valuePaymentAmount),
    //     amountType: amountType,
    //     date: paymentDate ? paymentDate.toDate() : new Date(),
    //   };
    //   setPayments([...payments, newPayment]);
    // } else {
    //   setPayments((prev) =>
    //     prev.map((item) =>
    //       item._id === payment._id
    //         ? {
    //             ...item,
    //             description: valuePaymentDesc,
    //             amount: parseFormattedNumber(valuePaymentAmount),
    //             date: paymentDate ? paymentDate.toDate() : new Date(),
    //           }
    //         : item
    //     )
    //   );
    // }
    const submitData = async () => {
      const newPayment = {
        // _id: crypto.randomUUID(),
        description: valuePaymentDesc,
        amount: parseFormattedNumber(valuePaymentAmount),
        amountType: amountType,
        date: paymentDate ? paymentDate.toDate() : new Date(),
      };
      if (debtsById?._id) {
        setIsLoading(true);
        try {
          await addPayment(debtsById._id, userId, newPayment);
          setAlert({
            type: "success",
            message:
              language === "ID"
                ? "Payment berhasil ditambahkan"
                : "Payment successfully added",
          });
          await loadDebts(); // refresh state
        } catch (err) {
          console.error(err);
          setAlert({
            type: "error",
            message:
              language === "ID"
                ? "Gagal menambahkan payment"
                : "Failed to add payment",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    submitData();
    setOpenDialogAdd(false);
    setDebtsById(undefined);
    setPayment(undefined);
    setValuePaymentDesc("");
    setAmountType("");
    setValuePaymentAmount("0,00");
    setPaymentDate(dayjs());
  };

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <Typography variant="h6" paddingBottom={3} fontWeight="bold">
          {language === "ID" ? "Daftar Hutang" : "Debts List"}
        </Typography>

        {/* Tabs untuk filter Paid/Unpaid */}
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          sx={{ marginBottom: 2 }}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab
            value="unpaid"
            label={language === "ID" ? "Belum Lunas" : "Unpaid"}
            color="secondary"
          />
          <Tab
            value="paid"
            label={language === "ID" ? "Lunas" : "Paid"}
            color="secondary"
          />
        </Tabs>

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
              {language === "ID" ? "Tambah" : "Add"}
            </Button>
          </Grid>
        </Grid>

        {filteredData?.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={100}
          >
            <Typography variant="body2" color="textSecondary">
              {language === "ID" ? "Tidak ada data" : "No Data"}
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredData?.map((x) => (
              <ListItem
                key={x._id}
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
                          {language === "ID" ? "Lihat Data" : "View"}
                        </Typography>
                      </MenuItem>

                      {tabValue === "unpaid" && (
                        <MenuItem onClick={() => handlePayment(x)}>
                          <Typography component="span" variant="body2">
                            {language === "ID" ? "Bayar" : "Payment"}
                          </Typography>
                        </MenuItem>
                      )}

                      {tabValue === "unpaid" && (
                        <MenuItem
                          onClick={() => handleDeleteClick(x)}
                          sx={{ color: "error.main" }}
                        >
                          <Typography component="span" variant="body2">
                            {language === "ID" ? "Hapus" : "Delete"}
                          </Typography>
                        </MenuItem>
                      )}
                    </Menu>
                  </>
                }
              >
                <ListItemText
                  disableTypography
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" fontWeight="bold">
                        {x.creditor} → {x.debtor}
                      </Typography>
                      <Typography variant="body2">
                        {DateFormatter(String(x.dueDate))}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography
                        component="span"
                        color="error"
                        variant="body2"
                      >
                        {formatCurrencyIDR(x.amount)}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          color: x.status === "paid" ? "green" : "orange",
                          fontWeight: "bold",
                        }}
                      >
                        {x.status.toUpperCase()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Dialog Konfirmasi Delete */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            {language === "ID" ? "Konfirmasi Hapus" : "Delete Confirmation"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {language === "ID"
                ? "Apakah kamu yakin ingin menghapus data ini?"
                : "Are you sure you want to delete?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
            >
              {language === "ID" ? "Batal" : "Cancel"}
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
            >
              {language === "ID" ? "Hapus" : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* dialog add/edit payment */}
        <Dialog
          open={openDialogAdd}
          onClose={() => setOpenDialogAdd(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {" "}
            {language === "ID" ? "Pembayaran" : "Payment"}
          </DialogTitle>
          <DialogContent>
            <Box width="100%" display="flex" gap={3} flexDirection="column">
              <Box width="100%">
                <TextField
                  fullWidth
                  id="standard-basic"
                  label={language === "ID" ? "Pemberi Pinjaman" : "Creditor"}
                  color="secondary"
                  variant="standard"
                  value={debtsById?.creditor || ""}
                  disabled
                  // onChange={(e) => setValuePaymentDesc(e.target.value)}
                />
              </Box>
              <Box width="100%">
                <TextField
                  disabled
                  fullWidth
                  id="standard-basic"
                  label={language === "ID" ? "Total Pinjaman" : "Loan Amount"}
                  variant="standard"
                  color="secondary"
                  value={
                    debtsById?.amount
                      ? formatCurrencyIDR(debtsById.amount)
                      : "0,00"
                  }
                  // onChange={(e) => setAmount(e.target.value)}
                />
              </Box>
              <Box width="100%">
                <TextField
                  disabled
                  fullWidth
                  id="standard-basic"
                  label={language === "ID" ? "Total Pembayaran" : "Paid Amount"}
                  variant="standard"
                  color="secondary"
                  value={
                    debtsById?.total_payment
                      ? formatCurrencyIDR(debtsById.total_payment)
                      : "0,00"
                  }
                  // onChange={(e) => setAmount(e.target.value)}
                />
              </Box>
              <Box width="100%">
                <TextField
                  disabled
                  fullWidth
                  id="standard-basic"
                  label={
                    language === "ID"
                      ? "Sisa Pembayaran"
                      : "Outstanding Payment"
                  }
                  variant="standard"
                  color="secondary"
                  value={formatCurrencyIDR(outstanding)}
                  // onChange={(e) => setAmount(e.target.value)}
                />
              </Box>
              <Box width="100%">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    format="DD/MM/YYYY"
                    maxDate={dayjs()}
                    value={paymentDate}
                    label={
                      language === "ID" ? "Tanggal Pembayaran" : "Payment Date"
                    }
                    onChange={(v) => setPaymentDate(v)}
                    // disabled={mode === "view"}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "standard",
                        color: "secondary",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <Box width="100%">
                <TextField
                  fullWidth
                  id="standard-basic"
                  label={language === "ID" ? "Deskripsi" : "Description"}
                  color="secondary"
                  variant="standard"
                  value={valuePaymentDesc}
                  onChange={(e) => setValuePaymentDesc(e.target.value)}
                />
              </Box>
              <Box width="100%">
                <Autocomplete
                  fullWidth
                  disablePortal
                  options={amountTypeList}
                  // sx={{ width: 300 }}
                  value={capitalizeFirstLetter(amountType)}
                  onChange={(event, newValue) => setAmountType(newValue || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      color="secondary"
                      label={
                        language === "ID" ? "Tipe Pembayaran" : "Payment Type"
                      }
                      variant="standard"
                    />
                  )}
                />
              </Box>
              <Box width="100%">
                <NumberTextField
                  label={
                    language === "ID" ? "Jumlah Pembayaran" : "Payment Amount"
                  }
                  color="secondary"
                  value={valuePaymentAmount}
                  onChange={handlePaymentAmountChange}
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
              {language === "ID" ? "Batal" : "Cancel"}
            </Button>
            <Button
              onClick={() => handleSubmitPayment()}
              disabled={
                !valuePaymentDesc ||
                valuePaymentAmount === "0,00" ||
                parseFormattedNumber(valuePaymentAmount) > outstanding
              }
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
              //   disabled={
              //     amountType && valueDesc && valueExpensesAmount != "0,00"
              //       ? false
              //       : true
              //   }
            >
              {language === "ID" ? "Simpan" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!alert}
          autoHideDuration={3000} // <-- timeout 3 detik
          onClose={() => setAlert(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }} // posisi melayang
        >
          <Alert
            onClose={() => setAlert(null)}
            variant="filled"
            severity={alert?.type}
            sx={{ width: "100%" }}
          >
            {alert?.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default DebtsList;
