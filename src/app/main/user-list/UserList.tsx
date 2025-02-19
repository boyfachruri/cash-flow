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
import React, { useEffect, useState } from "react";
import Search from "@/components/Search";
import Grid from "@mui/material/Grid2";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";
import { DateFormatter } from "@/components/functions/DateFormatter";
import { UserData } from "./data";
import { fetchUser, UserInterface } from "@/utils/user";
import Loader from "@/components/loader";

const UserList = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{
    anchorEl: HTMLElement | null;
    id: string | null;
  }>({
    anchorEl: null,
    id: null,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState("");
  const [tokens, settokens] = useState("");
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Ambil role dari localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setRole(user?.role || "user");
      setUserId(user?.id);
      // Jika bukan admin, redirect ke dashboard
      if (user.role !== "admin") {
        router.replace("/main/dashboard");
      }
    } else {
      router.replace("/login"); // Jika tidak ada data user, kembali ke login
    }
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem("access_token"); // Ambil token dari localStorage
      if (token) {
        try {
          const usersData = await fetchUser(token);
          settokens(token); // Panggil fetchUser untuk mengambil data pengguna
          setUsers(usersData); // Set data pengguna ke state
        } catch (error: any) {
          setError("Failed to fetch user data");
        } finally {
          setLoading(false); // Set loading ke false setelah data diambil
        }
      } else {
        setError("Token not found");
        setLoading(false);
      }
    };

    getUserData(); // Panggil fungsi untuk mengambil data pengguna
  }, []);

  if (!role) return <p>Loading...</p>;

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  // Filter data berdasarkan pencarian
  const filteredData = users.filter(
    (item) =>
      item.role.toLowerCase().includes(searchQuery) ||
      DateFormatter(DateFormatter(String(item?.date))).includes(searchQuery) ||
      item.fullname.toString().includes(searchQuery) ||
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
    router.push(`/main/user-list/add`);
  };

  // Aksi untuk pindah screen
  const handleView = (data: UserInterface) => {
    router.push(`/main/user-list/view/${data._id}`);
    handleMenuClose();
  };

  const handleEdit = (data: UserInterface) => {
    router.push(`/main/user-list/edit/${data._id}`);
    handleMenuClose();
  };

  // Handle delete dialog
  const handleDeleteClick = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = (data: UserInterface) => {
    setOpenDialog(false);
  };

  return (
    <div>
      {/* <div> */}
      <Typography variant="h6" paddingBottom={3} fontWeight="bold">
        User List
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
        {loading ? (
          <Loader />
        ) : (
          filteredData?.map((x) => (
            <ListItem
              key={x?._id}
              alignItems="flex-start"
              sx={{ borderRadius: "5px", marginTop: 1, boxShadow: 1 }}
              secondaryAction={
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
                      menuAnchor.anchorEl !== null && menuAnchor.id === x._id
                    }
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
                        {x?.fullname}
                      </Typography>
                      <Typography component="span" variant="body2">
                        {DateFormatter(String(x?.date))}
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
          ))
        )}
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
