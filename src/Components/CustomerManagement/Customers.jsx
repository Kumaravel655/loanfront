import React, { useEffect, useState } from "react";
import axios from "axios";
import EditCustomerForm from "./EditCustomerForm"; // import your edit form

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null); // track currently editing customer

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/auth/customers/", {
        headers: { Authorization: `Token ${token}` },
      });
      setCustomers(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch customers");
      setLoading(false);
    }
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    // Update the table after editing
    setCustomers(customers.map(c => c.customer_id === updatedCustomer.customer_id ? updatedCustomer : c));
    setEditingCustomer(null); // close edit form
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Customers</h2>

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <thead style={{ backgroundColor: "#4CAF50", color: "white" }}>
          <tr>
            <th style={{ padding: "10px" }}>ID</th>
            <th style={{ padding: "10px" }}>Code</th>
            <th style={{ padding: "10px" }}>Full Name</th>
            <th style={{ padding: "10px" }}>Nickname</th>
            <th style={{ padding: "10px" }}>Phone</th>
            <th style={{ padding: "10px" }}>Email</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, index) => (
            <tr key={c.customer_id} style={{
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white"
            }}>
              <td style={{ padding: "10px", textAlign: "center" }}>{c.customer_id}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>{c.customer_code}</td>
              <td style={{ padding: "10px" }}>{c.full_name}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>{c.nickname || "-"}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>{c.phone}</td>
              <td style={{ padding: "10px" }}>{c.email || "-"}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setEditingCustomer(c)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render Edit Form below the table when a customer is selected */}
      {editingCustomer && (
        <div style={{ marginTop: "20px" }}>
          <EditCustomerForm
            customer={editingCustomer}
            onUpdate={handleUpdateCustomer}
          />
        </div>
      )}
    </div>
  );
}
