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

// Contoh Data Dummy
const initialData = [
  { month: "January", income: 5000000, expenses: 3000000 },
  { month: "February", income: 4500000, expenses: 3200000 },
  { month: "March", income: 6000000, expenses: 3500000 },
  { month: "April", income: 5000000, expenses: 3000000 },
  { month: "May", income: 4500000, expenses: 3200000 },
  { month: "June", income: 6000000, expenses: 3500000 },
  { month: "July", income: 5000000, expenses: 3000000 },
  { month: "August", income: 4500000, expenses: 3200000 },
  { month: "September", income: 6000000, expenses: 3500000 },
  { month: "October", income: 5000000, expenses: 3000000 },
  { month: "November", income: 4500000, expenses: 3200000 },
  { month: "December  ", income: 6000000, expenses: 3500000 },
];

export default function DashboardScreen() {
  // const [data, setData] = useState(initialData);

  // Hitung total pemasukan, pengeluaran, dan saldo bersih
  const totalIncome = initialData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = initialData.reduce((sum, item) => sum + item.expenses, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <Box>
      <Typography variant="h6" paddingBottom={3} fontWeight="bold">
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Kartu Net Balance */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#904cee" }}>
            <CardContent>
              <Typography variant="h6" color="white">
                Net Balance
              </Typography>
              <Typography variant="h6" color="white">
                {formatCurrencyIDR(netBalance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Kartu Total Income */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#1EC612" }}>
            <CardContent>
              <Typography variant="h6" color="white">
                Total Income
              </Typography>
              <Typography variant="h6" color="white">
                {formatCurrencyIDR(totalIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Kartu Total Expenses */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#DC1717" }}>
            <CardContent>
              <Typography variant="h6" color="white">
                Total Expenses
              </Typography>
              <Typography variant="h6" color="white">
                {formatCurrencyIDR(totalExpenses)}
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
            {initialData?.map((x, i) => (
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
                          {x?.month}
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
