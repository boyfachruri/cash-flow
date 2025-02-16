"use client";

import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import Search from "@/components/Search";
import Grid from "@mui/material/Grid2";

const dummyData = [
  {
    id: 1,
    title: "Pengeluaran Bulan Januari",
    pengeluaran: 5000000,
    sisa: 1000000,
    tanggal: "06/01/2025",
  },
  {
    id: 2,
    title: "Pengeluaran Bulan Febuari",
    pengeluaran: 4000000,
    sisa: 2000000,
    tanggal: "06/01/2025",
  },
  {
    id: 3,
    title: "Pengeluaran Bulan Maret",
    pengeluaran: 5500000,
    sisa: 500000,
    tanggal: "06/01/2025",
  },
];

const TransactionList = () => {
  return (
    <div>
      {/* <div> */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 9, md: 11 }}>
          <Search onSearch={(query) => console.log("Search:", query)} />
        </Grid>
        <Grid size={{ xs: 3, md: 1 }} textAlign="right">
          <Button fullWidth variant="contained" sx={{ bgcolor: "#904cee" }}>
            Add
          </Button>
        </Grid>
      </Grid>
      {/* </div> */}

      <List>
        {dummyData?.map((x) => (
          <ListItem
            key={x?.id}
            alignItems="flex-start"
            sx={{ borderRadius: "5px", marginTop: 1, boxShadow: 1 }}
          >
            <ListItemText
              primary={x?.title}
              secondary={
                <Typography component="div" variant="body2">
                  <Box display="flex" justifyContent="space-between">
                    <Typography component="span" color="error">
                      Pengeluaran: {x?.pengeluaran}
                    </Typography>
                    <Typography component="span" color="success">
                      Sisa: {x?.sisa}
                    </Typography>
                  </Box>
                </Typography>
              }
            />
          </ListItem>
        ))}

        {/* <Divider variant="inset" component="li" /> */}

        {/* <Divider variant="inset" component="li" /> */}
        {/* <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Oui Oui"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: "text.primary", display: "inline" }}
                >
                  Sandra Adams
                </Typography>
                {" — Do you have Paris recommendations? Have you ever…"}
              </React.Fragment>
            }
          />
        </ListItem> */}
      </List>
    </div>
  );
};

export default TransactionList;
