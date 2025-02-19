import axios from "axios";

export interface IncomeDetailsFormInterface {
  _id?: string;
  incomeId?: string;
  description: string;
  amount: number;
  date: Date;
}

export interface IncomeFormInterface {
  _id?: string;
  title: string;
  amount: number;
  userId: string;
  date: Date;
  incomeDetails: IncomeDetailsFormInterface[];
}

const API_BASE_URL =
  process.env.NEXT_LOCAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const fetchIncomeList = async (token: string, userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}income?userId=${userId}`, {
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

export const createIncomeList = async (createData: IncomeFormInterface) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}income`,
      createData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data; // Bisa mengembalikan data pengguna atau pesan sukses
  } catch (error: any) {
    console.error("Registrasi error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Registrasi gagal");
  }
};

export const fetchIncomeListById = async (token: string, id: string, userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}income/${id}?userId=${userId}`, {
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
// ✅ Update Income
export const updateIncome = async (id: string, userId: string, updateData: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}income/${id}?userId=${userId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Update income error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Gagal memperbarui income');
  }
};

// ✅ Delete Income
export const deleteIncome = async (id: string, userId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}income/${id}?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Delete income error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Gagal menghapus income');
  }
};
