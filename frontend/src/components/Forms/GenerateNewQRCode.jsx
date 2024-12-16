import React, { useState } from "react";
import jsPDF from "jspdf";
import { v4 as uuidv4 } from "uuid";

const GenerateNewQRCode = () => {
  const [formData, setFormData] = useState({ qrQuantity: "" });
  const [qrCodes, setQrCodes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quantity = parseInt(formData.qrQuantity, 10);

    if (isNaN(quantity) || quantity <= 0) {
      setErrorMessage("Please enter a valid quantity.");
      return;
    }

    try {
      setErrorMessage("");
      const response = await generateQRCodes(quantity);
      setQrCodes(response);
      setSuccessMessage("Successfully generated QR codes.");
    } catch (error) {
      console.error("Error generating QR codes:", error);
      setErrorMessage(error.message);
    }
  };

  const generateQRCodes = async (quantity) => {
    const codes = [];
    for (let i = 0; i < quantity; i++) {
      codes.push(uuidv4());
    }
    return codes;
  };

  const handlePrint = async () => {
    if (qrCodes.length === 0) {
      alert("No QR codes available for printing.");
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4"); // Portrait, A4 size
    const templateUrl = "student_card_template.png"; // Path to your template

    const templateBase64 = await fetch(templateUrl)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          })
      );

    const qrSize = 25; // QR Code size in mm
    const templateWidth = 56; // Width of the template
    const templateHeight = 80; // Height of the template
    const marginX = 15; // Left margin
    const marginY = 15; // Top margin
    const spacingX = 10; // Horizontal spacing
    const spacingY = 10; // Vertical spacing

    let x = marginX;
    let y = marginY;

    for (let i = 0; i < qrCodes.length; i++) {
      const qrCode = qrCodes[i];
      const qrImage = `https://api.qrserver.com/v1/create-qr-code/?data=${qrCode}&size=150x150`;

      const qrBase64 = await fetch(qrImage)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            })
        );

      // Add the template background
      pdf.addImage(templateBase64, "PNG", x, y, templateWidth, templateHeight);

   // Center the QR code within the template
const qrOffsetX = x + (templateWidth - qrSize) / 2; // Perfectly center horizontally
const qrOffsetY = y + (templateHeight - qrSize) / 2 + 8; // Perfectly center vertically
pdf.addImage(qrBase64, "PNG", qrOffsetX, qrOffsetY, qrSize, qrSize);

      // Update positions for the grid layout
      x += templateWidth + spacingX;

      // Move to the next row after 3 columns
      if ((i + 1) % 3 === 0) {
        x = marginX;
        y += templateHeight + spacingY;
      }

      // Add a new page if 9 QR codes are placed on the current page
      if ((i + 1) % 9 === 0 && i !== qrCodes.length - 1) {
        pdf.addPage();
        x = marginX;
        y = marginY;
      }
    }

    pdf.save("Student_QR_Codes.pdf");
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Generate New QR Codes</h2>

      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <label className="block font-medium mb-2">
          Quantity:
          <input
            type="number"
            value={formData.qrQuantity}
            onChange={(e) =>
              setFormData({ ...formData, qrQuantity: e.target.value })
            }
            className="w-full mt-1 p-2 border rounded-md"
            min="1"
          />
        </label>
        <button
  type="submit"
  className="w-full bg-black text-white py-2 px-4 rounded-md mt-4 hover:bg-gray-800"
>
  Generate QR Codes
</button>

      </form>

      {qrCodes.length > 0 && (
        <div className="mt-6 w-full grid grid-cols-3 gap-4">
          {qrCodes.map((qrCode, index) => (
            <div key={index} className="flex justify-center items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${qrCode}&size=150x150`}
                alt={`QR Code ${index + 1}`}
                className="w-32 h-32"
              />
            </div>
          ))}
        </div>
      )}

      {qrCodes.length > 0 && (
        <button
        onClick={handlePrint}
        className="bg-black text-white py-2 px-4 rounded-md mt-4 hover:bg-gray-800"
      >
        Print QR Codes
      </button>
      
      )}
    </div>
  );
};

export default GenerateNewQRCode;
