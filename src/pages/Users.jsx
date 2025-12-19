import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedUsers = [...res.data].sort((a, b) => a.userId - b.userId);
        setUsers(sortedUsers);
        setFiltered(sortedUsers);
      } catch (err) {
        console.error(err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const departments = [...new Set(users.map(u => u.department))];
  const roles = [...new Set(users.map(u => u.role))];

  useEffect(() => {
    let data = [...users];
    if (search) {
      data = data.filter((u) =>
        u.u_first_name.toLowerCase().includes(search.toLowerCase()) ||
        u.u_last_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (departmentFilter) {
      data = data.filter((u) => u.department === departmentFilter);
    }
    if (roleFilter) {
      data = data.filter((u) => u.role === roleFilter);
    }
    setFiltered(data);
  }, [search, departmentFilter, roleFilter, users]);

  const resetFilters = () => {
    setSearch("");
    setDepartmentFilter("");
    setRoleFilter("");
    setFiltered(users);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      text: 'Are you sure you want to delete this user?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    })
    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = users.filter((u) => u.userId !== id);
      setUsers(updated);
      setFiltered(updated);
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="section-card">
      <div className="row mb-3">
        <div className="col-md-12">
          <input type="text" className="form-control"
          placeholder="Search by Name" value={search}
          onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-3">
          <select className="form-select" value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-secondary w-100 reset-button" onClick={resetFilters}>
            Reset
          </button>
        </div>
        <div className="col-md-3 add-button-wrapper">
          <button className="btn btn-success add-button"
            onClick={() => navigate("/home/add-user")}>
            Add User
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.userId}>
                  <td>{u.userId}</td>
                  <td>{u.uFirstName}</td>
                  <td>{u.uLastName}</td>
                  <td>{u.uEmail}</td>
                  <td>{u.department}</td>
                  <td>{u.role}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-primary me-2"
                      onClick={() => navigate(`/home/edit-user/${u.userId}`)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u.userId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div> 
  );
};

export default Users