import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const FileCard = ({ file, onUpdate, onDelete }) => {
    const handleDownload = async () => {
        try {
          const response = await axios.get(`http://localhost:5002/download/${file.filename}`, {
            responseType: 'blob'  // Ensure response type is blob for file download
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.filename);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          
        } catch (error) {
          console.error('Error downloading file:', error);
        }
      };
  return (
    <div className='body'>
        <Card style={{ width: '18rem' }}>
      
      <Card.Body>
        <Card.Title class="uploadTitle">{file.title}</Card.Title>
        <Card.Text class="desc">
        {file.description}
        </Card.Text>
        <Card.Text>
        <a href={`http://localhost:5002/uploads/${file.filename}`} className="fileName"target="_blank" rel="noopener noreferrer">
        {file.filename}
      </a>
        </Card.Text>
        <Button className="btn" variant="primary"  onClick={() => onUpdate(file._id)}>Update </Button> 
        <Button className="btn" variant="danger" onClick={() => onDelete(file._id)}>Delete</Button>
        <Button className="btn" variant="success"  onClick={handleDownload}>Download</Button>
      </Card.Body>
    </Card>



  {/* <div className="card">
      <h3>{file.title}</h3>
      <p>{file.description}</p>
      <a href={`http://localhost:5002/uploads/${file.filename}`} target="_blank" rel="noopener noreferrer">
        {file.filename}
      </a>
      <button onClick={() => onUpdate(file._id)}>Update</button>
      <button onClick={() => onDelete(file._id)}>Delete</button>
      <button onClick={handleDownload}>Download</button>
    </div> */}
    </div>
    
  );
};

export default FileCard;
