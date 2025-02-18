export interface DummyDataListingProps {
    id: string,
    tanggal: string,
    title: string,
    pengeluaran: number
}

export interface CashOutInterface {
    id: string,
    expenseId: string,
    desc: string,
    amount: number
}