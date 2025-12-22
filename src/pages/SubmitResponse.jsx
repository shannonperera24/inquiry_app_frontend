import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const SubmitResponse = () => {
    const { inquiry_id } = useParams();
    const [values, setValues] = useState({
        responseText: ''
    });

    const [attachments, setAttachments] = useState([]);
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter((file) => 
            allowedTypes.includes(file.type)
        );
        if (validFiles.length !== selectedFiles.length) {
            alert("Only PDF, DOCX, JPG, and PNG files are allowed.");
        }
        setAttachments(validFiles);
    };

    const handleRemoveFile = (indexToRemove) => {
        setAttachments(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify({ responseText: values.responseText }));
            attachments.forEach(file => formData.append('attachments', file));
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/inquiries/${inquiry_id}/responses`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Response submitted successfully!");
            navigate(`/home/view-inquiry/${inquiry_id}`);
        } catch (err) {
            console.error(err);
            const message =
                err.response?.data?.message?.[0] ||
                err.response?.data?.message ||
                "Failed to submit response.";
            toast.error(message);
        }
    }

    useEffect(() => {
      const markInProgress = async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`http://localhost:3000/inquiries/${inquiry_id}/start-response`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          console.error('Failed to mark inquiry in progress', err);
        }
      };
      markInProgress();
    }, [inquiry_id]);

    return (
      <div className="landing-main d-flex flex-column align-items-center justify-content-center">
          <form className='section-form mb-4' onSubmit={handleSubmit}>
              <div className='section-card'>
                  <h3>Response Details</h3>
                  <div>
                      <label className='form-label'>Response:</label>
                      <textarea className='form-control' placeholder='Enter response'
                      value={values.responseText} onChange={(e) => setValues({...values, responseText: e.target.value})}
                      required />
                  </div>
              </div>

              <div className='section-card'>
                  <h3>Attachments</h3>
                  <div>
                      <label className='form-label'>File types allowed: pdf, docx, jpg, png</label>
                      <input type='file' className='form-control'
                      multiple onChange={handleFileChange}
                      accept='.pdf, .docx, .jpg, .jpeg, .png' />
                      {attachments.length > 0 && (
                          <div className='attachments-list'>
                              <strong>Files Selected:</strong>
                              <ul>
                                  {attachments.map((file, index) => (
                                      <li key={index}>
                                          <span className='file-name'>{file.name}</span>
                                          <button type='button' className='btn btn-sm btn-danger'
                                          onClick={() => handleRemoveFile(index)}>
                                              Remove
                                          </button>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                  </div>
              </div>

              <div className='submit-btn-wrapper'>
                  <button type='submit' className='btn btn-success mb-4'>
                      Submit
                  </button>
              </div>
          </form>
      </div>
    )
}

export default SubmitResponse