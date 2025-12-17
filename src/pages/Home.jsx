import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import routeTitles from "../config/routeTitles";

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    user_role: "",
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserRole = localStorage.getItem("user_role");

    if (!storedUsername || !storedUserRole) {
      navigate("/"); 
    } else {
      setUser({
        username: storedUsername,
        user_role: storedUserRole,
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    navigate('/');
  }
  
  const location = useLocation();

  const matchedPath = Object.keys(routeTitles)
    .sort((a, b) => b.length - a.length) 
    .find((path) => location.pathname.startsWith(path));

  const currentTitle = routeTitles[matchedPath] || 'Inquiry Management System';

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`dashboard-wrapper ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <img src='/src/assets/sl-army-logo.png' className='login-logo' />
        </div>
        <ul className="nav flex-column nav-top">
          <li>
            <Link to="" className="nav-link">
              <i className="bi-speedometer2 me-2"></i> <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="inquiries" className="nav-link">
              <i className="bi-envelope-paper me-2"></i> <span>Inquiries</span>
            </Link>
          </li>
          <li>
            <Link to="requesters" className="nav-link">
              <i className="bi-people me-2"></i> <span>Requesters</span>
            </Link>
          </li>
          <li>
            <Link to="categories" className="nav-link">
              <i className="bi-diagram-3 me-2"></i> <span>Categories</span>
            </Link>
          </li>

          {user.user_role === "admin" && (
            <li>
                <Link to="users" className="nav-link">
                <i className="bi-person-gear me-2"></i> <span>Users</span>
                </Link>
            </li>
            )}
        </ul>

        <ul className="nav flex-column nav-bottom">
          <div className="nav-separator"></div>

          <li>
            <Link to="profile" className="nav-link">
              <i className="bi-person-circle me-2"></i> <span>Profile</span>
            </Link>
          </li>
          <li onClick={handleLogout}>
            <Link className="nav-link logout-link">
              <i className="bi-power me-2"></i> <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="dashboard-header shadow-sm">
          <div className="d-flex align-items-center gap-3">
            <button className="sidebar-toggle"
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Toggle sidebar">
              <i className="bi bi-list"></i>
            </button>
            <h4 className="mb-0">{currentTitle}</h4>
          </div>
        </div>
        <div className="dashboard-body">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Home