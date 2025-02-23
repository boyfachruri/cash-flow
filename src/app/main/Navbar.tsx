"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GridViewIcon from "@mui/icons-material/GridView";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import {
  Divider,
  Typography,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import AddCardIcon from "@mui/icons-material/AddCard";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useState } from "react";
import { isAuthenticated } from "@/utils/auth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { fetchDashboard } from "@/utils/dashboard";
import { formatCurrencyIDR } from "@/components/functions/IDRFormatter";
import Loader from "@/components/loader";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));



const limitToOneWord = (text: string) => {
  return text.split(" ")[0]; // Ambil hanya kata pertama
};

export default function Navbar({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [fullName, setfullName] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State untuk Menu
  const [openMenu, setOpenMenu] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [walletData, setWalletData] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [language, setLanguage] = useState("EN"); // Default ke Indonesia

  const dashboard = {
    id: 1,
    name: language === 'ID' ? "Halaman Utama" : "Dashboard",
    link: "/main/dashboard",
    icons: <GridViewIcon />,
  };
  
  const userList = {
    id: 5,
    name:  language === 'ID' ? "Daftar Pengguna" :"User List",
    link: "/main/user-list",
    icons: <PeopleIcon />,
  };
  
  const listApp = [
    { id: 2, name: language === 'ID' ? "Pemasukan" : "Income", link: "/main/income", icons: <AddCardIcon /> },
    {
      id: 3,
      name:  language === 'ID' ? "Dompet" : "My Wallet",
      link: "/main/wallet",
      icons: <AccountBalanceWalletIcon />,
    },
    {
      id: 4,
      name:  language === 'ID' ? "Pengeluaran" : "Expenses",
      link: "/main/expenses",
      icons: <ShoppingCartCheckoutIcon />,
    },
  ];
  
  const transactionList = {
    id: 6,
    name:  language === 'ID' ? "Ringkasan Keuangan" : "Financial Overview",
    link: "/main/financial-overview",
    icons: <CalculateIcon />,
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    handleCloseLangMenu()
    window.location.reload();
  };

  // State untuk menu bahasa
  const [anchorLang, setAnchorLang] = useState<null | HTMLElement>(null);

  const handleClickLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorLang(event.currentTarget);
  };

  const handleCloseLangMenu = () => {
    setAnchorLang(null);
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    const lang = localStorage.getItem("language");
    setLanguage(lang || 'EN');
    if (!isAuthenticated()) {
      // Redirect hanya di klien
      router.push("/login");
    } else {
      if (userData && token) {
        const user = JSON.parse(userData);
        setRole(user?.role || "user");
        setfullName(user?.fullname);
        setUserId(user?._id);
        const fetchData = async () => {
          try {
            const response = await fetchDashboard(token, user?._id);
            setWalletData(response?.calculateWallet);
          } catch (err) {
            setError("Failed to fetch dashboard data");
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
      } // Jika sudah login, selesai loading
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        setOpenSnackbar(true);
        setTimeout(() => {
          router.replace("/login");
        }, 3000); // Redirect setelah 3 detik
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 10000); // Cek setiap 10 detik

    return () => clearInterval(interval);
  }, []);

  const handleClickUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    router.push("/login"); // Redirect ke halaman login
  };

  return (
    <>
      {isLoading == true && <Loader />}
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar
            sx={{ bgcolor: "#904cee", display: "flex", alignItems: "center" }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography fontWeight="bold" variant="body2">
              Hi, {limitToOneWord(fullName)}
            </Typography>
            <Box sx={{ flexGrow: 1 }} /> {/* Spacer agar elemen di kanan */}
            <IconButton color="inherit" onClick={handleClickLangMenu}>
              <Typography fontWeight="bold">{language}</Typography>
            </IconButton>
            <Menu
              anchorEl={anchorLang}
              open={Boolean(anchorLang)}
              onClose={handleCloseLangMenu}
            >
              <MenuItem
                onClick={() => handleLanguageChange("ID")}
                style={{ fontFamily: "Segoe UI Emoji, Roboto, sans-serif" }}
              >
                Indonesia
              </MenuItem>
              <MenuItem
                onClick={() => handleLanguageChange("EN")}
                style={{ fontFamily: "Segoe UI Emoji, Roboto, sans-serif" }}
              >
                English
              </MenuItem>
            </Menu>
            <IconButton color="inherit" onClick={handleClickUserMenu}>
              <AccountCircleIcon />
            </IconButton>
            {/* Menu untuk Logout dan Profil */}
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleCloseMenu}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              {/* Saldo */}
              <MenuItem disableRipple>
                {/* <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}> */}
                <AccountBalanceWalletIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "#904cee" }}
                />
                <Typography variant="body2" color="#904cee" fontWeight="bold">
                  {formatCurrencyIDR(walletData)}
                </Typography>
                {/* </Box> */}
              </MenuItem>
              <Divider /> {/* Pemisah */}
              {/* Akun */}
              <MenuItem onClick={() => router.push(`/main/account/${userId}`)}>
                <ListItemIcon>
                  <AccountCircleIcon />
                  &nbsp; Account
                </ListItemIcon>
              </MenuItem>
              {/* Logout */}
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToAppIcon />
                  &nbsp; Logout
                </ListItemIcon>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRadius: "10px",
              marginTop: "10px",
              marginLeft: "3px",
              height: "calc(100% - 20px)",
              position: "absolute",
              top: 0,
              left: 0,
            },
          }}
          variant="temporary"
          anchor="left"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            elevation: 3,
          }}
          BackdropProps={{
            invisible: false,
          }}
        >
          <DrawerHeader>
            <Box width="100%" display="flex">
              <Box
                width="50%"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
              >
                <Typography fontWeight="bold" color="secondary">
                  R3g Cashflow
                </Typography>
              </Box>
              <Box width="50%" display="flex" justifyContent="flex-end">
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "ltr" ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
              </Box>
            </Box>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem key={dashboard.id} disablePadding>
              <ListItemButton
                onClick={() => router.push(dashboard.link)}
                sx={{
                  bgcolor: pathname.startsWith(dashboard.link)
                    ? "#EEE6FF"
                    : "transparent",
                  borderLeft: pathname.startsWith(dashboard.link)
                    ? "4px solid #904cee"
                    : "none",
                  "&:hover": {
                    bgcolor: "#EEE6FF",
                  },
                }}
              >
                <ListItemIcon>{dashboard.icons}</ListItemIcon>
                <ListItemText
                  primary={dashboard.name}
                  sx={{
                    fontWeight: pathname.startsWith(dashboard.link)
                      ? "bold"
                      : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          {role === "admin" && (
            <List>
              <ListItem key={userList.id} disablePadding>
                <ListItemButton
                  onClick={() => router.push(userList.link)}
                  sx={{
                    bgcolor: pathname.startsWith(userList.link)
                      ? "#EEE6FF"
                      : "transparent",
                    borderLeft: pathname.startsWith(userList.link)
                      ? "4px solid #904cee"
                      : "none",
                    "&:hover": {
                      bgcolor: "#EEE6FF",
                    },
                  }}
                >
                  <ListItemIcon>{userList.icons}</ListItemIcon>
                  <ListItemText primary={userList.name} />
                </ListItemButton>
              </ListItem>
            </List>
          )}
          <Divider />
          <List>
            {listApp.map((x) => (
              <ListItem key={x.id} disablePadding>
                <ListItemButton
                  onClick={() => router.push(x.link)}
                  sx={{
                    bgcolor: pathname.startsWith(x.link)
                      ? "#EEE6FF"
                      : "transparent",
                    borderLeft: pathname.startsWith(x.link)
                      ? "4px solid #904cee"
                      : "none",
                    "&:hover": {
                      bgcolor: "#EEE6FF",
                    },
                  }}
                >
                  <ListItemIcon>{x.icons}</ListItemIcon>
                  <ListItemText
                    primary={x.name}
                    sx={{
                      fontWeight: pathname.startsWith(x.link)
                        ? "bold"
                        : "normal",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
              <ListItem key={transactionList.id} disablePadding>
                <ListItemButton
                  onClick={() => router.push(transactionList.link)}
                  sx={{
                    bgcolor: pathname.startsWith(transactionList.link)
                      ? "#EEE6FF"
                      : "transparent",
                    borderLeft: pathname.startsWith(transactionList.link)
                      ? "4px solid #904cee"
                      : "none",
                    "&:hover": {
                      bgcolor: "#EEE6FF",
                    },
                  }}
                >
                  <ListItemIcon>{transactionList.icons}</ListItemIcon>
                  <ListItemText primary={transactionList.name} />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
        </Drawer>

        <Main>
          <DrawerHeader />
          {children}
        </Main>

        <Snackbar open={openSnackbar} autoHideDuration={3000}>
          <Alert severity="warning" variant="filled">
            Your session has expired. Please log in again.
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
