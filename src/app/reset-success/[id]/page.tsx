import React from 'react'
import PasswordResetSuccess from './PasswordResetSuccess';

const page = async ({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) => {
    const id = (await params).id;
  return <PasswordResetSuccess id={id} />;
};

export default page