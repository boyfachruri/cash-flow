import axios from "axios";

export interface ExpensesDetailsFormInterface {
  _id?: string;
  expensesId?: string;
  description: string;
  amount: number;
  date: Date;
}

export interface ExpensesFormInterface {
  _id?: string;
  title: string;
  amount: number;
  userId: string;
  date: Date;
  expensesDetails: ExpensesDetailsFormInterface[];
}

const API_BASE_URL =
  process.env.NEXT_LOCAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const fetchExpensesList = async (token: string, userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}expenses?userId=${userId}`, {
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

export const createExpensesList = async (createData: ExpensesFormInterface) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}expenses`,
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

export const fetchExpensesListById = async (token: string, id: string, userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}expenses/${id}?userId=${userId}`, {
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
// ✅ Update Expenses
export const updateExpenses = async (id: string, userId: string, updateData: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}expenses/${id}?userId=${userId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Update expenses error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Gagal memperbarui expenses');
  }
};

// ✅ Delete Expenses
export const deleteExpenses = async (id: string, userId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}expenses/${id}?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Delete expenses error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Gagal menghapus expenses');
  }
};
