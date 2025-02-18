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
    
    // Menyimpan token dan data user ke localStorage
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Mengatur waktu untuk menghapus data setelah 1 jam (3600 detik)
    setTimeout(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }, 3600000);  // 3600000 ms = 1 jam
    
    window.location.href = '/main/dashboard';
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// src/utils/auth.ts
export const isAuthenticated = (): boolean => {
  try {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
  }
  return false;
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
