import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "./adminApi";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await adminLogin(email.trim(), pass);
      nav("/admin/documents");
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2>Admin Login</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin email"
          style={{ width: "100%", padding: 10, margin: "8px 0 16px" }}
        />

        <label>Password</label>
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="password"
          type="password"
          style={{ width: "100%", padding: 10, margin: "8px 0 16px" }}
        />

        {err && <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div>}

        <button disabled={loading} style={{ padding: "10px 14px" }}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
