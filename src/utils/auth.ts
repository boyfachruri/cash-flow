import axios from "axios";
import { randomBytes } from "crypto";

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  fullname: string;
  email: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_LOCAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (loginData: LoginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}auth/login`, loginData);

    // Simpan token & user ke localStorage
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("email", response.data.user.email);
    localStorage.setItem("isForgot", response.data.user.isForgot);

    localStorage.removeItem("reset_password_token");
    localStorage.removeItem("reset_password_email");

    // Simpan waktu kedaluwarsa (1 jam dari sekarang)
    const expiryTime = Date.now() + 3600000; // 1 jam = 3600000 ms
    localStorage.setItem("expiry_time", expiryTime.toString());

    window.location.href = "/main/dashboard";
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const token = randomBytes(32).toString("hex");

    const data = {
      email: email,
      token: token,
    };

    const response = await axios.post(
      `${API_BASE_URL}auth/forgot-password`,
      data
    );

    localStorage.setItem("reset_password_token", token);
    localStorage.setItem("reset_password_email", email);
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message);
  }
};

export const resetPassword = async (email: string, token: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}auth/confirm-reset-password?token=${token}&email=${email}`
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const resetUpdatePassword = async (email: string, password: string) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}auth/update-password-reset`,
      {}, // Karena pakai @Query, body bisa kosong
      {
        params: { email, password },
      }
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

// src/utils/auth.ts
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const accessToken = localStorage.getItem("access_token");
    const expiryTime = localStorage.getItem("expiry_time");

    // Jika token tidak ada atau sudah kedaluwarsa, hapus & return false
    if (!accessToken || !expiryTime || Date.now() > Number(expiryTime)) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("isForgot");
      localStorage.removeItem("email");
      localStorage.removeItem("expiry_time");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

export const logout = () => {
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const registerUser = async (registerData: RegisterData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}auth/register`,
      registerData
    );
    return response.data; // Bisa mengembalikan data pengguna atau pesan sukses
  } catch (error: any) {
    console.error("Registrasi error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Registrasi gagal");
  }
};
