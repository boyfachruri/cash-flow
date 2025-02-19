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
import { formatCurrencyIDR } from "@/components/functions/IDRFormatter";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";
import { DateFormatter } from "@/components/functions/DateFormatter";
import { dummyData } from "./data";
// import { IncomeListInterface } from "./interfaceProps";
import { isAuthenticated } from "@/utils/auth";
import { deleteIncome, fetchIncomeList } from "@/utils/income";
import Loader from "@/components/loader";

interface IncomeListInterface {
  _id: string;
  title: string;
  amount: number;
  userId: string;
  date: Date;
}

const IncomeList = () => {
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState("");
  const [incomeList, setIncomeList] = useState<IncomeListInterface[]>([]);
  const [incomeListById, setIncomeListById] = useState<IncomeListInterface>();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (!isAuthenticated()) {
      // Redirect hanya di klien
      router.push("/login");
    } else {
      if (userData && token) {
        setTokens(token);
        const user = JSON.parse(userData);
        if (user) {
          const fetchData = async () => {
            try {
              const response = await fetchIncomeList(token, user?._id);

              setIncomeList(response);
            } catch (err) {
              setError("Failed to fetch dashboard data");
            } finally {
              setIsLoading(false);
            }
          };
          fetchData();
        }
      } // Jika sudah login, selesai loading
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  // Filter data berdasarkan pencarian
  const filteredData = incomeList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery) ||
      DateFormatter(String(item.date)).includes(searchQuery) ||
      item.amount.toString().includes(searchQuery)
  );

  // Handle open/close menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ anchorEl: event.currentTarget, id });
  };

  const handleMenuClose = () => {
    setMenuAnchor({ anchorEl: null, id: null });
  };
  const handleAdd = () => {
    router.push(`/main/income/add`);
  };

  // Aksi untuk pindah screen
  const handleView = (data: IncomeListInterface) => {
    router.push(`/main/income/view/${data._id}`);
    handleMenuClose();
  };

  const handleEdit = (data: IncomeListInterface) => {
    router.push(`/main/income/edit/${data._id}`);
    handleMenuClose();
  };

  // Handle delete dialog
  const handleDeleteClick = (data: IncomeListInterface) => {
    setIncomeListById(data);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    const deleteData = async () => {
      try {
        const response = await deleteIncome(
          incomeListById?._id || "",
          incomeListById?.userId || ""
        );

        const responseData = await fetchIncomeList(
          tokens,
          incomeListById?.userId || ""
        );

        setIncomeList(responseData);
      } catch (err) {
        console.error(err);
      }
      // finally {
      //   setIsLoading(false);
      // }
    };
    deleteData();
    setOpenDialog(false);
  };

  return isLoading == true ? (
    <Loader />
  ) : (
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

      {filteredData?.length === 0 ? (
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
          {filteredData?.map((x) => (
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
                        color="success"
                        variant="body2"
                      >
                        {formatCurrencyIDR(x?.amount)}
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
      )}

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
            onClick={() => handleDeleteConfirm()}
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

export default IncomeList;
