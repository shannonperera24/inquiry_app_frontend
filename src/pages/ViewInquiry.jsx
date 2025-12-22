import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ViewInquiry = () => {
  const { inquiry_id } = useParams();
  const id = Number(inquiry_id);
  if (isNaN(id)) {
    return <p>Invalid inquiry ID</p>;
  }
  const [inquiry, setInquiry] = useState(null);
  const [response, setResponse] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const inquiryRes = await axios.get(`http://localhost:3000/inquiries/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInquiry(inquiryRes.data);
        const responseRes = await axios.get(
          `http://localhost:3000/inquiries/${id}/responses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResponse(responseRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load inquiry.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p>Loading inquiry...</p>;
  if (error) return <p>{error}</p>;

  const statusClass = {
    pending: "red",
    in_progress: "blue",
    resolved: "green",
  };

  return (
    <>
    <div className="section-card">
      <div className="card-header">
        <h3>Requester Details</h3>
      </div>
      <div className="user-details-grid">
        <div className="detail-row">
          <span>Requester ID:</span>
          <strong>{inquiry.requester?.requesterId}</strong>
        </div> 
        <div className="detail-row">
          <span>Officer Reg No:</span>
          <strong>{inquiry.requester?.officerRegNo || "-"}</strong>
        </div>
        <div className="detail-row">
          <span>NIC:</span>
          <strong>{inquiry.requester?.nic || "-"}</strong>
        </div>
        <div className="detail-row">
          <span>First Name:</span>
          <strong>{inquiry.requester?.rFirstName}</strong>
        </div>
        <div className="detail-row">
          <span>Last Name:</span>
          <strong>{inquiry.requester?.rLastName}</strong>
        </div>
        <div className="detail-row">
          <span>Email:</span>
          <strong>{inquiry.requester?.rEmail}</strong>
        </div>
        <div className="detail-row">
          <span>Phone Number:</span>
          <strong>{inquiry.requester?.phoneNo}</strong>
        </div>
        <div className="detail-row">
          <span>Rank:</span>
          <strong>{inquiry.requester?.rank || "-"}</strong>
        </div>
        <div className="detail-row">
          <span>Establishment:</span>
          <strong>{inquiry.requester?.estb || "-"}</strong>
        </div>
      </div>
    </div>

    <div className="section-card">
      <div className="card-header">
        <h3>Inquiry Details</h3>
      </div>
      <div className="user-details-grid">
        <div className="detail-row">
          <span>Inquiry ID:</span>
          <strong>{inquiry.inquiryId}</strong>
        </div>
        <div className="detail-row">
          <span>Subject:</span>
          <strong>{inquiry.subject}</strong>
        </div>
        <div className="detail-row">
          <span>Inquiry:</span>
          <strong>{inquiry.inquiryText}</strong>
        </div>
        <div className="detail-row">
          <span>Created At:</span>
          <strong>{new Date(inquiry.iCreatedAt).toLocaleString()}</strong>
        </div>
        <div className="detail-row">
          <span>Status:</span>
          <span className={`text-capitalize status-text ${statusClass[inquiry.status] || ""}`}>
            {inquiry.status.replace("_", " ")}
          </span>
        </div>
        <div className="detail-row">
          <span>Category:</span>
          <strong>{inquiry.category?.categoryName}</strong>
        </div>
      </div>
    </div>

    {inquiry.attachments?.length > 0 && (
      <div className="section-card">
        <div className="card-header"><h3>Inquiry Attachments</h3></div>
        <div className="attachments-list">
          <ul>
            {inquiry.attachments.map((file) => {
              const fileUrl = `http://localhost:3000${file.filePath}`;
              const fileName = file.filePath.split("/").pop();

              return (
                <li key={file.attachmentId}>
                  <span className="file-name">{fileName}</span>
                  <div>
                    <button className="btn btn-sm btn-primary me-2"
                      onClick={() => window.open(fileUrl, "_blank")}>
                      View
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    )}
    
    <div className="section-card">
      <div className="card-header">
        <h3>Response Details</h3>
      </div>
      {response.length === 0 ? (
        <div className="row mb-3">
          <div className="col-md-12 add-button-wrapper">
            <button className="btn btn-success add-button" 
              onClick={() => navigate(`/home/submit-response/${inquiry_id}`)}>
              Submit Response
            </button>
          </div>
        </div>
        ) : (
          response.map((res) => (
            <div key={res.responseId} className="user-details-grid">
              <div className="detail-row">
                <span>Response ID:</span>
                <strong>{res.responseId}</strong>
              </div>
              <div className="detail-row">
                <span>Response:</span>
                <strong>{res.responseText}</strong>
              </div>
              <div className="detail-row">
                <span>Created At:</span>
                <strong>{new Date(res.rCreatedAt).toLocaleString()}</strong>
              </div>
              <div className="detail-row">
                <span>Resolved By:</span>
                <strong>{res.user?.userId} | {res.user?.uFirstName} {res.user?.uLastName}</strong>
              </div>
            </div>
          ))
        )}
      </div>

      {response.length > 0 && (
        <div className="section-card">
          <div className="card-header"><h3>Response Attachments</h3></div>
          <div className="attachments-list">
            {response.some(res => res.attachments?.length > 0) ? (
              <ul>
                {response.map((res) =>
                  res.attachments?.map((file) => (
                    <li key={file.fileId}>
                      <span className="file-name">
                        {file.fileName || file.filePath.split("/").pop()}
                      </span>
                      <div>
                        <button className="btn btn-sm btn-primary me-2" 
                          onClick={() => window.open(
                            `http://localhost:3000${file.filePath}`, "_blank")}>
                          View</button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            ) : (
              <p>No attachments available for this response.</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ViewInquiry