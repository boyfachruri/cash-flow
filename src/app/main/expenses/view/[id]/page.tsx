import React from 'react'
import ExpensesForm from '../../add/ExpensesForm';

const expensesViewPage = async ({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) => {
    const id = (await params).id;
    const mode = 'view'
  return <ExpensesForm id={id} mode={mode} />;
};

export default expensesViewPage