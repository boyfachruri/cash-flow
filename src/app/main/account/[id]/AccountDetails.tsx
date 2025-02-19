"use client";

import { fetchUserById, UserInterface } from "@/utils/user";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import Loader from "@/components/loader";

interface AccountDetailsInterface {
  id: string;
}

const AccountDetails = ({ id }: AccountDetailsInterface) => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserById(id);
        setUser(userData);
      } catch (error: any) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, [id]);

  if (loading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <TextField error fullWidth label="Error" value={error} disabled />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Card sx={{ maxWidth: 400, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Box width="100%" textAlign="center">
            <Typography fontWeight="bold" variant="h6">User Profil</Typography>
          </Box>
          {user ? (
            <>
              <TextField
                fullWidth
                label="Nama"
                value={user.fullname}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Username"
                value={user.username}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Email"
                value={user.email}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Role"
                value={user.role}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Status"
                value={user.status}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Tanggal Bergabung"
                value={new Date(user.date).toLocaleDateString()}
                margin="normal"
                disabled
              />
            </>
          ) : (
            <TextField
              fullWidth
              label="No user data available"
              value=""
              margin="normal"
              disabled
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountDetails;
