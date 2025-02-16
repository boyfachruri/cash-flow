"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState } from "react";
import Search from "@/components/Search";
import Grid from "@mui/material/Grid2";
import { formatCurrencyIDR } from "@/components/functions/IDRFormatter";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter, usePathname } from "next/navigation";
import { dummyData } from "./data";

const ExpensesList = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const open = Boolean(anchorEl);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  // Filter data berdasarkan pencarian
  const filteredData = dummyData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery) ||
      item.tanggal.includes(searchQuery) ||
      item.pengeluaran.toString().includes(searchQuery)
  );

  // Handle open/close menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAdd = () => {
    router.push(`/expenses/add`);
  };

  // Aksi untuk pindah screen
  const handleView = (data: any) => {
    console.log(data, "data");

    router.push(`/expenses/view/${data.id}`);
    handleMenuClose();
  };

  const handleEdit = (data: any) => {
    console.log(data, "data");

    router.push(`/expenses/edit/${data.id}`);
    handleMenuClose();
  };

  // Handle delete dialog
  const handleDeleteClick = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = (data: any) => {
    console.log("Delete data:", data);
    setOpenDialog(false);
  };

  return (
    <div>
      {/* <div> */}
      <Typography variant="h6" paddingBottom={3} fontWeight="bold">
        Expenses List
      </Typography>
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
            Add
          </Button>
        </Grid>
      </Grid>
      {/* </div> */}

      <List>
        {filteredData?.map((x) => (
          <ListItem
            key={x?.id}
            alignItems="flex-start"
            sx={{ borderRadius: "5px", marginTop: 1, boxShadow: 1 }}
            secondaryAction={
              <>
                <IconButton edge="end" onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                  <MenuItem onClick={() => handleView(x)}>
                    <Typography component="span" variant="body2">
                      View
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleEdit(x)}>
                    <Typography component="span" variant="body2">
                      Edit
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={handleDeleteClick}
                    sx={{ color: "error.main" }}
                  >
                    <Typography component="span" variant="body2">
                      Delete
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
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
                      {x?.title}
                    </Typography>
                    <Typography component="span" variant="body2">
                      {x?.tanggal}
                    </Typography>
                  </Box>
                </Typography>
              }
              secondary={
                <Typography component="div">
                  <Box display="flex" justifyContent="space-between">
                    <Typography component="span" color="error" variant="body2">
                      {formatCurrencyIDR(x?.pengeluaran)}
                    </Typography>
                    {/* <Typography component="span" variant="body2" >
                      {x?.tanggal}
                    </Typography> */}
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Tidak
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Ya, Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExpensesList;
