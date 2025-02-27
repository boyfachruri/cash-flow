"use client";

import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { resetPassword } from "@/utils/auth";
import ErrorIcon from "@mui/icons-material/Error";

interface reset {
  id: string;
}

const PasswordResetSuccess = ({ id }: reset) => {
  const router = useRouter();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (id) {
      const sendData = async () => {
        try {
          await resetPassword(id);
          setIsValid(true);
        } catch (err) {
          console.error(err);
          setIsValid(false);
        }
      };
      sendData();
    } else {
      setIsValid(false);
    }
  }, [id]);

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
      {!isValid ? (
        <>
          <Card
            sx={{ maxWidth: 300, textAlign: "center", p: 3, bgcolor: "white" }}
          >
            <CardContent>
              {" "}
              <ErrorIcon sx={{ fontSize: 60, color: "red", mb: 2 }} />
              <Typography variant="h5" fontWeight="bold">
                Link sudah tidak valid
              </Typography>
              <Typography variant="body1" mt={2} color="textSecondary">
                Silakan coba melakukan reset password kembali.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2, backgroundColor: "#904cee" }}
                onClick={() => router.push("/forgot-password")}
              >
                Kembali ke Reset Password
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card
          sx={{ maxWidth: 300, textAlign: "center", p: 3, bgcolor: "white" }}
        >
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
      )}
    </Box>
  );
};

export default PasswordResetSuccess;
