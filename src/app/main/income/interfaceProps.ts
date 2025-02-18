export interface IncomeListInterface {
    id: string,
    date: string,
    title: string,
    amount: number
}

export interface CashInInterface {
    id: string,
    incomeId: string,
    desc: string,
    amount: number
}