import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const AddUser = () => {
    const [uFirstName, setUFirstName] = useState("");
    const [uLastName, setULastName] = useState("");
    const [department, setDepartment] = useState("");
    const [uEmail, setUEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("officer");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/users`, 
              { uFirstName, uLastName, uEmail, password, department, role}, 
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("User added successfully!");
            navigate('/home/users');
        } catch (err) {
            console.error(err);
            const message =
                err.response?.data?.message?.[0] ||
                err.response?.data?.message ||
                "Failed to create user.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

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
                      <label className='form-label'>Password:</label>
                      <input type='password' className='form-control' placeholder='Enter password'
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      required />
                  </div>
                  <div className='mb-4'>
                      <label className='form-label'>Confirm Password:</label>
                      <input type='password' className='form-control' placeholder='Confirm password'
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      required />
                  </div>
                  <div className='mb-4'>
                      <label className='form-label'>Department:</label>
                      <input type='text' className='form-control' placeholder='Enter department'
                      value={department} onChange={(e) => setDepartment(e.target.value)}
                      required />
                  </div>
                  <div className='mb-4'>
                      <label className='form-label'>Role:</label>
                      <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)} required>
                          <option value="officer">Officer</option>
                          <option value="admin">Admin</option>
                        </select>
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

export default AddUser