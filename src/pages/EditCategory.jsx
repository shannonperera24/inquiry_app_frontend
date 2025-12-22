import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const EditCategory = () => {
    const { category_id } = useParams();
    const id = Number(category_id);

    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      const fetchCategory = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`http://localhost:3000/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCategoryName(res.data.categoryName || '');
          setDescription(res.data.description || '');
        } catch (err) {
          console.error(err);
          setError("Failed to load category data.");
        } finally {
          setLoading(false);
        }
      };
      if (!isNaN(id)) {
        fetchCategory();
      } else {
        setError("Invalid category ID.");
        setLoading(false);
      }
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/categories/${id}`, 
              { categoryName, description}, 
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Category updated successfully!");
            navigate('/home/categories');
        } catch (err) {
            console.error(err);
            const message =
                err.response?.data?.message?.[0] ||
                err.response?.data?.message ||
                "Failed to update category.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading category...</p>;
    if (error) return <p>{error}</p>;

    return (
      <div className="landing-main d-flex flex-column align-items-center justify-content-center">
          <form className='section-form mb-4' onSubmit={handleSubmit}>
              <div className='section-card'>
                  <div className='mb-4'>
                      <label className='form-label'>Category Name:</label>
                      <input type='text' className='form-control' placeholder='Enter category name'
                      value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
                      required />
                  </div>
                  <div className='mb-4'>
                      <label className='form-label'>Description:</label>
                      <textarea className='form-control' placeholder='Enter description'
                      value={description} onChange={(e) => setDescription(e.target.value)}
                      required />
                  </div>
              </div>

              <div className='submit-btn-wrapper'>
                  <button type='submit' className='btn btn-success mb-4'>
                      Save
                  </button>
              </div>
          </form>
      </div>
    )
}

export default EditCategory