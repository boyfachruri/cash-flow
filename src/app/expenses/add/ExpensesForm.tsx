"use client";

import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { dummyDataDetails } from "../data";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatCurrencyIDR } from "@/components/functions/IDRFormatter";
import dayjs, { Dayjs } from "dayjs";

interface ExpensesFormInterface {
  id?: String;
  mode?: string;
}

const ExpensesForm = ({ id, mode }: ExpensesFormInterface) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [valueTitle, setValueTitle] = useState<String>("");
  const [valueAmount, setValueAmount] = useState<String>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAdd = () => {
    //   router.push(`/expenses/add`);
  };
  const handleEdit = (data: any) => {
    // console.log(data, 'data');

    // router.push(`/expenses/edit/${data.id}`);
    handleMenuClose();
  };

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
      <Typography variant="h6" paddingBottom={3} fontWeight="bold">
        Expenses Form
      </Typography>
      <Box
        width="100%"
        display="flex"
        flexDirection={{ xs: "column", md: "row" }} // Column di mobile, row di desktop
        gap={2} // Jarak antar box
      >
        <Box width={{ xs: "100%", md: "50%" }}>
          {" "}
          {/* Full width di mobile */}
          <TextField
            fullWidth
            id="standard-basic"
            label="Title"
            variant="standard"
          />
        </Box>
        <Box width={{ xs: "100%", md: "50%" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true, // ✅ Agar input full width
                  variant: "standard", // ✅ Menggunakan variant "standard"
                },
              }}
              label="Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Box width="100%">
        <Box width="100%" marginTop={5}>
          <Button
            // fullWidth
            variant="contained"
            sx={{ bgcolor: "#904cee" }}
            // onClick={handleAdd}
          >
            Add Amount
          </Button>
        </Box>
        <Box
          width="100%"
          //   border={1}
          marginTop={3}
          paddingBottom={2}
          //   borderColor="#904cee"
          boxShadow={1}
        >
          <Box marginRight={2} marginLeft={2} marginBottom={1} marginTop={1}>
            <Typography variant="body1" paddingTop={2} fontWeight="bold">
              Expenses Detail List
            </Typography>
            <List>
              {dummyDataDetails?.map((x) => (
                <ListItem
                  key={x?.id}
                  alignItems="flex-start"
                  sx={{ borderRadius: "5px", marginTop: 1, boxShadow: 1 }}
                  secondaryAction={
                    <>
                      <IconButton edge="end" onClick={handleMenuOpen}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                      >
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
          </Box>
        </Box>
      </Box>
      <Box
        position="fixed"
        bottom={0}
        left={0}
        width="100%"
        bgcolor="white"
        boxShadow={3}
        p={2}
        display="flex"
        gap={2}
      >
        <Box width="50%">
          <Button fullWidth variant="contained" sx={{ bgcolor: "#904cee" }}>
            Cancel
          </Button>
        </Box>
        <Box width="50%">
          <Button
            disabled={valueTitle && valueAmount ? false : true}
            fullWidth
            variant="contained"
            sx={{ bgcolor: "#904cee" }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default ExpensesForm;
