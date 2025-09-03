import axios from "axios";

export interface DebtPaymentFormInterface {
  _id?: string;
  debtId?: string;
  amount: number;
  amountType: string;
  date: Date;
  description?: string;
  createdAt?: Date;
}

export interface DebtFormInterface {
  _id?: string;
  creditor: string;
  debtor: string;
  amount: number;
  dueDate: Date;
  userId: string;
  status?: "unpaid" | "partial" | "paid";
  createdAt?: Date;
  payments?: DebtPaymentFormInterface[];
}

const API_BASE_URL =
  process.env.NEXT_LOCAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

// ✅ Fetch all debts
export const fetchDebtsList = async (token: string, userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}debts?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch debts");
  }
};

// ✅ Fetch single debt by id
export const fetchDebtById = async (token: string, id: string, userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}debts/${id}?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch debt by id");
  }
};

// ✅ Create debt
export const createDebt = async (createData: DebtFormInterface) => {
  try {
    const response = await axios.post(`${API_BASE_URL}debts`, createData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Create debt error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Gagal membuat debt");
  }
};

// ✅ Update debt
export const updateDebt = async (id: string, userId: string, updateData: Partial<DebtFormInterface>) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}debts/${id}?userId=${userId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Update debt error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Gagal update debt");
  }
};

// ✅ Delete debt
export const deleteDebt = async (id: string, userId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}debts/${id}?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Delete debt error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Gagal menghapus debt");
  }
};

// ✅ Add payment to debt
export const addPayment = async (
  debtId: string,
  userId: string,
  paymentData: DebtPaymentFormInterface
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}debts/${debtId}/payments?userId=${userId}`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Add payment error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Gagal menambahkan pembayaran");
  }
};

