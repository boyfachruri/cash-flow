"use client";

import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { resetPassword } from "@/utils/auth";

const PasswordResetSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("reset_password_token");
    const email = localStorage.getItem("reset_password_email");

    if (token && email) {
      const sendData = async () => {
        try {
          await resetPassword(email, token);
        } catch (err) {
          console.error(err);
        } finally {
          localStorage.removeItem("reset_password_token");
          localStorage.removeItem("reset_password_email");
        }
      };
      sendData();
    }
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/background3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card sx={{ maxWidth: 300, textAlign: "center", p: 3, bgcolor: "white" }}>
        <CardContent>
          <CheckCircleIcon sx={{ fontSize: 60, color: "green", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold">
            Password Reset Successful
          </Typography>
          <Typography variant="body1" mt={2} color="textSecondary">
            Please check your email to receive your new password. Also, check
            your spam folder if you do not see it in your inbox.
          </Typography>
          <Typography variant="body2" mt={1} fontWeight="bold">
            Change your password in your profile for better account security.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#904cee" }}
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PasswordResetSuccess;
