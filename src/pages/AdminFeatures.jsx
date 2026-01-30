import { useState } from "react";
import "./AdminFeatures.css";

function AdminFeatures() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeature = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setMsg("❌ You must be logged in as admin");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/features", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "❌ Access denied");
      } else {
        setMsg("✅ Feature added successfully");
        setTitle("");
        setDescription("");
        setImage(null);
        document.getElementById("imageInput").value = "";
      }
    } catch (err) {
      setMsg("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin — Add VIP Feature</h2>

      {msg && <p className="admin-message">{msg}</p>}

      <form onSubmit={submitFeature}>
        <input
          type="text"
          placeholder="Feature title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Feature description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Add Feature"}
        </button>
      </form>
    </div>
  );
}

export default AdminFeatures;