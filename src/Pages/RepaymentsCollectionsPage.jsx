import React from "react";
import RepaymentListTable from "../Components/RepaymentsCollections/RepaymentListTable";
import PaymentStatusChart from "../Components/RepaymentsCollections/PaymentStatusChart";
import BulkReminderTool from "../Components/RepaymentsCollections/BulkReminderTool";
import ManualPaymentEntryForm from "../Components/RepaymentsCollections/ManualPaymentEntryForm";
import "bootstrap/dist/css/bootstrap.min.css";

const RepaymentsCollectionsPage = () => {
  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center mb-4">💰 Repayments & Collections Dashboard</h2>

      <div className="row">
        {/* Left Section - Main Table */}
        <div className="col-lg-8 col-md-12 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <RepaymentListTable />
            </div>
          </div>
        </div>

        {/* Right Section - Tools / Charts */}
        <div className="col-lg-4 col-md-12 mb-4 d-flex flex-column gap-3">
          <div className="card shadow-sm flex-fill">
            <div className="card-body p-3">
              <ManualPaymentEntryForm />
            </div>
          </div>

          <div className="card shadow-sm flex-fill">
            <div className="card-body p-3">
              <PaymentStatusChart />
            </div>
          </div>

          <div className="card shadow-sm flex-fill">
            <div className="card-body p-3">
              <BulkReminderTool />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepaymentsCollectionsPage;
