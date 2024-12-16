import React, { useEffect, useState } from "react";
import { fetchAllQRCodes } from "@/lib/APIServices/QRCode/api"; // Adjust the import path as necessary

const AllQRCodes = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQRCodes = async () => {
      setLoading(true);
      setError(null); // Reset error state before making a request

      try {
        const response = await fetchAllQRCodes(); // Using the API function from QRCodeApi.js
        setQrCodes(response);
      } catch (err) {
        console.error("Error fetching QR codes:", err);
        setError(err.message || "Failed to fetch QR codes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">All QR Codes</h2>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-6 py-3">QR ID</th>
                <th className="px-6 py-3">QR Code</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Create Date</th>
                <th className="px-6 py-3">Created By</th>
                <th className="px-6 py-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {qrCodes.map((code) => (
                <tr
                  key={code.qrId}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {code.qrId}
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${code.qrCode}&size=100x100`}
                      alt="QR Code"
                      className="w-16 h-16 object-contain"
                    />
                  </td>
                  <td className="px-6 py-4">{code.qrQuantity}</td>
                  <td className="px-6 py-4">
                    {new Date(code.createDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{code.createdByUsername}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-sm font-semibold ${
                        code.active
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {code.active ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllQRCodes;
