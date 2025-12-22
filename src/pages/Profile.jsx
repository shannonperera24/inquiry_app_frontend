import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null)
  const [responses, setResponses] = useState([])

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [profileRes, responsesRes] = await Promise.all([
          axios.get("http://localhost:3000/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/responses/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(profileRes.data);
        const sortedResponses = responsesRes.data.sort(
          (a, b) => new Date(b.rCreatedAt) - new Date(a.rCreatedAt),
        )
        setResponses(sortedResponses)
      } catch (err) {
        console.error(err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <div className="section-card">
      <div className="card-header">
        <h3>User Details</h3>
      </div>

      <div className="card-body">
        <div className="detail-row">
          <span>User ID</span>
          <strong>{user.userId}</strong>
        </div>
        <div className="detail-row">
          <span>First Name</span>
          <strong>{user.uFirstName}</strong>
        </div>
        <div className="detail-row">
          <span>Last Name</span>
          <strong>{user.uLastName}</strong>
        </div>
        <div className="detail-row">
          <span>Department</span>
          <strong>{user.department}</strong>
        </div>
        <div className="detail-row">
          <span>Email</span>
          <strong>{user.uEmail}</strong>
        </div>
        <div className="detail-row">
          <span>Role</span>
          <strong>{user.role}</strong>
        </div>
      </div>
      <div className="card-footer right">
        <button
          className="btn-primary"
          onClick={() => navigate('/change-password')}
        >
          Change Password
        </button>
      </div>
    </div>
    
    <div className="section-card">
      <div className="card-header">
        <h3>Responses</h3>
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Response ID</th>
              <th>Response Text</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {responses.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">
                  No responses found
                </td>
              </tr>
            ) : (
              responses.map((r) => (
                <tr key={r.responseId}>
                  <td>{r.responseId}</td>
                  <td className="truncate">{r.responseText}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-primary me-2"
                      onClick={() => navigate(`/home/view-inquiry/${i.inquiryId}`)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div> 
    
    </>
  );
};

export default Profile