import React, { useState } from "react";

export default function App() {
  const [formData, setFormData] = useState({
    area: 5000,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    guestroom: 0,
    basement: 0,
    hotwaterheating: 0,
    airconditioning: 1,
    prefarea: 0,
    furnishingStatus: "semi-furnished",
  });

  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      area: formData.area,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      guestroom: formData.guestroom,
      basement: formData.basement,
      hotwaterheating: formData.hotwaterheating,
      airconditioning: formData.airconditioning,
      parking: formData.parking,
      prefarea: formData.prefarea,
      "furnishingstatus_semi-furnished": formData.furnishingStatus === "semi-furnished" ? 1 : 0,
      furnishingstatus_unfurnished: formData.furnishingStatus === "unfurnished" ? 1 : 0,
    };

    try {
      const apiBase = import.meta.env.VITE_API_URL || (window.location.port === "5173" ? "http://localhost:8000" : "");
      const response = await fetch(`${apiBase}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to communicate with FastAPI server.");
      const data = await response.json();
      setPrice(data.predicted_price);
    } catch (err) {
      setError(err.message || "An error occurred while fetching prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-950/50">

        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Linear Regression ML Model
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            House Valuation Predictor
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Fill in property details to generate real-time market price estimations.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Area Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Area (Sq Ft)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Parking */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Parking Spaces
              </label>
              <input
                type="number"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Guestroom */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Guestroom
              </label>
              <select
                name="guestroom"
                value={formData.guestroom}
                onChange={handleChange}
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value={1} className="bg-slate-900">Yes</option>
                <option value={0} className="bg-slate-900">No</option>
              </select>
            </div>

            {/* Basement */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Basement
              </label>
              <select
                name="basement"
                value={formData.basement}
                onChange={handleChange}
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value={1} className="bg-slate-900">Yes</option>
                <option value={0} className="bg-slate-900">No</option>
              </select>
            </div>

            {/* Hot Water Heating */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Hot Water Heating
              </label>
              <select
                name="hotwaterheating"
                value={formData.hotwaterheating}
                onChange={handleChange}
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value={1} className="bg-slate-900">Yes</option>
                <option value={0} className="bg-slate-900">No</option>
              </select>
            </div>

            {/* Air Conditioning */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Air Conditioning
              </label>
              <select
                name="airconditioning"
                value={formData.airconditioning}
                onChange={handleChange}
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value={1} className="bg-slate-900">Yes</option>
                <option value={0} className="bg-slate-900">No</option>
              </select>
            </div>

            {/* Preferred Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Preferred Area
              </label>
              <select
                name="prefarea"
                value={formData.prefarea}
                onChange={handleChange}
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value={1} className="bg-slate-900">Yes</option>
                <option value={0} className="bg-slate-900">No</option>
              </select>
            </div>

            {/* Furnishing Status */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Furnishing Status
              </label>
              <select
                name="furnishingStatus"
                value={formData.furnishingStatus}
                onChange={handleChange}
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="furnished" className="bg-slate-900">Furnished</option>
                <option value="semi-furnished" className="bg-slate-900">Semi-Furnished</option>
                <option value="unfurnished" className="bg-slate-900">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-[0.99] disabled:opacity-50 text-sm tracking-wide"
          >
            {loading ? "Computing Valuation..." : "Predict Market Price"}
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Prediction Result Card */}
        {price !== null && !error && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-b from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 text-center relative overflow-hidden">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Estimated Valuation
            </span>
            <div className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
              ${price.toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}