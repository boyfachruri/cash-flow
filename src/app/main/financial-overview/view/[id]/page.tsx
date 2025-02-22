import React from 'react'
import FoView from './FoView';

const foViewPage = async ({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) => {
    const id = (await params).id;
    const mode = 'view'
  return <FoView id={id} mode={mode} />;
};

export default foViewPage