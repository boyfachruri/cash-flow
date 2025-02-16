"use client";

import React from "react";
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
import { Divider, Typography } from "@mui/material";
import CalculateIcon from '@mui/icons-material/Calculate';
import AddCardIcon from '@mui/icons-material/AddCard';
import PeopleIcon from '@mui/icons-material/People';

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

const dashboard = {
  id: 1,
  name: "Dashboard",
  link: "/dashboard",
  icons: <GridViewIcon />,
};

const userList = {
  id: 5,
  name: "User List",
  link: "/user-list",
  icons: <PeopleIcon />,
};


const listApp = [
  { id: 2, name: "Income", link: "/income", icons: <AddCardIcon /> },
  {
    id: 3,
    name: "Expenses",
    link: "/expenses",
    icons: <ShoppingCartCheckoutIcon />,
  },
  {
    id: 4,
    name: "Financial Overview",
    link: "/financial-overview",
    icons: <CalculateIcon />,
  }, 
];

export default function Navbar({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar sx={{ bgcolor: "#904cee" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography>Cash Flow By R3g Software</Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer Mengambang */}
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
              <Box>
                <Typography fontWeight="bold" color="secondary">R3g Software</Typography>
              </Box>
            </Box>
            <Box width="50%" display="flex" justifyContent="flex-end">
              <Box>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "ltr" ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </DrawerHeader>
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
              <ListItemText
                primary={userList.name}
                sx={{
                  fontWeight: pathname.startsWith(userList.link)
                    ? "bold"
                    : "normal",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          {/* Menu lainnya */}
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
                    fontWeight: pathname.startsWith(x.link) ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
     
      <Main>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
