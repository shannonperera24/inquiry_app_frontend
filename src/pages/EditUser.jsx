import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const EditUser = () => {
    const { user_id } = useParams();
    const id = Number(user_id);

    const [uFirstName, setUFirstName] = useState("");
    const [uLastName, setULastName] = useState("");
    const [department, setDepartment] = useState("");
    const [uEmail, setUEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`http://localhost:3000/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUFirstName(res.data.uFirstName || '');
          setULastName(res.data.uLastName || '');
          setDepartment(res.data.department || '');
          setUEmail(res.data.uEmail || '');
        } catch (err) {
          console.error(err);
          setError("Failed to load user data.");
        } finally {
          setLoading(false);
        }
      };

      if (!isNaN(id)) {
        fetchUser();
      } else {
        setError("Invalid user ID.");
        setLoading(false);
      }
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const payload = { uFirstName, uLastName, uEmail, department };
            await axios.put(`http://localhost:3000/users/${id}`, 
              payload,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("User updated successfully!");
            navigate('/home/users');
        } catch (err) {
            console.error(err);
            const message =
                err.response?.data?.message?.[0] ||
                err.response?.data?.message ||
                "Failed to update user.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading user...</p>;
    if (error) return <p>{error}</p>;

    return (
      <div className="landing-main d-flex flex-column align-items-center justify-content-center">
          <form className='section-form mb-4' onSubmit={handleSubmit}>
              <div className='section-card'>
                  <div className='mb-4'>
                      <label className='form-label'>First Name:</label>
                      <input type='text' className='form-control' placeholder='Enter first name'
                      value={uFirstName} onChange={(e) => setUFirstName(e.target.value)}
                      required />
                  </div>
                  <div className='mb-4'>
                      <label className='form-label'>Last Name:</label>
                      <input type='text' className='form-control' placeholder='Enter last name'
                      value={uLastName} onChange={(e) => setULastName(e.target.value)}
                      required />
                  </div>
                  <div className='mb-4'>
                      <label className='form-label'>Email:</label>
                      <input type='email' className='form-control' placeholder='Enter email'
                      value={uEmail} onChange={(e) => setUEmail(e.target.value)}
                      required />
                  </div>
                  <div className='mb-4'>
                      <label className='form-label'>Department:</label>
                      <input type='text' className='form-control' placeholder='Enter department'
                      value={department} onChange={(e) => setDepartment(e.target.value)}
                      required />
                  </div>
              </div>

              <div className='submit-btn-wrapper'>
                  <button type='submit' className='btn btn-success mb-4'>
                      Save
                  </button>
              </div>
          </form>
      </div>
    )
}

export default EditUser