"use client";
import { useEffect, useState } from "react";

const steps = [
  "Submitted",
  "In Review",
  "AFM Issued",
  "Completed"
];

export function StatusTracker() {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    // Fetch Status von API, hier simuliert:
    setTimeout(() => setCurrent(2), 1500);
    setTimeout(() => setCurrent(3), 3500);
  }, []);

  return (
    <ol className="list-decimal pl-6 space-y-1">
      {steps.map((step, i) => (
        <li
          key={i}
          className={i <= current ? "text-blue-600 font-semibold" : "text-gray-400"}
        >
          {step}
        </li>
      ))}
    </ol>
  );
} 