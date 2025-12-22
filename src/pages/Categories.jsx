import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Categories = () => {
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });  
        const sorted = [...res.data].sort((a, b) => a.categoryId - b.categoryId);
        setFiltered(sorted);
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = [...categories];
    if (search) {
      data = data.filter((c) =>
        c.categoryName.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(data);
    setCurrentPage(1);
  }, [search, categories]);

  const resetSearch = () => {
    setSearch("");
    setFiltered(categories);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      text: 'Are you sure you want to delete this category?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    })
    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = categories.filter((c) => c.categoryId !== id);
      setCategories(updated);
      setFiltered(updated);
      toast.success("Category deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  if (loading) return <p>Loading categories...</p>;
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
          <button className="btn btn-secondary w-100 reset-button" onClick={resetSearch}>
            Reset
          </button>
        </div>
        <div className="col-md-9 add-button-wrapper">
          <button className="btn btn-success add-button"
            onClick={() => navigate("/home/add-category")}>
            Add Category
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Category ID</th>
              <th>Category Name</th>
              <th>Description</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No categories found
                </td>
              </tr>
            ) : (
              currentItems.map((c) => (
                <tr key={c.categoryId}>
                  <td>{c.categoryId}</td>
                  <td>{c.categoryName || "-"}</td>
                  <td>{c.description || "-"}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-primary me-2"
                      onClick={() => navigate(`/home/edit-category/${c.categoryId}`)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(c.categoryId)}>
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
  );
};

export default Categories