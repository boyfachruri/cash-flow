import React from 'react'
import IncomeForm from '../../add/IncomeForm';

const IncomeEditPage = async ({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) => {
    const id = (await params).id;
    const mode = 'edit'
  return <IncomeForm id={id} mode={mode} />;
};

export default IncomeEditPage