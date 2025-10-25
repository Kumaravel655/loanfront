import React, { useState } from "react";
import ProfileCard from "../Components/CustomerManagement/ProfileCard";
import LoanHistoryTable from "../Components/CustomerManagement/LoanHistoryTable";
import ActivityTimeline from "../Components/CustomerManagement/ActivityTimeline";
import EditCustomerForm from "../Components/CustomerManagement/EditCustomerForm";
import DocumentAttachmentArea from "../Components/CustomerManagement/DocumentAttachmentArea";
import TaggingWidget from "../Components/CustomerManagement/TaggingWidget";
import Customers from "../Components/CustomerManagement/Customers";
import AddCustomer from "../Components/CustomerManagement/AddCustomer";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const [customer, setCustomer] = useState({
    name: "John Doe",
    contact: "john@example.com",
    segment: "Premium",
    relationshipScore: 95,
  });

  const [loans] = useState([
    { id: 1, type: "Personal Loan", amount: "₹1,00,000", status: "Closed" },
    { id: 2, type: "Home Loan", amount: "₹8,00,000", status: "Active" },
  ]);

  const [activities] = useState([
    { date: "2025-10-12", activity: "Email sent" },
    { date: "2025-09-30", activity: "Loan discussion call" },
  ]);

  const [tags, setTags] = useState(["Premium", "Trusted"]);

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleTagAdd = () => setTags([...tags, "New Tag"]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Customer Management Dashboard</h2>

      {/* Add Customer Button */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddModal(true)}
      >
        ➕ Add Customer
      </button>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Add New Customer</h5>
                <button
                  type="button"
                  className="btn-close bg-white"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <AddCustomer />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <Customers />
        <LoanHistoryTable loans={loans} />
      </div>
    </div>
  );
};

export default CustomerManagement;
