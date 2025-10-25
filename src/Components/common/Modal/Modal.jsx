import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ children, onClose }) => {
  // Function to stop click propagation, so clicking the content doesn't close the modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;