"use client";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
import { formatCurrencyIDR } from "@/components/functions/IDRFormatter";
import { isAuthenticated } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchDashboard, fetchDashboardSummary } from "@/utils/dashboard";
import Loader from "@/components/loader";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddCardIcon from "@mui/icons-material/AddCard";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

// Contoh Data Dummy
const initialData = [
  { id: 1, month: "January" },
  { id: 2, month: "February" },
  { id: 3, month: "March" },
  { id: 4, month: "April" },
  { id: 5, month: "May" },
  { id: 6, month: "June" },
  { id: 7, month: "July" },
  { id: 8, month: "August" },
  { id: 9, month: "September" },
  { id: 10, month: "October" },
  { id: 11, month: "November" },
  { id: 12, month: "December  " },
];

interface DashboardDataInterface {
  calculateIncome: number;
  calculateExpenses: number;
  calculateBalance: number;
}

interface summaryInterface {
  id: number;
  income: number;
  expenses: number;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [balanceData, setBalanceData] = useState(0);
  const [walletData, setWalletData] = useState(0);
  const [incomeData, setIncomeData] = useState(0);
  const [expensesData, setExpensesData] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("EN");
  const [summaryData, setSummaryData] = useState<summaryInterface[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    const lang = localStorage.getItem("language");
    setLanguage(lang || "EN");
    if (!isAuthenticated()) {
      // Redirect hanya di klien
      router.push("/login");
    } else {
      if (userData && token) {
        const user = JSON.parse(userData);
        const fetchData = async () => {
          try {
            const response = await fetchDashboard(token, user?._id);
            const responseSummary = await fetchDashboardSummary(
              token,
              user?._id
            );
            setBalanceData(response?.calculateBalance);
            setIncomeData(response?.calculateIncome);
            setExpensesData(response?.calculateExpenses);
            setWalletData(response?.calculateWallet);
            setSummaryData(responseSummary);
          } catch (err) {
            setError("Failed to fetch dashboard data");
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
      } // Jika sudah login, selesai loading
    }
  }, []);
  // const [data, setData] = useState(initialData);

  // Hitung total pemasukan, pengeluaran, dan saldo bersih

  const handleFindMonth = (id: number) => {
    
    const data = initialData?.find((x) => x?.id === id);

    return data?.month
  };

  return isLoading == true ? (
    <Loader />
  ) : (
    <Box>
      <Typography variant="h6" paddingBottom={3} fontWeight="bold">
        {language === "ID" ? "Halaman Utama" : "Dashboard"}
      </Typography>
      <Grid container spacing={3}>
        {/* Kartu Net Balance */}
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: "#504BFD" }}>
            <CardContent>
              <Typography
                variant="h6"
                color="white"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CreditCardIcon />{" "}
                {language === "ID" ? "Rekening Utama" : "Main Balance"}
              </Typography>
              <Typography variant="h6" color="white">
                {formatCurrencyIDR(balanceData)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: "#904cee" }}>
            <CardContent>
              <Typography
                variant="h6"
                color="white"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <AccountBalanceWalletIcon />{" "}
                {language === "ID" ? "Dompet" : "My Wallet"}
              </Typography>
              <Typography variant="h6" color="white">
                {formatCurrencyIDR(walletData)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Kartu Total Income */}
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: "#1EC612" }}>
            <CardContent>
              <Typography
                variant="h6"
                color="white"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <AddCardIcon />{" "}
                {language === "ID" ? "Total Pemasukan" : "Total Income"}
              </Typography>
              <Typography variant="h6" color="white">
                {formatCurrencyIDR(incomeData)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Kartu Total Expenses */}
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: "#DC1717" }}>
            <CardContent>
              <Typography
                variant="h6"
                color="white"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <ShoppingCartCheckoutIcon />{" "}
                {language === "ID" ? "Total Pengeluaran" : "Total Expenses"}
              </Typography>
              <Typography variant="h6" color="white">
                {formatCurrencyIDR(expensesData)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grafik */}
      <Box sx={{ marginTop: 4 }} boxShadow={1}>
        <Box marginLeft={2} paddingTop={2}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Monthly Financial Summary
          </Typography>
        </Box>
        <Box marginRight={2} marginLeft={2} marginBottom={2}>
          <List>
            {summaryData?.map((x, i) => (
              <ListItem
                key={i}
                alignItems="flex-start"
                sx={{ borderRadius: "5px", marginTop: 1, boxShadow: 1 }}
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
                          {handleFindMonth(x?.id)}
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
                          {formatCurrencyIDR(x?.income)}
                        </Typography>
                        <Typography
                          component="span"
                          color="error"
                          variant="body2"
                        >
                          {formatCurrencyIDR(x?.expenses)}
                        </Typography>
                      </Box>
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* <Box sx={{ marginTop: 4, height: 300 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Financial Trends
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#2196f3"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#f44336"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box> */}
    </Box>
  );
}
