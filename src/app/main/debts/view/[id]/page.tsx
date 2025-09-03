import React from 'react'
import DebtsForm from '../../add/DebtsForm';

const Page = async ({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) => {
    const id = (await params).id;
    const mode = 'view'
  return <DebtsForm id={id} mode={mode} />;
};

export default Page