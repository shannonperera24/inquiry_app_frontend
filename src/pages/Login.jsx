import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'

axios.defaults.withCredentials = true;

const Login = () => {
  const [values, setValues] = useState({
      uEmail: '',
      password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
      event.preventDefault();
      setError('');

      try {
          const response = await axios.post('http://localhost:3000/auth/signin', values, {
              headers: { 'Content-Type': 'application/json' }
          });

          const { access_token, user } = response.data;

          if (access_token) {
              localStorage.setItem('token', access_token);
              localStorage.setItem('username', user.uEmail);
              localStorage.setItem('user_role', user.role);
              localStorage.setItem('user_id', user.userId);
              navigate('/home');
          } else {
              setError('Login failed. No token received.');
          }
      } catch (err) {
          console.error(err);
          setError('Invalid email or password.');
      }
  };
  return (
    <div className='landing-page'>
        <div className='login-home'>
            <button className='btn btn-primary home-btn' 
            onClick={() => navigate("/")}>
                <i className='bi bi-house-door login-icon'></i>
                <span className='login-text'>Home</span>
            </button>
        </div>

        <div className="landing-main d-flex flex-column align-items-center justify-content-center">
            <div className='landing-card'>
                <div className='login-heading-section'>
                  <img src='/src/assets/sl-army-logo.png' className='login-logo' />
                  <h1 className='landing-title'>Welcome Back!</h1>
                  <p>Login to continue</p>
                </div>
                <form className='login-form' onSubmit={handleSubmit}>
                  <div className='mb-4'>
                    <label htmlFor='u_email' className='form-label'>Email:</label>
                    <input type='email' name='u_email' autoComplete='off' placeholder='Enter email' 
                    value={values.uEmail}
                    onChange={(e) => setValues({...values, uEmail: e.target.value})} 
                    className='form-control'
                    required/>
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='password' className='form-label'>Password:</label>
                    <input type='password' name='password' autoComplete='off' placeholder='Enter password' 
                    value={values.password}
                    onChange={(e) => setValues({...values, password: e.target.value})} 
                    className='form-control'
                    required/>
                  </div>

                  {error && <p className='error-text'>{error}</p>}

                  <button type='submit' className='btn btn-success'>
                    Login
                  </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login