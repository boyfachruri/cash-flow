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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";
import { DateFormatter } from "@/components/functions/DateFormatter";
import { UserData } from "./data";
import { UserListInterface } from "./interface";

const UserList = () => {
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
  const filteredData = UserData.filter(
    (item) =>
      item.role.toLowerCase().includes(searchQuery) ||
      DateFormatter(item.date).includes(searchQuery) ||
      item.name.toString().includes(searchQuery) ||
      item.status.toString().includes(searchQuery)
  );

  // Handle open/close menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ anchorEl: event.currentTarget, id });
  };

  const handleMenuClose = () => {
    setMenuAnchor({ anchorEl: null, id: null });
  };
  const handleAdd = () => {
    router.push(`/user-list/add`);
  };

  // Aksi untuk pindah screen
  const handleView = (data: UserListInterface) => {
    router.push(`/user-list/view/${data.id}`);
    handleMenuClose();
  };

  const handleEdit = (data: UserListInterface) => {
    router.push(`/user-list/edit/${data.id}`);
    handleMenuClose();
  };

  // Handle delete dialog
  const handleDeleteClick = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = (data: UserListInterface) => {
    setOpenDialog(false);
  };

  return (
    <div>
      {/* <div> */}
      <Typography variant="h6" paddingBottom={3} fontWeight="bold">
        Income List
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
                  {x?.status === "Active" && (
                    <MenuItem
                      onClick={handleDeleteClick}
                      sx={{ color: "error.main" }}
                    >
                      <Typography component="span" variant="body2">
                        Inactive
                      </Typography>
                    </MenuItem>
                  )}
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
                      {x?.name}
                    </Typography>
                    <Typography component="span" variant="body2">
                      {DateFormatter(x?.date)}
                    </Typography>
                  </Box>
                </Typography>
              }
              secondary={
                <Typography component="div">
                  <Box display="flex" justifyContent="space-between">
                    <Typography
                      component="span"
                      variant="body2"
                      //   fontWeight="bold"
                    >
                      {x?.role}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color={x?.status === "Inactive" ? "error" : "success"}
                    >
                      {x?.status}
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
        <DialogTitle>Inactive Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Inactive?
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
            Process
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserList;
