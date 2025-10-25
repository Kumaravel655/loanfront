import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ActivityTimeline = ({ activities }) => (
  <div className="card shadow-sm mb-3">
    <div className="card-header bg-warning text-dark">Communication Log</div>
    <div className="card-body">
      <ul className="list-group">
        {activities.map((act, i) => (
          <li key={i} className="list-group-item">
            <strong>{act.date}:</strong> {act.activity}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ActivityTimeline;
