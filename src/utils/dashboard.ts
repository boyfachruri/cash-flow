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

const API_BASE_URL = process.env.NEXT_LOCAL_API_URL || process.env.NEXT_PUBLIC_API_URL;;

export const fetchDashboard = async (token: string, userId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}dashboard/total/${userId}`, {
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
