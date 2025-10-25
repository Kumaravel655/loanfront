import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DocumentAttachmentArea = () => (
  <div className="card shadow-sm mb-3">
    <div className="card-header bg-dark text-white">Document Attachment</div>
    <div className="card-body">
      <input type="file" className="form-control" multiple />
    </div>
  </div>
);

export default DocumentAttachmentArea;
