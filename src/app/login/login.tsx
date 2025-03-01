"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
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
import Loader from "@/components/loader";

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
  const [loading, setLoading] = useState(false);
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
    } else {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault(); // Mencegah notifikasi default
      setDeferredPrompt(event);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const response = await fetch("/api/submit", {
  //       method: "POST",
  //       body: JSON.stringify({ name: "John Doe" }),
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     const result = await response.json();
  //     console.log(result);
  //   } catch (error) {
  //     console.error("Error submitting form", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleCloseDialog = () => {
    setTab(0);
    setOpenDialog(false);
    // window.location.href = '/auth/login'; // Redirect ke halaman login setelah dialog ditutup
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password"); // Gantilah dengan halaman reset password yang sesuai
  };

  return (
    <>
      {loading == true && <Loader />}
      {/* <Container> */}
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
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={2}
              >
                <img
                  src="/r3g-cashflow.png" // Sesuaikan path gambar
                  alt="Logo"
                  style={{
                    width: 250,
                    // height: 150,
                    // marginRight: 3,
                    objectFit: "contain",
                  }} // Tambah objectFit agar tidak terdistorsi
                />
              </Box>

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
                      label="Username/Email"
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
                    <Typography
                      variant="body2"
                      color="secondary"
                      sx={{ mt: 1, cursor: "pointer", textAlign: "right" }}
                      onClick={handleForgotPassword} // Tambahkan fungsi untuk navigasi
                    >
                      Forgot Password?
                    </Typography>
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
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "#904cee" }}
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
      {/* </Container> */}
    </>
  );
}
