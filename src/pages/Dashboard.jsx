import { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    in_progress: 0,
    resolved: 0,
    total: 0,
  });
  const [categoryData, setCategoryData] = useState(null);
  const [yearlyData, setYearlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const [statsRes, catRes, yearlyRes] = await Promise.all([
          axios.get("http://localhost:3000/inquiries/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/inquiries/charts/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/inquiries/charts/yearly/${new Date().getFullYear()}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const { pending, in_progress, resolved } = statsRes.data;
        const total = pending + in_progress + resolved;
        setStats({ pending, in_progress, resolved, total });

        setCategoryData({
          labels: catRes.data.map(d => d.category),
          datasets: [
            {
              label: "Inquiries by Category",
              data: catRes.data.map(d => d.count),
              backgroundColor: [
                "#FF9F40",
                "#36A2EB",
                "#FF6384",
                "#4BC0C0",
                "#9966FF",
                "#FFCD56",
              ],
            },
          ],
        })

        setYearlyData({
          labels: yearlyRes.data.map(d => `Month ${d.month}`),
          datasets: [
            {
              label: "Monthly Inquiries",
              data: yearlyRes.data.map(d => d.count),
              borderColor: "orange",
              backgroundColor: "rgba(255,159,64,0.2)",
              tension: 0.3,
            },
          ],
        })
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-outlet">
      <div className="dashboard-cards">
        <StatCard title="Total" count={stats.total} color="orange" />
        <StatCard title="Pending" count={stats.pending} color="red" />
        <StatCard title="In Progress" count={stats.in_progress} color="blue" />
        <StatCard title="Resolved" count={stats.resolved} color="green" />
      </div>
      <div className="charts-container">
        {categoryData && (
          <div className="chart-card">
            <h3>Inquiries by Category</h3>
            <Pie data={categoryData} />
          </div>
        )}

        {yearlyData && (
          <div className="chart-card">
            <h3>Monthly Inquiries ({new Date().getFullYear()})</h3>
            <Line data={yearlyData} />
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, count, color }) => (
  <div className={`stat-card ${color}`}>
    <h2>{title}</h2>
    <p>{count}</p>
  </div>
);

export default Dashboard;
