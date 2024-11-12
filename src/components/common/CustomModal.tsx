import React from "react";

const CustomModal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
      {children}
      <button onClick={onClose} className="mt-4 text-red-500 hover:underline">
        Close
      </button>
    </div>
  </div>
);

export default CustomModal;
