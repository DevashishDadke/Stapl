import { useEffect, useState } from "react";
import useActivity from "../../services/useActivity";
import { useNavigate } from "react-router-dom";

export default function Insights() {
  const { getInsights } = useActivity();
  const [insights, setInsights] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInsights = async () => {
      const res = await getInsights("2025-01-01", "2025-12-31");

      if (res.success) setInsights(res.data);
      else alert(res.message);
    };

    fetchInsights();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/activity")}
          className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-800 transition"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Activity Insights
        </h2>

        {!insights ? (
          <p className="text-center text-gray-600">Loading insights...</p>
        ) : (
          <div className="space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700">
                  Total Time
                </h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {insights.totalTime} mins
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700">
                  Top Category
                </h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {insights.topCategory}
                </p>
              </div>
            </div>

            {/* Max Metrics */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Max Metrics
              </h3>

              <div className="space-y-2">
                {Object.entries(insights.metricMax).map(([metric, value]) => (
                  <div
                    key={metric}
                    className="flex justify-between bg-blue-50 px-4 py-2 rounded-lg border border-blue-200"
                  >
                    <span className="font-semibold text-blue-800">
                      {metric}
                    </span>
                    <span className="text-blue-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Min Metrics */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200 mb-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Min Metrics
              </h3>

              <div className="space-y-2">
                {Object.entries(insights.metricMin).map(([metric, value]) => (
                  <div
                    key={metric}
                    className="flex justify-between bg-red-50 px-4 py-2 rounded-lg border border-red-200"
                  >
                    <span className="font-semibold text-red-800">
                      {metric}
                    </span>
                    <span className="text-red-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
