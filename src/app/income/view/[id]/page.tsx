import React from 'react'
import IncomeForm from '../../add/IncomeForm';

const IncomeViewPage = async ({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) => {
    const id = (await params).id;
    const mode = 'view'
  return <IncomeForm id={id} mode={mode} />;
};

export default IncomeViewPage