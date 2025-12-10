import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className='landing-page'>
        <div className='landing-login'>
            <button className='btn btn-primary login-btn' 
            onClick={() => navigate("/login")}>
                <i className='bi bi-box-arrow-in-right login-icon'></i>
                <span className='login-text'>Login</span>
            </button>
        </div>

        <div className="landing-main d-flex flex-column align-items-center justify-content-center">
            <div className='landing-card'>
                <img src='/src/assets/sl-army-logo.png' className='landing-logo' />
                <h1 className='landing-title'>Inquiry Management System</h1>
                <button className='btn btn-success' 
                onClick={() => navigate("/login")}>
                    Submit Inquiry
                </button>
            </div>
        </div>
    </div>
  )
}

export default Landing