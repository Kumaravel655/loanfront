import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./AddCustomer.css";

export default function AddCustomer({ onSuccess }) {
  const [customerData, setCustomerData] = useState({
    customer_code: "",
    full_name: "",
    nickname: "",
    phone: "",
    email: "",
    address: "",
    aadhar_number: "",
    document_url: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const requiredFields = ["customer_code", "full_name", "phone", "aadhar_number"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
    if (value.trim() !== "") setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFields = () => {
    const newErrors = {};
    requiredFields.forEach((f) => {
      if (!customerData[f] || customerData[f].trim() === "")
        newErrors[f] = "This field is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateFields()) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/customers/",
        customerData,
        { headers: { Authorization: `Token ${token}` } }
      );

      setMessage(`✅ ${response.data.full_name} added successfully!`);
      setCustomerData({
        customer_code: "",
        full_name: "",
        nickname: "",
        phone: "",
        email: "",
        address: "",
        aadhar_number: "",
        document_url: "",
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to add customer. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="super-form-container"
    >
      <h2 className="super-form-title">
        <span>👤</span> Add New Customer
      </h2>

      <form onSubmit={handleSubmit} className="super-form-grid">
        {[
          { name: "customer_code", label: "Customer Code *" },
          { name: "full_name", label: "Full Name *" },
          { name: "nickname", label: "Nickname" },
          { name: "phone", label: "Phone *" },
          { name: "email", label: "Email" },
          { name: "aadhar_number", label: "Aadhar Number *" },
        ].map((field) => (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              name={field.name}
              value={customerData[field.name]}
              onChange={handleChange}
              placeholder={field.label}
              type={field.name === "email" ? "email" : "text"}
              className={errors[field.name] ? "error" : ""}
            />
            {errors[field.name] && (
              <p className="error-text">{errors[field.name]}</p>
            )}
          </div>
        ))}

        <div className="col-span-2">
          <label>Address</label>
          <textarea
            name="address"
            rows="3"
            value={customerData.address}
            onChange={handleChange}
            placeholder="Enter full address"
          />
        </div>

        <div className="col-span-2">
          <label>Document URL</label>
          <input
            name="document_url"
            value={customerData.document_url}
            onChange={handleChange}
            placeholder="Link to Aadhar/ID document (optional)"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="super-form-button"
        >
          {loading ? "Saving..." : "Save Customer"}
        </motion.button>
      </form>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`status-msg ${
            message.includes("✅") ? "success" : "error"
          }`}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}
