import { CashOutInterface } from "./interfaceProps";

export const dummyData = [
  {
    id: "1",
    title: "Dikantor dan makan di Wargoks",
    pengeluaran: 120000,
    tanggal: "2025-01-06T00:00:00Z",
  },
  {
    id: "2",
    title: "Seharian di kantor",
    pengeluaran: 160000,
    tanggal: "2025-01-05T00:00:00Z",
  },
  {
    id: "3",
    title: "Nongkrong bersama teman teman",
    pengeluaran: 300000,
    tanggal: "2025-01-04T00:00:00Z",
  },
];

export const dummyDataDetails: CashOutInterface[] = [
  {
    id: "1",
    expenseId: "1",
    desc: "Beli Tongseng buat makan siang",
    amount: 30000,
  },
  {
    id: "2",
    expenseId: "1",
    desc: "Bill Wargoks",
    amount: 90000,
  },
  {
    id: "3",
    expenseId: "2",
    desc: "Jajan Kebab",
    amount: 160000,
  },
  {
    id: "4",
    expenseId: "3",
    desc: "Ke time zone",
    amount: 100000,
  },
  {
    id: "5",
    expenseId: "3",
    desc: "Cafe",
    amount: 90000,
  },
  {
    id: "6",
    expenseId: "3",
    desc: "Makan di WS",
    amount: 70000,
  },
  {
    id: "7",
    expenseId: "3",
    desc: "Isi bensin",
    amount: 40000,
  },
];
