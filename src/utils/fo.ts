import axios from "axios";
import { IncomeDetailsFormInterface } from "./income";

export interface FoFormListInterface {
  _id?: string;
  userId: string;
  fromDate: Date;
  toDate: Date;
  date: Date;
  transactions: IncomeDetailsFormInterface[];
}

export interface FoFormInterface {
  _id?: string;
  userId: string;
  fromDate: Date;
  toDate: Date;
  date: Date;
}

const API_BASE_URL =
  process.env.NEXT_LOCAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const fetchFo = async (token: string, userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}fo?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Mengirimkan token Bearer
      },
    });
    return response.data; // Mengembalikan data user
  } catch (error) {
    //   console.error("Error fetching user data:", error.response?.data || error.message);
    throw new Error("Failed to fetch user data");
  }
};

export const createFo = async (createData: FoFormInterface) => {
  try {
    const response = await axios.post(`${API_BASE_URL}fo`, createData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data; // Bisa mengembalikan data pengguna atau pesan sukses
  } catch (error: any) {
    console.error("Registrasi error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Registrasi gagal");
  }
};

export const fetchFoById = async (
  token: string,
  id: string,
  userId: string
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}fo/${id}?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Mengirimkan token Bearer
        },
      }
    );
    return response.data; // Mengembalikan data user
  } catch (error) {
    //   console.error("Error fetching user data:", error.response?.data || error.message);
    throw new Error("Failed to fetch user data");
  }
};
// // ✅ Update fo
// export const updatefo = async (id: string, userId: string, updateData: any) => {
//   try {
//     const response = await axios.put(
//       `${API_BASE_URL}fo/${id}?userId=${userId}`,
//       updateData,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error('Update fo error:', error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || 'Gagal memperbarui fo');
//   }
// };

// // ✅ Delete fo
// export const deletefo = async (id: string, userId: string) => {
//   try {
//     const response = await axios.delete(
//       `${API_BASE_URL}fo/${id}?userId=${userId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error('Delete fo error:', error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || 'Gagal menghapus fo');
//   }
// };
