import { useState } from "react";
import API from "../api";
import "./AdminFeatures.css";

function AdminFeatures() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeature = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await API.post("/features", formData); // 👈 JWT auto-attached
      setMsg("✅ Feature added successfully");
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Access denied");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin — Add VIP Feature</h2>

      {msg && <p className="admin-message">{msg}</p>}

      <form onSubmit={submitFeature}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button disabled={loading}>
          {loading ? "Uploading..." : "Add Feature"}
        </button>
      </form>
    </div>
  );
}

export default AdminFeatures;