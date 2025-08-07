"use client";
import { useState } from "react";

export function DocumentUploader({ onUpload }: { onUpload?: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setProgress(10);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    setProgress(100);
    setMessage(res.ok ? "Upload erfolgreich!" : "Fehler beim Upload.");
    if (onUpload && res.ok) onUpload(file);
  };

  return (
    <div className="p-4 border rounded shadow max-w-md">
      <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
      {preview && <img src={preview} alt="Preview" className="my-4 max-h-40" />}
      <button
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleUpload}
        disabled={!file}
      >
        Datei hochladen
      </button>
      {progress > 0 && <div className="mt-2 text-xs">Fortschritt: {progress}%</div>}
      {message && <div className="mt-2 text-green-600">{message}</div>}
    </div>
  );
} 