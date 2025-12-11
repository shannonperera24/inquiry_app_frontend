import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'

axios.defaults.withCredentials = true;

const SubmitInquiry = () => {
    const [values, setValues] = useState({
        subject: '',
        inquiryText: '',
        categoryId: '',
        requesterType: '',
        officerRegNo: '',
        rFirstName: '',
        rLastName: '',
        rEmail: '',
        phoneNo: '',
        rank: '',
        estb: ''
    });

    const [categories, setCategories] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    const [officerFound, setOfficerFound] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    //FIX
    const handleOfficerLookup = async () => {}
    const handleAutoFill = () => {}

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:3000/categories");
                setCategories(res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter((file) => 
            allowedTypes.includes(file.type)
        );
        if (validFiles.length !== selectedFiles.length) {
            alert("Only PDF, DOCX, JPG, and PNG files are allowed.");
        }
        setAttachments(validFiles);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key] ?? "");
        });

        attachments.forEach((file) => {
            formData.append("attachments", file);
        });

        try {
        await axios.post('http://localhost:3000/inquiries', formData);

        alert('Inquiry submitted successfully!');
        navigate('/');
        } catch (err) {
        console.error(err);
        setError('Failed to submit inquiry.');
        }
    }

    return (
        <div className='submit-inquiry-page'>
            <div className='page-header d-flex justify-content-between align-items-center mb-4'>
                <button className='btn btn-primary home-btn' 
                onClick={() => navigate("/")}>
                    <i className='bi bi-house-door login-icon'></i>
                    <span className='login-text'>Home</span>
                </button>
                <h1 className='landing-title'>Submit Inquiry</h1>
                <img src='/src/assets/sl-army-logo.png' className='login-logo' />
            </div>

            <div className="landing-main d-flex flex-column align-items-center justify-content-center">
                <form className='section-form mb-4' onSubmit={handleSubmit}>
                    <div className='section-card'>
                        <h5>INQUIRY DETAILS</h5>
                        <div className='mb-4'>
                            <label className='form-label'>Category:</label>
                            <select className='form-select'value={values.categoryId} 
                            onChange={(e) => setValues({...values, categoryId: e.target.value})}
                            required>
                                <option value="">-Select-</option>
                                {categories.map((c) => (
                                    <option key={c.categoryId} value={c.categoryId}>
                                        {c.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className='form-label'>Subject:</label>
                            <input type='text' className='form-control' placeholder='Enter subject'
                            value={values.subject} onChange={(e) => setValues({...values, subject: e.target.value})}
                            required />
                        </div>
                        <div>
                            <label className='form-label'>Inquiry:</label>
                            <textarea type='text' className='form-control' placeholder='Enter inquiry'
                            value={values.inquiryText} onChange={(e) => setValues({...values, inquiryText: e.target.value})}
                            required />
                        </div>
                    </div>

                    <div className='section-card'>
                        <h5>ATTACHMENTS</h5>
                        <div>
                            <label className='form-label'>File types allowed: pdf, docx, jpg, png</label>
                            <input type='file' className='form-control'
                            multiple onChange={handleFileChange}
                            accept='.pdf, .docx, .jpg, .jpeg, .png' />
                            {attachments.length > 0 && (
                                <div style={{ marginTop: "1rem" }}>
                                    <strong>Files Selected:</strong>
                                    <ul>
                                        {attachments.map((file, index) => (
                                            <li key={index}>{file.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='section-card'>
                        <h5>REQUESTER DETAILS</h5>
                        <div className='mb-4'>
                            <label className='form-label'>Requester Type:</label>
                            <select className='form-select' value={values.requesterType}
                            onChange={(e) => setValues({ ...values, requesterType: e.target.value })} 
                            required>
                                <option value="">-Select-</option>
                                <option value="army">Army</option>
                                <option value="civilian">Civilian</option>
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label className='form-label'>Officer Registration Number:</label>
                            <input type='text' className='form-control' placeholder='Enter officer registration number'
                            value={values.officerRegNo} onChange={(e) => setValues({...values, officerRegNo: e.target.value})}
                            disabled={values.requesterType === "civilian"} />
                        </div>
                        <div className='mb-4'>
                            <label className='form-label'>First Name:</label>
                            <input type='text' className='form-control' placeholder='Enter first name'
                            value={values.rFirstName} onChange={(e) => setValues({...values, rFirstName: e.target.value})}
                            required />
                        </div>
                        <div className='mb-4'>
                            <label className='form-label'>Last Name:</label>
                            <input type='text' className='form-control' placeholder='Enter last name'
                            value={values.rLastName} onChange={(e) => setValues({...values, rLastName: e.target.value})}
                            required />
                        </div>
                        <div className='mb-4'>
                            <label className='form-label'>Email:</label>
                            <input type='email' className='form-control' placeholder='Enter email'
                            value={values.rEmail} onChange={(e) => setValues({...values, rEmail: e.target.value})}
                            required />
                        </div>
                        <div className='mb-4'>
                            <label className='form-label'>Phone Number:</label>
                            <input type='text' className='form-control' placeholder='Enter phone number'
                            value={values.phoneNo} onChange={(e) => setValues({...values, phoneNo: e.target.value})}
                            required />
                        </div>
                        <div className='mb-4'>
                            <label className='form-label'>Rank:</label>
                            <input type='text' className='form-control' placeholder='Enter rank'
                            value={values.rank} onChange={(e) => setValues({...values, rank: e.target.value})}
                            disabled={values.requesterType === "civilian"} />
                        </div>
                        <div>
                            <label className='form-label'>Establishment:</label>
                            <input type='text' className='form-control' placeholder='Enter establishment'
                            value={values.estb} onChange={(e) => setValues({...values, estb: e.target.value})}
                            disabled={values.requesterType === "civilian"} />
                        </div>
                    </div>

                    <div className='submit-btn-wrapper'>
                        <button type='submit' className='btn btn-success mb-4'>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SubmitInquiry