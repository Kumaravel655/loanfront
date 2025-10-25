import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  // Selects CSS class based on the variant prop (e.g., 'primary' or 'secondary')
  const buttonClass = styles[variant] || styles.primary;

  return (
    <button type={type} className={`${styles.button} ${buttonClass}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;