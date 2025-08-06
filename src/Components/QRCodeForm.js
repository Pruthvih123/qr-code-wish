import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper hook to extract query params from URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const QRCodeWithForm = () => {
  const query = useQuery();
  const scannedName = query.get("name");
  const scannedMobile = query.get("mobile");
  const scannedMessage = query.get("message");

  const isScannedMode = scannedName && scannedMobile && scannedMessage;

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    message: "",
  });

  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef(null);

  useEffect(() => {
    if (isScannedMode) {
      toast.success("Scanned user data loaded successfully!");
    }
  }, [isScannedMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = () => {
    const { name, mobile, message } = formData;
    if (name.trim() && /^\d{10}$/.test(mobile) && message.trim()) {
      setShowQR(true);
      toast.success("QR code generated successfully!");
    } else {
      toast.error("Please fill name, valid 10-digit mobile number, and message.");
      setShowQR(false);
    }
  };

  const handleDownload = async () => {
    if (!qrRef.current) return;
    try {
      const dataUrl = await toPng(qrRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `QR_${formData.name}.png`;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      toast.error("Failed to download QR");
    }
  };

  const encodedMessage = encodeURIComponent(formData.message);
  const qrUrl = `${window.location.origin}/?name=${formData.name}&mobile=${formData.mobile}&message=${encodedMessage}`;

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 450,
        margin: "auto",
        mt: 5,
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
      }}
      component={Paper}
      elevation={3}
    >
      {isScannedMode ? (
        <>
          <Typography variant="h5" gutterBottom>
            🎉 Secret Wish Revealed
          </Typography>
          <Typography variant="body1" sx={{ my: 1 }}>
            <strong>Name:</strong> {scannedName}
          </Typography>
          <Typography variant="body1" sx={{ my: 1 }}>
            <strong>Mobile:</strong> {scannedMobile}
          </Typography>
          <Typography variant="body1" sx={{ my: 1 }}>
            <strong>Message:</strong> {scannedMessage}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            🔗 Link:{" "}
            <Link
              href={`${window.location.origin}/?name=${scannedName}&mobile=${scannedMobile}&message=${encodeURIComponent(
                scannedMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here to revisit
            </Link>
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            🎁 Secret Wish QR Generator
          </Typography>

          <TextField
            label="Name"
            variant="outlined"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            sx={{ my: 1 }}
          />
          <TextField
            label="Mobile Number"
            variant="outlined"
            name="mobile"
            fullWidth
            inputProps={{ maxLength: 10 }}
            value={formData.mobile}
            onChange={handleChange}
            sx={{ my: 1 }}
          />
          <TextField
            label="Secret Message"
            variant="outlined"
            name="message"
            fullWidth
            multiline
            rows={3}
            value={formData.message}
            onChange={handleChange}
            sx={{ my: 1 }}
          />

          <Button variant="contained" fullWidth onClick={handleGenerate}>
            Generate QR Code
          </Button>

          {showQR && (
            <Box sx={{ mt: 4 }}>
              <div ref={qrRef} style={{ background: "#fff", padding: 10 }}>
                <QRCodeCanvas value={qrUrl} size={200} />
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  {formData.name}
                </Typography>
              </div>

              <Button variant="outlined" sx={{ mt: 2 }} onClick={handleDownload}>
                Download QR Code
              </Button>

              <Typography variant="body2" sx={{ mt: 1 }}>
                🔗 Link:{" "}
                <Link href={qrUrl} target="_blank" rel="noopener noreferrer">
                  {qrUrl}
                </Link>
              </Typography>
            </Box>
          )}
        </>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </Box>
  );
};

export default QRCodeWithForm;
