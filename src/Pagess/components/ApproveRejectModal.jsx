import React from "react";
import styles from "./ApproveRejectModal.module.css";

const ApproveRejectModal = ({
  visible,
  action,
  transaction,
  onConfirm,
  onClose,
}) => {
  if (!visible) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Confirm {action}</h3>
        <p>
          Are you sure you want to {action} transaction #{transaction.id}?
        </p>
        <div className={styles.buttons}>
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => onConfirm(transaction)}
            className={styles.confirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveRejectModal;
