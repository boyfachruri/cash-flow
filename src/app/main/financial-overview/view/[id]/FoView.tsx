"use client";

import { formatCurrencyIDR } from "@/components/functions/IDRFormatter";
import { isAuthenticated } from "@/utils/auth";
import { fetchFoById } from "@/utils/fo";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ExpensesDetailsFormInterface } from "@/utils/expenses";
import { IncomeDetailsFormInterface } from "@/utils/income";
import { DateFormatter } from "@/components/functions/DateFormatter";
import Loader from "@/components/loader";

interface FoViewInterface {
  id?: string;
  mode?: string;
}

export interface TransactionsDetailsInterface {
  _id?: string;
  title: string;
  amount: number;
  type: string;
  userId: string;
  date: Date;
  expensesDetails?: ExpensesDetailsFormInterface[];
  incomeDetails?: IncomeDetailsFormInterface[];
}

export interface TransactionsInterface {
  _id?: string;
  title: string;
  amount: number;
  userId: string;
  date: Date;
}

const FoView = ({ id, mode }: FoViewInterface) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedDateStart, setSelectedDateStart] = useState<Dayjs | null>(
    dayjs()
  );
  const [selectedDateEnd, setSelectedDateEnd] = useState<Dayjs | null>(dayjs());
  const [userId, setUserId] = useState("");
  const [tokens, setTokens] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalIncomeAmout, setTotalIncomeAmout] = useState(0);
  const [totalExpensesAmout, setTotalExpensesAmout] = useState(0);
  const [transactionList, setTransactionList] = useState<
    TransactionsDetailsInterface[]
  >([]);
  const [language, setLanguage] = useState("EN");

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
                const response = await fetchFoById(tokens, id, userId);
                const dateString = response?.date || "";
                const parsedDate = dayjs(dateString);
                setSelectedDate(parsedDate);

                const dateStringStart = response?.fromDate || "";
                const parsedDateStart = dayjs(dateStringStart);
                setSelectedDateStart(parsedDateStart);

                const dateStringEnd = response?.toDate || "";
                const parsedDateEnd = dayjs(dateStringEnd);
                setSelectedDateEnd(parsedDateEnd);

                setTotalIncomeAmout(response?.totalIncome);
                setTotalExpensesAmout(response?.totalExpenses);
                setTransactionList(response?.transactions);
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

  return (
    <div>
      {isLoading == true && <Loader />}
      <Box>
        <Grid container spacing={3}>
          {/* Kartu Net Balance */}
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true, // ✅ Agar input full width
                    variant: "standard",
                    color: "secondary", // ✅ Menggunakan variant "standard"
                  },
                }}
                label={language === 'ID' ? 'Tanggal Rilis' : "Release Date"}
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                disabled={mode == "view" ? true : false}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true, // ✅ Agar input full width
                    variant: "standard",
                    color: "secondary", // ✅ Menggunakan variant "standard"
                  },
                }}
                label={language === 'ID' ? 'Tanggal Mulai' : "Start Date"}
                value={selectedDateStart}
                onChange={(newValue) => setSelectedDateStart(newValue)}
                disabled={mode == "view" ? true : false}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true, // ✅ Agar input full width
                    variant: "standard",
                    color: "secondary", // ✅ Menggunakan variant "standard"
                  },
                }}
                label={language === 'ID' ? 'Tanggal Akhir' : "End Date"}
                value={selectedDateEnd}
                onChange={(newValue) => setSelectedDateEnd(newValue)}
                disabled={mode == "view" ? true : false}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Box>
      <Box width="100%">
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
                    {language === 'ID' ? 'Riwayat Transaksi' : "History Transactions"}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box width="100%" display="flex">
              <Box width="50%" display="flex">
                <Typography
                  component="span"
                  color="success"
                  variant="body1"
                  //   sx={{ mx: 1 }}
                >
                  {formatCurrencyIDR(totalIncomeAmout)}&nbsp;/&nbsp;
                </Typography>

                <Typography component="span" variant="body1" color="error">
                  {formatCurrencyIDR(totalExpensesAmout)}
                </Typography>
              </Box>
            </Box>

            {/* 
              {allCashin?.length === 0 ? (
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
              )} */}
          </Box>
        </Box>
        <Divider />
        <Box>
          {transactionList?.map((x, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Box width="100%">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      fontWeight="bold"
                    >
                      {x?.title}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      paddingRight={1}
                    >
                      {DateFormatter(String(x?.date))}
                    </Typography>
                  </Box>
                  {/* Amount akan berada di bawah Title */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      color={x?.type == "income" ? "success" : "error"}
                    >
                      {formatCurrencyIDR(x?.amount)}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>

              {x?.type === "income"
                ? x?.incomeDetails?.map(
                    (
                      y,
                      subIndex // Gunakan subIndex dari map dalam
                    ) => (
                      <AccordionDetails key={`income-${index}-${subIndex}`}>
                        <Box width="100%" paddingLeft={1}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <Typography
                              component="span"
                              variant="body2"
                              fontWeight="bold"
                            >
                              {y?.description}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              color="success"
                            >
                              {formatCurrencyIDR(y?.amount)}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider />
                      </AccordionDetails>
                    )
                  )
                : x?.expensesDetails?.map(
                    (
                      y,
                      subIndex // Gunakan subIndex dari map dalam
                    ) => (
                      <AccordionDetails key={`expenses-${index}-${subIndex}`}>
                        <Box width="100%" paddingLeft={1}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                          >
                            <Typography
                              component="span"
                              variant="body2"
                              fontWeight="bold"
                            >
                              {y?.description}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              color="error"
                            >
                              {formatCurrencyIDR(y?.amount)}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider />
                      </AccordionDetails>
                    )
                  )}
            </Accordion>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default FoView;
