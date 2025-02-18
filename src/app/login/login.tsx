"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/utils/auth";

interface FormData {
  username: string;
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}


export default function LoginForm() {
  const router = useRouter();
  const [tab, setTab] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Untuk Register, periksa apakah password dan confirm password cocok
    if (tab === 1 && formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }

    setError(""); // Reset error jika valid

    // Kirim data berdasarkan tab
    const formDataToSend =
      tab === 0
        ? { username: formData.username, password: formData.password } // Login
        : formData; // Register

    const endpoint = tab === 0 ? "auth/login" : "auth/register";

    try {
      if (tab === 0) {
        // Login
        await loginUser({
          username: formData.username,
          password: formData.password,
        });
        // Redirect ke dashboard setelah login
        // window.location.href = '/main/dashboard'; // Uncomment untuk redirect otomatis setelah login
      } else {
        // Register
        await registerUser(formData); // Panggil registerUser untuk registrasi
        setOpenDialog(true);
        setDialogMessage("Registration successful, please login.");
        
      }
    } catch (err) {
      if (tab === 0) {
        // Menampilkan dialog login gagal jika login gagal
        setDialogMessage(
          "Login failed. Please check your username and password."
        );
        setOpenDialog(true);
      } else {
        setError("Registration failed");
      }
    }
  };

  const handleCloseDialog = () => {
    setTab(0);
    setOpenDialog(false);
    // window.location.href = '/auth/login'; // Redirect ke halaman login setelah dialog ditutup
  };

  return (
    <Container>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography
                fontFamily="Roboto"
                fontWeight="bold"
                color="secondary"
                variant="h4"
                align="center"
                gutterBottom
              >
                R3g Cashflow
              </Typography>
              {/* <Typography variant="h4" align="center" gutterBottom>
                Cashflow
              </Typography> */}
              <Tabs
                textColor="secondary"
                indicatorColor="secondary"
                value={tab}
                onChange={(_, newValue: number) => setTab(newValue)}
                centered
              >
                <Tab label="Login" />
                <Tab label="Register" />
              </Tabs>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                {tab === 1 ? (
                  <>
                    <TextField
                      fullWidth
                      color="secondary"
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      margin="normal"
                      variant="standard"
                      required
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      label="Full Name"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      margin="normal"
                      variant="standard"
                      required
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      margin="normal"
                      variant="standard"
                      required
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      margin="normal"
                      variant="standard"
                      required
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      margin="normal"
                      variant="standard"
                      required
                    />
                  </>
                ) : (
                  <>
                    <TextField
                      fullWidth
                      color="secondary"
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      margin="normal"
                      variant="standard"
                      required
                    />
                    <TextField
                      fullWidth
                      color="secondary"
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      margin="normal"
                      variant="standard"
                      required
                    />
                  </>
                )}

                {error && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {tab === 0 ? "Login" : "Register"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {tab === 0 ? "Login Failed" : "Registration Successful"}
          </DialogTitle>
          <DialogContent>
            <p>{dialogMessage}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Container>
  );
}
