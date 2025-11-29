import { useState } from "react";
import useActivity from "../../services/useActivity";
import { useNavigate } from "react-router-dom";

export default function LogActivity() {
  const { logActivity } = useActivity();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: "",
    metric: "",
    value: "",
    duration: "",
    date: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await logActivity(form);
    if (res.success) {
      alert("Activity Logged!");
      setForm({ category: "", metric: "", value: "", duration: "", date: "" });
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border border-gray-200">

        {/* Back Button */}
        <button
          onClick={() => navigate("/activity")}
          className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-800 transition"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Log New Activity
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Category */}
          <input
            placeholder="Category (Running)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />

          {/* Metric */}
          <input
            placeholder="Metric (distance)"
            value={form.metric}
            onChange={(e) => setForm({ ...form, metric: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />

          {/* Value */}
          <input
            placeholder="Value (5)"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />

          {/* Duration */}
          <input
            placeholder="Duration (Minutes)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />

          {/* NEW: Date Field */}
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit Activity
          </button>
        </form>

      </div>
    </div>
  );
}
