import axios from 'axios';

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
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    // Simpan waktu kedaluwarsa (1 jam dari sekarang)
    const expiryTime = Date.now() + 3600000; // 1 jam = 3600000 ms
    localStorage.setItem('expiry_time', expiryTime.toString());

    window.location.href = '/main/dashboard';
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


// src/utils/auth.ts
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const accessToken = localStorage.getItem('access_token');
    const expiryTime = localStorage.getItem('expiry_time');

    // Jika token tidak ada atau sudah kedaluwarsa, hapus & return false
    if (!accessToken || !expiryTime || Date.now() > Number(expiryTime)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('expiry_time');
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const registerUser = async (registerData: RegisterData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}auth/register`, registerData);
    return response.data; // Bisa mengembalikan data pengguna atau pesan sukses
  } catch (error: any) {
    console.error("Registrasi error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Registrasi gagal");
  }
};
