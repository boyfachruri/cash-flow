"use client";

import { fetchUserById, UserInterface } from "@/utils/user";
import React, { useEffect, useState } from "react";

interface AccountDetailsInterface {
  id: string;
}

const AccountDetails = ({ id }: AccountDetailsInterface) => {
  const [user, setUser] = useState<UserInterface | null>(null); // State untuk menyimpan data pengguna
  const [loading, setLoading] = useState<boolean>(true); // State untuk loading
  const [error, setError] = useState<string | null>(null); // State untuk error

  const userId = id; // Ganti dengan ID pengguna yang ingin diambil

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserById(userId); // Panggil fetchUserById dengan userId
        setUser(userData); // Set data pengguna ke state
      } catch (error: any) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false); // Set loading ke false setelah data diambil
      }
    };

    getUserData(); // Panggil fungsi untuk mengambil data pengguna
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {user ? (
        <>
          <h1>Profil Pengguna</h1>
          <p>
            <strong>Nama:</strong> {user.fullname}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> {user.status}
          </p>
          <p>
            <strong>Tanggal Bergabung:</strong>{" "}
            {new Date(user.date).toLocaleDateString()}
          </p>
        </>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default AccountDetails;
