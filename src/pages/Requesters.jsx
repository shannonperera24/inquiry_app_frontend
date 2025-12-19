import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Requesters = () => {
  const [requesters, setRequesters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [establishments, setEstablishments] = useState([]);

  const [search, setSearch] = useState("");
  const [rankFilter, setRankFilter] = useState("");
  const [estbFilter, setEstbFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [reqRes, rankRes, estbRes] = await Promise.all([
          axios.get("http://localhost:3000/requesters", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/ranks"),
          axios.get("http://localhost:3000/establishments"),
        ]);
        const sorted = [...reqRes.data].sort(
          (a, b) => a.requesterId - b.requesterId
        );
        setRequesters(sorted);
        setFiltered(sorted);
        setRanks(rankRes.data);
        setEstablishments(estbRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load requesters.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = [...requesters];
    if (search) {
      data = data.filter(
        (r) =>
          r.officerRegNo?.toLowerCase().includes(search.toLowerCase()) ||
          r.rFirstName?.toLowerCase().includes(search.toLowerCase()) ||
          r.rLastName?.toLowerCase().includes(search.toLowerCase()) ||
          r.nic?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (rankFilter) {
      data = data.filter((r) => r.rank?.rank_id === Number(rankFilter));
    }

    if (estbFilter) {
      data = data.filter((r) => r.estb?.estb_id === Number(estbFilter));
    }
    setFiltered(data);
  }, [search, rankFilter, estbFilter, requesters]);

  const resetFilters = () => {
    setSearch("");
    setRankFilter("");
    setEstbFilter("");
    setFiltered(requesters);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      text: 'Are you sure you want to delete this requester?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    })
    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/requesters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = requesters.filter((r) => r.requesterId !== id);
      setRequesters(updated);
      setFiltered(updated);
      toast.success("Requester deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete requester");
    }
  };

  if (loading) return <p>Loading requesters...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="section-card">
      <div className="row mb-3">
        <div className="col-md-4">
          <input type="text" className="form-control"
          placeholder="Search by Officer Reg No, NIC, or Name" value={search}
          onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}>
            <option value="">All Ranks</option>
            {ranks.map((r) => (
              <option key={r.rank_id} value={r.rank_id}>
                {r.rank_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={estbFilter}
            onChange={(e) => setEstbFilter(e.target.value)}>
            <option value="">All Establishments</option>
            {establishments.map((e) => (
              <option key={e.estb_id} value={e.estb_id}>
                {e.estb_name}
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
              <th>Requester ID</th>
              <th>Officer Reg No</th>
              <th>NIC</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Rank</th>
              <th>Establishment</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No requesters found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.requesterId}>
                  <td>{r.requesterId}</td>
                  <td>{r.officerRegNo || "-"}</td>
                  <td>{r.nic || "-"}</td>
                  <td>{r.firstName}</td>
                  <td>{r.lastName}</td>
                  <td>{r.rank?.rankName || "-"}</td>
                  <td>{r.estb?.estbName || "-"}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-primary me-2"
                      onClick={() => navigate(`/home/view-requester/${r.requesterId}`)}>
                      View
                    </button>
                    <button className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(r.requesterId)}>
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

export default Requesters