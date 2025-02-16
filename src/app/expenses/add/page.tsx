import React from 'react'
import ExpensesForm from './ExpensesForm';

const expensesAddPage = () => {
    const mode = 'add'
  return <ExpensesForm mode={mode} />;
};

export default expensesAddPage