import React from 'react'
import ExpensesForm from './ExpensesForm';

const expensesAddPage = async ({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) => {
    const mode = 'add'
  return <ExpensesForm mode={mode} />;
};

export default expensesAddPage