import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ViewRequester = () => {
  const { requester_id } = useParams();
  const id = Number(requester_id);
  if (isNaN(id)) {
    return <p>Invalid requester ID</p>;
  }
  const [requester, setRequester] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([])

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const requesterRes = await axios.get(`http://localhost:3000/requesters/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequester(requesterRes.data);
        const inquiriesRes = await axios.get(
          `http://localhost:3000/requesters/${id}/inquiries`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const sortedInquiries = inquiriesRes.data.sort(
            (a, b) => new Date(b.iCreatedAt) - new Date(a.iCreatedAt)
        );
        setInquiries(sortedInquiries);
        setFiltered(sortedInquiries);
        const catRes = await axios.get("http://localhost:3000/categories");
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load requester data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter, inquiries]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCategoryFilter("");
    setFiltered(inquiries);
    setCurrentPage(1);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const statusClass = {
    pending: "red",
    in_progress: "blue",
    resolved: "green",
  };

  if (loading) return <p>Loading requester...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <div className="section-card">
      <div className="card-header">
        <h3>Requester Details</h3>
      </div>
      <div className="user-details-grid">
        <div className="detail-row">
          <span>Requester ID:</span>
          <strong>{requester?.requesterId}</strong>
        </div> 
        <div className="detail-row">
          <span>Officer Reg No:</span>
          <strong>{requester?.officerRegNo || "-"}</strong>
        </div>
        <div className="detail-row">
          <span>NIC:</span>
          <strong>{requester?.nic || "-"}</strong>
        </div>
        <div className="detail-row">
          <span>First Name:</span>
          <strong>{requester?.rFirstName}</strong>
        </div>
        <div className="detail-row">
          <span>Last Name:</span>
          <strong>{requester?.rLastName}</strong>
        </div>
        <div className="detail-row">
          <span>Email:</span>
          <strong>{requester?.rEmail}</strong>
        </div>
        <div className="detail-row">
          <span>Phone Number:</span>
          <strong>{requester?.phoneNo}</strong>
        </div>
        <div className="detail-row">
          <span>Rank:</span>
          <strong>{requester?.rank?.rank_name || "-"}</strong>
        </div>
        <div className="detail-row">
          <span>Establishment:</span>
          <strong>{requester?.establishment?.estb_name || "-"}</strong>
        </div>
      </div>
    </div>

    <div className="section-card">
      <div className="card-header">
        <h3>Inquiries</h3>
      </div>
      <div className="row mb-3">
        <div className="col-md-12">
          <input type="text" className="form-control"
          placeholder="Search by Subject" value={search}
          onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="row mb-3">
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
        <div className="col-md-3">
          <button className="btn btn-secondary w-100 reset-button" onClick={resetFilters}>
            Reset
          </button>
        </div>
        <div className="col-md-3 add-button-wrapper">
          <button className="btn btn-success add-button"
            onClick={() => navigate("/submit-inquiry")}>
            Submit Inquiry
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
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="" className="text-center">
                  No inquiries found
                </td>
              </tr>
            ) : (
              currentItems.map((i) => (
                <tr key={i.inquiryId}>
                  <td>{i.inquiryId}</td>
                  <td>{i.category?.categoryName || "-"}</td>
                  <td>{i.subject}</td>
                  <td className={`text-capitalize status-text ${statusClass[i.status] || ""}`}>
                    {i.status.replace("_", " ")}
                  </td>
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

      {totalPages > 1 && (
        <div className="d-flex justify-content-end mt-3">
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-secondary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}>
                Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button className="btn btn-sm btn-secondary"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}>
                Next
            </button>
          </div>
        </div>
      )}
    </div> 
    </>
  )
}

export default ViewRequester