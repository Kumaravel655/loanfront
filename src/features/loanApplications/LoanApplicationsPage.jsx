import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './LoanApplicationsPage.module.css';
import ApplicationTable from './components/ApplicationTable/ApplicationTable';
import LoanApplicationForm from './components/LoanApplicationForm/LoanApplicationForm';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Modal from '../../components/common/Modal/Modal';

const LoanApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem('token'); // logged-in user's token

  useEffect(() => {
    fetchApplications();
  }, [token]);

  const fetchApplications = async () => {
    if (!token) {
      setError("User not logged in");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/auth/loans/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setApplications(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch loan applications.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleApplicationCreated = () => {
    setIsModalOpen(false);
    fetchApplications();
  };

  let content;
  if (isLoading) {
    content = <p>Loading applications...</p>;
  } else if (error) {
    content = <p className={styles.error}>{error}</p>;
  } else {
    content = <ApplicationTable applications={applications} />;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Loan Applications</h1>
        <Button variant="primary" onClick={handleOpenModal}>
          New Loan Application
        </Button>
      </div>

      <Card>
        {content}
      </Card>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <LoanApplicationForm onSuccess={handleApplicationCreated} />
        </Modal>
      )}
    </div>
  );
};

export default LoanApplicationsPage;
