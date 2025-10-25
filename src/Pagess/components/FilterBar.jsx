import React from "react";
import styles from "./FilterBar.module.css";

const FilterBar = ({ onFilterChange }) => (
  <div className={styles.filterBar}>
    <input
      type="date"
      onChange={(e) => onFilterChange("date", e.target.value)}
    />
    <select onChange={(e) => onFilterChange("status", e.target.value)}>
      <option value="">All Status</option>
      <option value="Pending">Pending</option>
      <option value="Success">Success</option>
      <option value="Failed">Failed</option>
    </select>
    <select onChange={(e) => onFilterChange("type", e.target.value)}>
      <option value="">All Types</option>
      <option value="Disbursement">Disbursement</option>
      <option value="Refund">Refund</option>
    </select>
  </div>
);

export default FilterBar;
