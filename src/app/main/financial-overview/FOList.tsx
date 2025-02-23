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
// import { FoListInterface } from "./interfaceProps";
import { isAuthenticated } from "@/utils/auth";
import Loader from "@/components/loader";
import { createFo, fetchFo } from "@/utils/fo";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface FoListInterface {
  _id?: string;
  userId: string;
  fromDate: Date;
  toDate: Date;
  date: Date;
}

const FoList = () => {
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
  const [foList, setFoList] = useState<FoListInterface[]>([]);
  const [foListById, setFoListById] = useState<FoListInterface>();
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedDateStart, setSelectedDateStart] = useState<Dayjs | null>(
    null
  );
  const [selectedDateEnd, setSelectedDateEnd] = useState<Dayjs | null>(null);
  const [userId, setUserId] = useState("");
   const [language, setLanguage] = useState("EN");

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
        setTokens(token);
        const user = JSON.parse(userData);
        if (user) {
          setUserId(user?._id);
          const fetchData = async () => {
            try {
              const response = await fetchFo(token, user?._id);

              setFoList(response);
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
  const filteredData = foList.filter(
    (item) =>
      DateFormatter(String(item.fromDate)).includes(searchQuery) ||
      DateFormatter(String(item.toDate)).includes(searchQuery) ||
      DateFormatter(String(item.date)).includes(searchQuery)
  );

  // Handle open/close menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor({ anchorEl: event.currentTarget, id });
  };

  const handleMenuClose = () => {
    setMenuAnchor({ anchorEl: null, id: null });
  };
  const handleAdd = async () => {
    setOpenDialogAdd(true);
  };

  // Aksi untuk pindah screen
  const handleView = async (data: FoListInterface) => {
    setIsLoading(true);

    try {
      await router.push(`/main/financial-overview/view/${data._id}`);
    } finally {
      setIsLoading(false);
    }

    handleMenuClose();
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const newData = {
      date: selectedDate ? selectedDate.toDate() : new Date(),
      fromDate: selectedDateStart ? selectedDateStart.toDate() : new Date(),
      toDate: selectedDateEnd ? selectedDateEnd.toDate() : new Date(),
      userId: userId,
    };
    const submitData = async () => {
      try {
        const response = await createFo(newData);

        const responseData = await fetchFo(tokens, userId || "");
        setFoList(responseData);
        setOpenDialogAdd(false);
        setSelectedDateStart(null)
        setSelectedDateEnd(null)
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    submitData();
  };

  const handleStartDateChange = (newValue: Dayjs | null) => {
    if (newValue && selectedDateEnd && newValue.isAfter(selectedDateEnd)) {
      setSelectedDateEnd(newValue); // Atur end date agar minimal sama dengan start date
    }
    setSelectedDateStart(newValue);
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    if (newValue && selectedDateStart && newValue.isBefore(selectedDateStart)) {
      setSelectedDateStart(newValue); // Atur start date agar maksimal sama dengan end date
    }
    setSelectedDateEnd(newValue);
  };

  return (
    <>
      {isLoading == true && <Loader />}
      <div>
        {/* <div> */}
        <Typography variant="h6" paddingBottom={3} fontWeight="bold">
          {language === 'ID' ? 'Ringkasan Keuangan' :  "Financial Overview"}
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
              {language === 'ID' ? 'Tambah' :  "Add"}
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
              {language === 'ID' ? 'Tidak ada data' :  "No Data"}
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
                          {language === 'ID' ? 'Lihat Data' : "View"}
                        </Typography>
                      </MenuItem>
                      {/* <MenuItem onClick={() => handleEdit(x)}>
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
                      </MenuItem> */}
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
                          {language === 'ID' ? 'Tanggal Mulai:' : "Start Date:"} {DateFormatter(String(x?.fromDate))}
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
                          fontWeight="bold"
                        >
                          {language === 'ID' ? 'Tanggal Akhir:' : "End Date:"} {DateFormatter(String(x?.toDate))}
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

        <Dialog
          open={openDialogAdd}
          onClose={() => setOpenDialogAdd(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Calculate Financial Overview</DialogTitle>
          <DialogContent>
          {isLoading == true && <Loader />}
            <Box width="100%" display="flex" gap={3} flexDirection="column">
              <Box width="100%">
                {" "}
                {/* Full width di mobile */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    format="DD/MM/YYYY"
                    disabled
                    slotProps={{
                      textField: {
                        color: "secondary",
                        fullWidth: true, // ✅ Agar input full width
                        variant: "standard", // ✅ Menggunakan variant "standard"
                      },
                    }}
                    label={language === 'ID' ? 'Tanggal Rilis' : "Release Date"}
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                  />
                </LocalizationProvider>
              </Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box width="100%">
                  <MobileDatePicker
                    format="DD/MM/YYYY"
                    label={language === 'ID' ? 'Tanggal Mulai' : "Start Date"}
                    maxDate={selectedDate || undefined}
                    value={selectedDateStart}
                    onChange={handleStartDateChange}
                    slotProps={{
                      textField: {
                        color: "secondary",
                        fullWidth: true,
                        variant: "standard",
                      },
                    }}
                  />
                </Box>
                <Box width="100%" mt={2}>
                  <MobileDatePicker
                    format="DD/MM/YYYY"
                    label={language === 'ID' ? 'Tanggal Akhir' : "End Date"}
                    value={selectedDateEnd}
                    onChange={handleEndDateChange}
                    maxDate={selectedDate || undefined}
                    minDate={selectedDateStart || undefined} // ⬅️ Menentukan batas minimum
                    slotProps={{
                      textField: {
                        color: "secondary",
                        fullWidth: true,
                        variant: "standard",
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialogAdd(false)}
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
            >
              {language === 'ID' ? 'Batal' : "Cancel"}
            </Button>
            <Button
              onClick={() => handleSubmit()}
              variant="contained"
              sx={{ bgcolor: "#904cee" }}
              disabled={
                // disabledSave == false &&
                selectedDate && selectedDateEnd && selectedDateStart
                  ? false
                  : true
              }
            >
              {language === 'ID' ? 'Simpan' : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default FoList;
