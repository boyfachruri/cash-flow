import React from 'react'
import AccountDetails from './AccountDetails'

const UserPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;

return <AccountDetails id={id} />;
};

export default UserPage