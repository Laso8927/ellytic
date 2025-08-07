"use client";
import { useEffect, useState } from "react";

export function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [uploads, setUploads] = useState<any[]>([]);

  useEffect(() => {
    // Dummy-Fetch für Requests/Uploads/Users
    setRequests([{ id: 1, bundle: "AFM", status: "In Review" }]);
    setUsers([{ id: 1, email: "user@example.com" }]);
    setUploads([{ id: 1, filename: "passport.pdf" }]);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-lg font-semibold">Requests</h2>
        <ul>
          {requests.map(r => (
            <li key={r.id}>{r.bundle} – Status: {r.status}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold">User</h2>
        <ul>
          {users.map(u => (
            <li key={u.id}>{u.email}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold">Uploads</h2>
        <ul>
          {uploads.map(u => (
            <li key={u.id}>{u.filename}</li>
          ))}
        </ul>
      </section>
    </div>
  );
} 