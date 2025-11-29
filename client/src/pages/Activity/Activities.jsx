import { useEffect, useState } from "react";
import useActivity from "../../services/useActivity";
import { Link, useNavigate } from "react-router-dom";

export default function Activities() {
  const { getActivities, getConsistency } = useActivity();

  const [activities, setActivities] = useState([]);

  const navigate = useNavigate(); // ⭐ Needed for logout redirect

  // ⭐ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/login", { replace: true }); // Redirect to login
  };

  // Filters
  const [filters, setFilters] = useState({
    date: "",
    category: "",
    metric: "",
  });

  const [consistency, setConsistency] = useState(null);

  const loadConsistency = async () => {
    const res = await getConsistency();
    if (res.success) setConsistency(res.data);
    else alert(res.message);
  };

  const loadData = async (filterValues = {}) => {
    const res = await getActivities(filterValues);
    if (res.success) setActivities(res.data);
    else alert(res.message);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilter = () => {
    const activeFilters = {};

    if (filters.date) activeFilters.date = filters.date;
    if (filters.category) activeFilters.category = filters.category;
    if (filters.metric) activeFilters.metric = filters.metric;

    loadData(activeFilters);
  };

  const clearFilters = () => {
    setFilters({ date: "", category: "", metric: "" });
    loadData({});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Activities</h2>

          <div className="flex gap-3">
            <Link
              to="/log"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Log Activity
            </Link>

            <Link
              to="/insights"
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Insights
            </Link>

            <button
              onClick={loadConsistency}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
            >
              Consistency
            </button>

            {/* ⭐ Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-5 rounded-xl shadow border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date Filter */}
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Category Filter */}
            <input
              type="text"
              placeholder="Category"
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Metric Filter */}
            <input
              type="text"
              placeholder="Metric"
              value={filters.metric}
              onChange={(e) =>
                setFilters({ ...filters, metric: e.target.value })
              }
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>

            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {consistency && (
          <div className="bg-white p-5 rounded-xl shadow border border-gray-200 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Consistency Score (Last 30 Days)
            </h3>

            {Object.keys(consistency).length === 0 ? (
              <p className="text-gray-600">No activity in the last 30 days.</p>
            ) : (
              <ul className="space-y-2">
                {Object.entries(consistency).map(([category, score]) => (
                  <li
                    key={category}
                    className="flex justify-between bg-gray-50 p-3 rounded-lg border"
                  >
                    <span className="font-semibold">{category}</span>
                    <span>{score}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Activities List */}
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-600 text-center">
              No activities found. Try adjusting the filters!
            </p>
          ) : (
            activities.map((a) => (
              <div
                key={a._id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
              >
                <p className="text-xl font-semibold text-gray-800">
                  {a.category}
                </p>

                <p className="text-gray-600">
                  <strong>{a.metric}:</strong> {a.value}
                </p>

                <p className="text-gray-600">
                  <strong>Duration:</strong> {a.duration} mins
                </p>

                <p className="text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(a.date).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
