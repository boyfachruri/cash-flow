import axios from "axios";

export interface WalletFormInterface {
  _id?: string;
  amount: number;
  userId: string;
  date: Date;
}


const API_BASE_URL = process.env.NEXT_LOCAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const fetchWalletList = async (token: string, userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}wallet?userId=${userId}`, {
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

export const createWalletList = async (createData: WalletFormInterface) => {
  try {
    const response = await axios.post(`${API_BASE_URL}wallet`, createData, {
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

export const fetchWalletListById = async (
  token: string,
  id: string,
  userId: string
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}wallet/${id}?userId=${userId}`,
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
// ✅ Update Wallet
export const updateWallet = async (
  id: string,
  userId: string,
  updateData: any
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}wallet/${id}?userId=${userId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Update wallet error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Gagal memperbarui wallet"
    );
  }
};

// ✅ Delete Wallet
export const deleteWallet = async (id: string, userId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}wallet/${id}?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Delete wallet error:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Gagal menghapus wallet");
  }
};
