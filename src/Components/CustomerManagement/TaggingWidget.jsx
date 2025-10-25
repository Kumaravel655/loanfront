import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TaggingWidget = ({ tags, handleTagAdd }) => (
  <div className="card shadow-sm mb-3">
    <div className="card-header bg-success text-white">Blacklist / Segment Tagging</div>
    <div className="card-body">
      {tags.map((tag, i) => (
        <span key={i} className="badge bg-primary me-2">{tag}</span>
      ))}
      <button className="btn btn-sm btn-outline-light ms-2" onClick={handleTagAdd}>
        + Add Tag
      </button>
    </div>
  </div>
);

export default TaggingWidget;
