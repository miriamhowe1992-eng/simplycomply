import React, { useEffect, useState } from "react";
import {
  clearToken,
  listDocuments,
  uploadDocument,
  getDownloadUrl,
  deleteDocument,
} from "./adminApi";
import { useNavigate } from "react-router-dom";

export default function AdminDocuments() {
  const nav = useNavigate();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function refresh() {
    setErr("");
    setLoading(true);
    try {
      const data = await listDocuments();
      setDocs(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onUpload(e) {
    e.preventDefault();
    if (!title.trim() || !file) return;
    setUploading(true);
    setErr("");
    try {
      await uploadDocument(title.trim(), file);
      setTitle("");
      setFile(null);
      await refresh();
    } catch (e2) {
      setErr(e2.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onDownload(id) {
    setErr("");
    try {
      const { url } = await getDownloadUrl(id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setErr(e.message || "Download failed");
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Delete this document?")) return;
    setErr("");
    try {
      await deleteDocument(id);
      await refresh();
    } catch (e) {
      setErr(e.message || "Delete failed");
    }
  }

  function logout() {
    clearToken();
    nav("/admin/login");
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Documents</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <form onSubmit={onUpload} style={{ display: "flex", gap: 12, alignItems: "center", margin: "16px 0" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title (e.g. Fire Safety Policy)"
          style={{ flex: 1, padding: 10 }}
        />
        <input
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button disabled={uploading || !title.trim() || !file}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {err && <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div>}

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: 12, background: "#fafafa", fontWeight: 600 }}>
            <div>Title</div>
            <div>Type</div>
            <div>Size</div>
            <div>Actions</div>
          </div>

          {docs.length === 0 ? (
            <div style={{ padding: 12 }}>No documents yet.</div>
          ) : (
            docs.map((d) => (
              <div
                key={d._id}
                style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: 12, borderTop: "1px solid #eee" }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{d.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{d.created_at || ""}</div>
                </div>
                <div style={{ fontSize: 12 }}>{d.content_type}</div>
                <div style={{ fontSize: 12 }}>{d.size} bytes</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => onDownload(d._id)}>Download</button>
                  <button onClick={() => onDelete(d._id)} style={{ color: "crimson" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
