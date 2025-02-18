import axios from 'axios';

export interface UserInterface {
    _id: string,
    username: string, 
    fullname: string,
    email: string,
    role: string,
    status: string,
    date: Date
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/";

export const fetchUser = async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}auth/user`, {
        headers: {
          "Authorization": `Bearer ${token}`,  // Mengirimkan token Bearer
        },
      });
      return response.data; // Mengembalikan data user
    } catch (error) {
    //   console.error("Error fetching user data:", error.response?.data || error.message);
      throw new Error("Failed to fetch user data");
    }
  };

  export const fetchUserById = async (userId: string): Promise<UserInterface> => {
    const token = localStorage.getItem('access_token'); // Ambil token dari localStorage
    
    if (!token) {
      throw new Error('Access token not found');
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}auth/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token Bearer di header
        },
      });
  
      return response.data; // Mengembalikan data pengguna
    } catch (error: any) {
      console.error("Error fetching user data:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error fetching user data");
    }
  };
