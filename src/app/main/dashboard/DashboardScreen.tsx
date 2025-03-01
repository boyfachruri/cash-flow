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
import InsightsIcon from "@mui/icons-material/Insights";

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
  const [income30Data, setIncome30Data] = useState(0);
  const [expensesData, setExpensesData] = useState(0);
  const [expenses30Data, setExpenses30Data] = useState(0);
  const [expensesPercentage30, setExpensesPercentage30] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("EN");
  const [summaryData, setSummaryData] = useState<summaryInterface[]>([]);

  const initialData = [
    { id: 1, month: language == "ID" ? "Januari" : "January" },
    { id: 2, month: language == "ID" ? "Febuari" : "February" },
    { id: 3, month: language == "ID" ? "Maret" : "March" },
    { id: 4, month: language == "ID" ? "April" : "April" },
    { id: 5, month: language == "ID" ? "Mei" : "May" },
    { id: 6, month: language == "ID" ? "Juni" : "June" },
    { id: 7, month: language == "ID" ? "Juli" : "July" },
    { id: 8, month: language == "ID" ? "Agustus" : "August" },
    { id: 9, month: "September" },
    { id: 10, month: language == "ID" ? "Oktober" : "October" },
    { id: 11, month: "November" },
    { id: 12, month: language == "ID" ? "Desember" : "December" },
  ];

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
            setIncome30Data(response?.calculate30DayIncome);
            setExpenses30Data(response?.calculate30DayExpenses);
            setExpensesPercentage30(
              response?.percentage30DayExpensesFromIncome
            );
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

    return data?.month;
  };

  const handleDescExpensesPercentage = (perc: number) => {
    const roundedPercentage = perc.toFixed(2);
    if (perc <= 50) {
      const desc =
        language === "ID"
          ? `Keuangan bulan ini sehat! Pengeluaran hanya ${roundedPercentage}% dari pemasukan, tetap pertahankan pengelolaan yang baik.`
          : `This month's finances are healthy! Expenses are only ${roundedPercentage}% of income. Keep up the good financial management.`;
      return desc;
    } else if (perc <= 75) {
      const desc =
        language === "ID"
          ? `Pengeluaran bulan ini mencapai ${roundedPercentage}% dari pemasukan. Masih dalam batas wajar, tapi perlu lebih cermat mengatur keuangan.`
          : `This month's expenses reached ${roundedPercentage}% of income. Still within a reasonable range, but it's good to manage finances more carefully.`;
      return desc;
    } else {
      const desc =
        language === "ID"
          ? `Waspada! Pengeluaran bulan ini mencapai ${roundedPercentage}% dari pemasukan. Coba evaluasi dan kurangi pengeluaran agar lebih stabil.`
          : `Warning! This month's expenses have reached ${roundedPercentage}% of income. Consider evaluating and reducing expenses for better financial stability.`;
      return desc;
    }
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
        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={6}>
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
      </Grid>

      <Box sx={{ marginTop: 4 }} boxShadow={1}>
        <Box marginLeft={2} paddingTop={2}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {language == "ID"
              ? "Ringkasan Keuangan 30 Hari"
              : "30-Day Financial Summary"}
          </Typography>
        </Box>
        <Box
          marginRight={2}
          marginLeft={2}
          marginBottom={2}
          sx={{ marginTop: 2 }}
        >
          <Grid container spacing={3}>
            {/* Kartu Total Pemasukan */}
            <Grid item xs={12} md={6}>
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

            {/* Kartu Total Pengeluaran */}
            <Grid item xs={12} md={6}>
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
        </Box>
        <Box
          marginRight={2}
          marginLeft={2}
          marginBottom={2}
          sx={{ marginTop: 3, paddingBottom:3 }}
        >
          <Card sx={{ backgroundColor: "#FFA500", height: "100%" }}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Typography
                variant="h6"
                color="white"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <InsightsIcon />{" "}
                {language === "ID"
                  ? "Persentase Pengeluaran"
                  : "Expense Percentage"}
              </Typography>
              <Typography variant="h6" color="white">
                {expensesPercentage30.toFixed(2)}%
              </Typography>
              <Typography
                variant="body2"
                color="white"
                sx={{ marginTop: "auto" }}
              >
                {handleDescExpensesPercentage(expensesPercentage30)}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Grafik */}
      <Box sx={{ marginTop: 4 }} boxShadow={1}>
        <Box marginLeft={2} paddingTop={2}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {language == "ID"
              ? "Ringkasan Keuangan Bulanan"
              : "Monthly Financial Summary"}
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
