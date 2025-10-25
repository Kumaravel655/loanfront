import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EditCustomerForm = ({ customer, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: customer.full_name || "",
    phone: customer.phone || "",
    email: customer.email || "",
    nickname: customer.nickname || "",
    address: customer.address || "",
    aadhar_number: customer.aadhar_number || "",
    cuscode : customer.customer_code || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // logged-in user's token

  const handleToggleEdit = async () => {
    if (isEditing) {
      // Save changes
      setLoading(true);
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/auth/customers/${customer.customer_id}/`,
          formData,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        onUpdate(response.data); // Update parent component
        setLoading(false);
        setIsEditing(false);
      } catch (err) {
        console.error(err);
        setError("Failed to update customer");
        setLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
        <span>Edit Customer Info</span>
        <button
          type="button"
          className={`btn btn-sm ${isEditing ? "btn-success" : "btn-light"}`}
          onClick={handleToggleEdit}
          disabled={loading}
        >
          {loading ? "Saving..." : isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Full Name</label>
            <input
              className="form-control"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Phone</label>
            <input
              className="form-control"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Nickname</label>
            <input
              className="form-control"
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="col-md-12">
            <label className="form-label fw-bold">Address</label>
            <textarea
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Aadhar Number</label>
            <input
              className="form-control"
              type="text"
              name="aadhar_number"
              value={formData.aadhar_number}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Customer Code</label>
            <input
              className="form-control"
              type="text"
              name="cuscode"
              value={formData.cuscode}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerForm;
