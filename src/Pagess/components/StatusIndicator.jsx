import React from "react";
import styles from "./StatusIndicator.module.css";

const StatusIndicator = ({ status }) => {
  const color =
    status === "Success" ? "green" : status === "Pending" ? "orange" : "red";

  return (
    <span
      className={styles.dot}
      style={{ backgroundColor: color }}
      title={status}
    ></span>
  );
};

export default StatusIndicator;
