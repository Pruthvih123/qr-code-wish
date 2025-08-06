import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QRCodeWithForm from "./Components/QRCodeForm";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRCodeWithForm />} />
      </Routes>
    </Router>
  );
};

export default App;
