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
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { formatCurrencyIDR } from "@/components/functions/IDRFormatter";
import Loader from "@/components/loader";
import NumberTextField from "@/components/NumberTextField";
import { isAuthenticated } from "@/utils/auth";
import {
  createDebt,
  fetchDebtById,
  updateDebt,
  DebtPaymentFormInterface,
} from "@/utils/debts";
import { capitalizeFirstLetter } from "@/components/functions/CapitalFirstLetter";
import { amountTypeList } from "../../expenses/add/ExpensesForm";
import { DateFormatter } from "@/components/functions/DateFormatter";

interface DebtsFormProps {
  id?: string;
  mode?: "view" | "edit" | "add";
}

const DebtsForm = ({ id, mode }: DebtsFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [creditor, setCreditor] = useState("");
  const [debtor, setDebtor] = useState("");
  const [amount, setAmount] = useState("0,00");
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs());

  const [payments, setPayments] = useState<DebtPaymentFormInterface[]>([]);
  const [payment, setPayment] = useState<DebtPaymentFormInterface>();

  const [menuAnchor, setMenuAnchor] = useState<{
    anchorEl: HTMLElement | null;
    id: string | null;
  }>({ anchorEl: null, id: null });

  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);

  const [valuePaymentAmount, setValuePaymentAmount] = useState("0,00");
  const [valuePaymentDesc, setValuePaymentDesc] = useState("");

  const [totalPaid, setTotalPaid] = useState(0);

  const [language, setLanguage] = useState("EN");
  const [userId, setUserId] = useState("");
  // const [userData, setUserData] = useState("");
  const [tokens, setTokens] = useState("");
  const [amountType, setAmountType] = useState("");
  const [paymentDate, setPaymentDate] = useState<Dayjs | null>(dayjs());

  // helpers
  function parseFormattedNumber(str: string) {
    return parseFloat(str.replace(/\./g, "").replace(",", "."));
  }

  const formatNumberToIDR = (num: number): string => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const calcTotalPaid = (data: DebtPaymentFormInterface[]) => {
    const total = data.reduce((acc, p) => acc + (p.amount || 0), 0);
    setTotalPaid(total);
  };

  const getRemainingAmount = () => {
    const totalAmount = parseFormattedNumber(amount);
    return totalAmount - totalPaid;
  };

  const handlePaymentAmountChange = (val: string) => {
    const numVal = parseFormattedNumber(val);

    // kalau edit, tambahkan kembali payment lama ke remaining
    const oldPaymentAmount = payment ? payment.amount : 0;
    const remaining = getRemainingAmount() + oldPaymentAmount;

    if (numVal > remaining) {
      setValuePaymentAmount(String(remaining));
    } else {
      setValuePaymentAmount(val);
    }
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ anchorEl: e.currentTarget, id });
  };

  const handleMenuClose = () => setMenuAnchor({ anchorEl: null, id: null });

  const handleDeleteClick = (p: DebtPaymentFormInterface) => {
    setPayment(p);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (payment) {
      setPayments((prev) => prev.filter((x) => x._id !== payment._id));
    }
    setOpenDialog(false);
  };

  const handleAddPayment = () => {
    setOpenDialogAdd(true);
  };

  const handleSubmitPayment = () => {
    console.log(payment, "payment");

    if (!payment) {
      const newPayment = {
        _id: crypto.randomUUID(),
        description: valuePaymentDesc,
        amount: parseFormattedNumber(valuePaymentAmount),
        amountType: amountType,
        date: paymentDate ? paymentDate.toDate() : new Date(),
      };
      setPayments([...payments, newPayment]);
    } else {
      setPayments((prev) =>
        prev.map((item) =>
          item._id === payment._id
            ? {
                ...item,
                description: valuePaymentDesc,
                amount: parseFormattedNumber(valuePaymentAmount),
                date: paymentDate ? paymentDate.toDate() : new Date(),
              }
            : item
        )
      );
    }
    setOpenDialogAdd(false);
    setPayment(undefined);
    setValuePaymentDesc("");
    setAmountType("");
    setValuePaymentAmount("0,00");
    setPaymentDate(dayjs());
  };

  const handleSubmitData = () => {
    setIsLoading(true);
    const dataObj = {
      creditor,
      debtor,
      amount: parseFormattedNumber(amount),
      dueDate: dueDate ? dueDate.toDate() : new Date(),
      payments,
      userId,
    };

    if (id) {
      const submit = async () => {
        try {
          await updateDebt(id, userId, dataObj);
          router.push("/main/debts");
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      submit();
    } else {
      const submit = async () => {
        try {
          await createDebt(dataObj);
          router.push("/main/debts");
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      submit();
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    const lang = localStorage.getItem("language");
    setLanguage(lang || "EN");

    if (userData && token) {
      const user = JSON.parse(userData);
      setDebtor(user?.fullname);
      setUserId(user?._id);
      setTokens(token);
      if (!isAuthenticated()) {
        // Redirect hanya di klien
        router.push("/login");
      } else {
        if (id) {
          const fetchData = async () => {
            try {
              const response = await fetchDebtById(tokens, id, userId);
              setCreditor(response.creditor);
              setDebtor(response.debtor);
              setAmount(formatNumberToIDR(response.amount ?? 1));
              setDueDate(dayjs(response.dueDate));
              setPayments(response.payments || []);
            } catch (err) {
              console.error(err);
            } finally {
              setIsLoading(false);
            }
          };
          fetchData();
        } else {
          setIsLoading(false);
        } // Jika sudah login, selesai loading
      }
    }
  }, [id, userId, tokens]);

  console.log(amount, "amount");

  useEffect(() => {
    calcTotalPaid(payments);
  }, [payments]);

  return (
    <>
      {isLoading && <Loader />}
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          {id ? "Edit Debt" : "Add Debt"}
        </Typography>
        <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
          <Box width={{ xs: "100%", md: "50%" }}>
            <TextField
              disabled={mode == "view" ? true : false}
              fullWidth
              id="standard-basic"
              label={language === "ID" ? "Pemberi Pinjaman" : "Creditor"}
              variant="standard"
              color="secondary"
              value={creditor}
              onChange={(e) => setCreditor(e.target.value)}
            />
          </Box>
          <Box width={{ xs: "100%", md: "50%" }}>
            {mode === "view" ? (
              // <TextField
              //   disabled={mode == "view" ? true : false}
              //   label={language === "ID" ? "Jumlah" : "Amount"}
              //   color="secondary"
              //   value={amount}
              //   // onChange={setAmount}
              // />
              <TextField
                disabled
                fullWidth
                id="standard-basic"
                label={language === "ID" ? "Jumlah" : "Amount"}
                variant="standard"
                color="secondary"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            ) : (
              <NumberTextField
                // disabled={mode == "view" ? true : false}
                label={language === "ID" ? "Jumlah" : "Amount"}
                color="secondary"
                value={amount}
                onChange={setAmount}
              />
            )}
          </Box>
        </Box>
        <Box
          marginTop={2}
          display="flex"
          gap={2}
          flexDirection={{ xs: "column", md: "row" }}
        >
          <Box width={{ xs: "100%", md: "50%" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                format="DD/MM/YYYY"
                minDate={dayjs()}
                value={dueDate}
                label={language === "ID" ? "Tanggal Jatuh Tempo" : "Due Date"}
                onChange={(v) => setDueDate(v)}
                disabled={mode === "view"}
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
          <Box width={{ xs: "100%", md: "50%" }}></Box>
        </Box>
        <Box width="100%">
          {mode != "view" && (
            <Box width="100%" marginTop={5}>
              <Button
                // fullWidth
                variant="contained"
                sx={{ bgcolor: "#904cee" }}
                onClick={handleAddPayment}
              >
                {language === "ID" ? "Tambah Pembayaran" : "Add Payment"}
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
                      {language === "ID" ? "Daftar Pembayaran" : "Payment List"}
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
                      Total: {formatCurrencyIDR(totalPaid)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {payments.length === 0 ? (
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
                  {payments.map((p) => (
                    <ListItem
                      key={p._id}
                      alignItems="flex-start"
                      sx={{ borderRadius: "5px", boxShadow: 1, my: 1 }}
                      secondaryAction={
                        mode !== "view" && (
                          <>
                            <IconButton
                              edge="end"
                              onClick={(e) => handleMenuOpen(e, p._id!)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={menuAnchor.anchorEl}
                              open={
                                menuAnchor.anchorEl !== null &&
                                menuAnchor.id === p._id
                              }
                              onClose={handleMenuClose}
                            >
                              <MenuItem
                                onClick={() => {
                                  setPayment({
                                    ...p,
                                    date: paymentDate
                                      ? paymentDate.toDate()
                                      : new Date(),
                                  });
                                  setValuePaymentDesc(p.description || "");
                                  setValuePaymentAmount(
                                    formatNumberToIDR(p?.amount)
                                  );
                                  setPaymentDate(p.date ? dayjs(p.date) : null);
                                  setAmountType(p.amountType || "");
                                  setOpenDialogAdd(true);
                                  handleMenuClose();
                                }}
                              >
                                Edit
                              </MenuItem>
                              <MenuItem
                                sx={{ color: "error.main" }}
                                onClick={() => handleDeleteClick(p)}
                              >
                                Delete
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
                                {p?.description}
                              </Typography>
                              <Typography
                                component="span"
                                variant="body2"
                                fontWeight="bold"
                                color={
                                  p?.amountType == "balance"
                                    ? "#504BFD"
                                    : "#904cee"
                                }
                              >
                                {capitalizeFirstLetter(p?.amountType)}
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
                                {formatCurrencyIDR(p?.amount)}
                              </Typography>
                              <Typography variant="body2">
                                {DateFormatter(String(p.date))}
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

        {/* actions */}
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
                  onClick={() => router.push("/main/debts")}
                >
                  {language === "ID" ? "Batal" : "Cancel"}
                </Button>
              </Box>
              <Box width="50%">
                <Button
                  disabled={!creditor || !debtor || amount === "0,00"}
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: "#904cee" }}
                  onClick={handleSubmitData}
                >
                  {id
                    ? language === "ID"
                      ? "Ubah"
                      : "Update"
                    : language === "ID"
                    ? "Simpan"
                    : "Save"}
                </Button>
              </Box>
            </>
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
              onClick={() => router.push("/main/debts")}
            >
              {language === "ID" ? "Kembali" : "Back"}
            </Button>
          )}
        </Box>

        {/* dialog delete */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Delete Payment?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this payment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Delete
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    format="DD/MM/YYYY"
                    maxDate={dayjs()}
                    value={paymentDate}
                    label={
                      language === "ID" ? "Tanggal Pembayaran" : "Payment Date"
                    }
                    onChange={(v) => setPaymentDate(v)}
                    disabled={mode === "view"}
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
              disabled={!valuePaymentDesc || valuePaymentAmount === "0,00"}
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
      </Box>
    </>
  );
};

export default DebtsForm;
