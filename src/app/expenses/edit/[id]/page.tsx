import React from 'react'
import ExpensesForm from '../../add/ExpensesForm';

const expensesEditPage = async ({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) => {
    const id = (await params).id;
    const mode = 'edit'
  return <ExpensesForm id={id} mode={mode} />;
};

export default expensesEditPage