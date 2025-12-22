import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/users/change-password`, 
              { currentPassword, newPassword, confirmNewPassword }, 
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Password changed successfully!");
            navigate('/login');
        } catch (err) {
            console.error(err);
            const message =
                err.response?.data?.message?.[0] ||
                err.response?.data?.message ||
                "Failed to change password.";
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
                      <label className='form-label'>Old Password:</label>
                      <input type='password' className='form-control' placeholder='Enter old password'
                      value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                      required />
                  </div>
                  <div className='mb-4'>
                      <label className='form-label'>New Password:</label>
                      <input type='password' className='form-control' placeholder='Enter new password'
                      value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      required />
                  </div>
                  <div className='mb-4'>
                      <label className='form-label'>Confirm New Password:</label>
                      <input type='password' className='form-control' placeholder='Confirm new password'
                      value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
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

export default ChangePassword