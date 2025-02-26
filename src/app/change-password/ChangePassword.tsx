"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/loader";
import { resetPassword, resetUpdatePassword } from "@/utils/auth";
import { useRouter } from "next/navigation";

const ChangePassword = () => {
  const [randomPassword, setRandomPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const forgot = localStorage.getItem("isForgot");
    console.log(forgot, "forgot");

    if (forgot !== "true") {
      router.push("/main/dashboard");
    } else if (!forgot) {
      router.push("/main/dashboard");
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setError("");
    setIsLoading(true);

    const email = localStorage.getItem("email") || '';
    const sendData = async () => {
      try {
        await resetUpdatePassword(email, newPassword);
        setOpenDialog(true);
      } catch (err) {
        console.error(err);
      } finally {
        localStorage.setItem("isForgot", "false");
        setIsLoading(false);
      }
    };
    sendData();
  };

  const handleClose = () => {
    router.push("/main/dashboard");
    setOpenDialog(false);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {isLoading && <Loader />}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
          width: "100%",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Reset Password
        </Typography>
        {/* <TextField
          fullWidth
          label="Old Password"
          type="password"
          variant="outlined"
          color="secondary"
          margin="normal"
          required
          value={randomPassword}
          onChange={(e) => setRandomPassword(e.target.value)}
        /> */}
        <TextField
          fullWidth
          label="New Password"
          color="secondary"
          type="password"
          variant="outlined"
          margin="normal"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          fullWidth
          label="Confirm New Password"
          color="secondary"
          type="password"
          variant="outlined"
          margin="normal"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: "#904cee", color: "white" }}
        >
          Reset Password
        </Button>
      </Box>

      {/* Dialog untuk konfirmasi reset password */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        sx={{ textAlign: "center" }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="div">
            Password Reset Successful
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 50, color: "#4caf50", mb: 2 }}
          />
          <Typography>Your password has been successfully reset.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{ backgroundColor: "#904cee", color: "white" }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChangePassword;
