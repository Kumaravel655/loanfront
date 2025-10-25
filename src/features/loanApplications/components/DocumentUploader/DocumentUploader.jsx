import React, { useState } from 'react';
import axios from 'axios';
import styles from './DocumentUploader.module.css';

const DocumentUploader = ({ customerId }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token'); // Auth token

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    files.forEach((file) => formData.append('documents', file));
    formData.append('customer_id', customerId); // Pass customer ID

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/customers/upload-documents/',
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setSuccess('Files uploaded successfully!');
      setFiles([]);
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to upload files.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>Drag & drop files here, or click to select files</p>
        <input type="file" multiple onChange={handleFileChange} />
      </div>

      {files.length > 0 && (
        <div className={styles.fileList}>
          <h4>Files ready to upload:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default DocumentUploader;
