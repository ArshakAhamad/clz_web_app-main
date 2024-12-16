import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function QrScanner({ onScanComplete, onClose }) {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const qrRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        setCameras(devices);
        if (devices.length > 0) {
          setSelectedCamera(devices[0].id);
        }
      })
      .catch((err) => console.error('Error getting cameras:', err));

    return () => {
      stopScanner(); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    if (!selectedCamera || !qrRef.current || isScanning) return;

    const html5QrCode = new Html5Qrcode('qr-reader');
    html5QrCodeRef.current = html5QrCode;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    setIsScanning(true);
    html5QrCode
      .start(
        selectedCamera,
        config,
        (decodedText) => {
          onScanComplete(decodedText); // Handle successful scan
          stopScanner(); // Stop scanning after successful detection
        },
        (errorMessage) => {
          // Suppress repeated errors to prevent console flooding
          if (!errorMessage.includes('No MultiFormat Readers')) {
            console.warn('QR code scanning error:', errorMessage);
          }
        }
      )
      .catch((err) => {
        console.error('Error starting QR scanner:', err);
        setIsScanning(false);
      });

    return () => {
      stopScanner(); // Cleanup when camera changes
    };
  }, [selectedCamera, onScanComplete, isScanning]);

  const stopScanner = () => {
    if (html5QrCodeRef.current && isScanning) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          html5QrCodeRef.current.clear(); // Clear scanner view
          setIsScanning(false);
        })
        .catch((err) => {
          // Gracefully handle errors when stopping the scanner
          if (!err.toString().includes('Scanner is not in running state')) {
            console.error('Error stopping QR scanner:', err);
          }
          setIsScanning(false);
        });
    }
  };

  const handleCameraChange = (cameraId) => {
    if (isScanning) {
      stopScanner(); // Stop current scanner before switching
    }
    setSelectedCamera(cameraId);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            Please position the QR code within the camera frame to scan.
          </DialogDescription>
        </DialogHeader>
        {/* Camera Selection */}
        <Select value={selectedCamera} onValueChange={handleCameraChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a camera" />
          </SelectTrigger>
          <SelectContent>
            {cameras.map((camera) => (
              <SelectItem key={camera.id} value={camera.id}>
                {camera.label || `Camera ${camera.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* QR Scanner Container */}
        <div id="qr-reader" ref={qrRef} style={{ width: '100%', height: '300px' }}></div>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
