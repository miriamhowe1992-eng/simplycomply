import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AdminDocuments() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const [docs, setDocs] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetch(`${API_BASE}/api/admin/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setDocs);
  }, [token]);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !token) return;

    const form = new FormData();
    form.append("title", title);
    form.append("file", file);

    await fetch(`${API_BASE}/api/admin/documents`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    setTitle("");
    setFile(null);
    window.location.reload();
  }

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Documents</h1>
        <button onClick={logout}>Log out</button>
      </div>

      <form onSubmit={upload} className="flex gap-2 mb-6">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-1"
        />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button className="bg-black text-white px-4">Upload</button>
      </form>

      <ul className="space-y-2">
        {docs.map((d) => (
          <li key={d._id} className="border p-3 flex justify-between">
            <span>{d.title}</span>
            <a
              href={`${API_BASE}/api/admin/documents/${d._id}/download`}
              target="_blank"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
