"use client";

import React, { useState } from "react";
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
import { forgotPassword } from "@/utils/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(false);
    const sendData = async () => {
      try {
        await forgotPassword(email);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    sendData();
    setOpenDialog(true);
  };

  const handleClose = () => {
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
      {isLoading == true && <Loader />}
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
          Forgot Password
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Enter your email address below and we'll send you a link to reset your
          password.
        </Typography>
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          variant="outlined"
          color="secondary"
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, backgroundColor: "#904cee", color: "white" }}
        >
          Send Reset Link
        </Button>
      </Box>

      {/* Dialog untuk konfirmasi email terkirim */}
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
            Password Reset Sent
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 50, color: "#4caf50", mb: 2 }}
          />
          <Typography>
            Please check your email for the password reset link.
          </Typography>
          <Typography sx={{ mt: 1, fontSize: "0.875rem", color: "gray" }}>
            If you don't see the email, please check your spam folder.
          </Typography>
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

export default ForgotPassword;
