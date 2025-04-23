import React from 'react';
import { apiUrl } from '../axios/axiosInstance';

const EnvDebug: React.FC = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-md mb-4">
      <h3 className="font-bold">Environment Debug Info</h3>
      <p>Current API URL: {apiUrl}</p>
    </div>
  );
};

export default EnvDebug;