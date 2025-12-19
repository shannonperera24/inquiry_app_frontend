import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [inqRes, catRes] = await Promise.all([
          axios.get("http://localhost:3000/inquiries", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/categories"),
        ]);
        const sorted = [...inqRes.data].sort(
          (a, b) => new Date(b.iCreatedAt) - new Date(a.iCreatedAt)
        );
        setInquiries(sorted);
        setFiltered(sorted);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load inquiries.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = [...inquiries];
    if (search) {
      data = data.filter((i) =>
        i.subject.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) {
      data = data.filter((i) => i.status === statusFilter);
    }
    if (categoryFilter) {
      data = data.filter(
        (i) => i.category?.categoryId === Number(categoryFilter)
      );
    }
    setFiltered(data);
  }, [search, statusFilter, categoryFilter, inquiries]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCategoryFilter("");
    setFiltered(inquiries);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      text: 'Are you sure you want to delete this inquiry?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    })
    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = inquiries.filter((i) => i.inquiryId !== id);
      setInquiries(updated);
      setFiltered(updated);
      toast.success("Inquiry deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete inquiry");
    }
  };

  if (loading) return <p>Loading inquiries...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="section-card">
      <div className="row mb-3">
        <div className="col-md-4">
          <input type="text" className="form-control"
          placeholder="Search by Subject" value={search}
          onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100 reset-button" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Inquiry ID</th>
              <th>Category</th>
              <th>Subject</th>
              <th>Requester ID</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No inquiries found
                </td>
              </tr>
            ) : (
              filtered.map((i) => (
                <tr key={i.inquiryId}>
                  <td>{i.inquiryId}</td>
                  <td>{i.category?.categoryName || "-"}</td>
                  <td>{i.subject}</td>
                  <td>{i.requester?.requesterId}</td>
                  <td className="text-capitalize">{i.status.replace("_", " ")}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-primary me-2"
                      onClick={() => navigate(`/home/view-inquiry/${i.inquiryId}`)}>
                      View
                    </button>
                    <button className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(i.inquiryId)}>
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

export default Inquiries