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
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Search from "@/components/Search";
import Grid from "@mui/material/Grid2";
import { formatCurrencyIDR } from "@/components/functions/IDRFormatter";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";
import { dummyData } from "./data";
import { DummyDataListingProps } from "./interfaceProps";
import { DateFormatter } from "@/components/functions/DateFormatter";

const ExpensesList = () => {
  const router = useRouter();
  const [menuAnchor, setMenuAnchor] = useState<{
    anchorEl: HTMLElement | null;
    id: string | null;
  }>({
    anchorEl: null,
    id: null,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  // Filter data berdasarkan pencarian
  const filteredData = dummyData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery) ||
      DateFormatter(item.tanggal).includes(searchQuery) ||
      item.pengeluaran.toString().includes(searchQuery)
  );

  // Handle open/close menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ anchorEl: event.currentTarget, id });
  };

  const handleMenuClose = () => {
    setMenuAnchor({ anchorEl: null, id: null });
  };
  const handleAdd = () => {
    router.push(`/expenses/add`);
  };

  // Aksi untuk pindah screen
  const handleView = (data: DummyDataListingProps) => {
    router.push(`/expenses/view/${data.id}`);
    handleMenuClose();
  };

  const handleEdit = (data: DummyDataListingProps) => {
    router.push(`/expenses/edit/${data.id}`);
    handleMenuClose();
  };

  // Handle delete dialog
  const handleDeleteClick = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = (data: DummyDataListingProps) => {
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
                <IconButton
                  edge="end"
                  onClick={(e) => handleMenuOpen(e, x.id!)}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor.anchorEl}
                  open={menuAnchor.anchorEl !== null && menuAnchor.id === x.id}
                  onClose={handleMenuClose}
                >
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
                      {DateFormatter(x?.tanggal)}
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
      </List>
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
                  onClick={() => handleDeleteConfirm}
                  variant="contained"
                  sx={{ bgcolor: "#904cee" }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
    </div>
  );
};

export default ExpensesList;
