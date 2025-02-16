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
import { dummyData, dummyDataDetails } from "../data";
import { useRouter } from "next/navigation";

interface ExpensesFormInterface {
  id?: string;
  mode?: string;
}

interface CashOutInterface {
  id?: string;
  expenseId?: string;
  desc: string;
  amount: number;
}

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

  function parseFormattedNumber(str: string) {
    return parseFloat(str.replace(/\./g, "").replace(",", "."));
  }

  const [cashout, setCashout] = useState<CashOutInterface>();
  const [allCashout, setAllCashout] = useState<CashOutInterface[]>([]);

  const formatNumberToIDR = (num: number): string => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const calculateTotalCashout = (data: CashOutInterface[]) => {
    const totalAmount = data.reduce((total, cashout) => {
      return total + (cashout.amount || 0); // Pastikan cashout.amount ada, jika tidak default ke 0
    }, 0);

    setValueAmount(totalAmount);
  };
  
  const handleBackPage = () => {
    router.push(`/expenses`);
  }
  useEffect(() => {
    if (id) {
      if (dummyData) {
        const findExpensesData = dummyData?.find((x) => x?.id === id);
        setValueTitle(findExpensesData?.title || "");
        const dateString = findExpensesData?.tanggal || "";
        const parsedDate = dayjs(dateString);
        setSelectedDate(parsedDate);
  
        if (dummyDataDetails) {
          const filterAllCashout = dummyDataDetails?.filter(
            (x) => x?.expenseId === id
          );
          setAllCashout(filterAllCashout);
        }
      }
    }
  }, [id, dummyData, dummyDataDetails]); 

  useEffect(() => {
    if (openDialogAdd == false) {
      if (openDialog == false) {
        setCashout(undefined);
      }
      setValueDesc("");
      setValueExpensesAmount("0,00");
    } else {
      if (cashout) {
        setValueDesc(cashout?.desc);
        const formatAmount = formatNumberToIDR(cashout?.amount);
        setValueExpensesAmount(formatAmount);
      }
    }
  }, [openDialogAdd, cashout, openDialog]);

  useEffect(() => {
    calculateTotalCashout(allCashout);
  }, [allCashout]);

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
    //   router.push(`/expenses/add`);
  };

  const handleEdit = (data: CashOutInterface) => {
    setCashout(data);
    setOpenDialogAdd(true);
    // router.push(`/expenses/edit/${data.id}`);
    handleMenuClose();
  };

  const handleDeleteClick = (data?: CashOutInterface) => {
    setCashout(data);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = (data?: CashOutInterface) => {

    if (data) {
      setAllCashout((prevCashout) =>
        prevCashout.filter((item) => item.id !== data.id)
      );
    }

    setOpenDialog(false);
  };

  const handleSubmitCashOut = (data?: CashOutInterface) => {
    if (!data) {
      const newCashout = {
        id: crypto.randomUUID(),
        desc: valueDesc,
        amount: parseFormattedNumber(valueExpensesAmount),
      };
      setAllCashout([...allCashout, newCashout]);
      setCashout(undefined);
    } else {
      setAllCashout((prevCashout) =>
        prevCashout.map((item) =>
          item.id === data.id
            ? {
                ...item,
                desc: valueDesc,
                amount: parseFormattedNumber(valueExpensesAmount),
              }
            : item
        )
      );
      setCashout(undefined);
    }
    setOpenDialogAdd(false);
  };

  return (
    <div>
      <Typography variant="h6" paddingBottom={3} fontWeight="bold">
        Expenses Form
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
            label="Title"
            variant="standard"
            value={valueTitle}
            onChange={handleTitleChange}
          />
        </Box>
        <Box width={{ xs: "100%", md: "50%" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true, // ✅ Agar input full width
                  variant: "standard", // ✅ Menggunakan variant "standard"
                },
              }}
              label="Date"
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
              Add Cashout
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
                  <Typography variant="body1" paddingTop={2} fontWeight="bold">
                    Cashout List
                  </Typography>
                </Box>
              </Box>
              <Box width="50%" display="flex" justifyContent="flex-end">
                <Box>
                  <Typography variant="body2" paddingTop={2} fontWeight="bold">
                    Total: {formatCurrencyIDR(valueAmount)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {allCashout?.length === 0 ? (
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
                {allCashout?.map((x) => (
                  <ListItem
                    key={x?.id}
                    alignItems="flex-start"
                    sx={{ borderRadius: "5px", marginTop: 1, boxShadow: 1 }}
                    secondaryAction={
                      mode != "view" && (
                        <>
                          <IconButton
                            edge="end"
                            onClick={(e) => handleMenuOpen(e, x.id!)}
                          >
                            <MoreVertIcon />
                          </IconButton>

                          <Menu
                            anchorEl={menuAnchor.anchorEl}
                            open={
                              menuAnchor.anchorEl !== null &&
                              menuAnchor.id === x.id
                            }
                            onClose={handleMenuClose}
                          >
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
                              {x?.desc}
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
              <Button fullWidth variant="contained" sx={{ bgcolor: "#904cee" }} onClick={handleBackPage}>
                Cancel
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
              >
                Save
              </Button>
            </Box>
          </>
        ) : (
          <Button fullWidth variant="contained" sx={{ bgcolor: "#904cee" }} onClick={handleBackPage}>
            Back
          </Button>
        )}
      </Box>
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
            onClick={() => handleDeleteConfirm(cashout)}
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
        <DialogTitle>Cashout</DialogTitle>
        <DialogContent>
          <Box width="100%" display="flex" gap={3} flexDirection="column">
            <Box width="100%">
              {" "}
              {/* Full width di mobile */}
              <TextField
                fullWidth
                id="standard-basic"
                label="Description"
                variant="standard"
                value={valueDesc}
                onChange={handlDescChange}
              />
            </Box>
            <Box width="100%">
              <NumberTextField
                label="Expenses Amount"
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
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmitCashOut(cashout)}
            variant="contained"
            sx={{ bgcolor: "#904cee" }}
            disabled={valueDesc && valueExpensesAmount != "0,00" ? false : true}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExpensesForm;
