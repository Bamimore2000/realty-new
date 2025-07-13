"use client";

import { useState } from "react";

export default function TokenModal({
  onVerify,
}: {
  onVerify: (token: string) => void;
}) {
  const [token, setToken] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-[300px] text-center">
        <h2 className="text-lg font-semibold mb-2">Enter Access Token</h2>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter token"
          className="border rounded w-full px-2 py-1 mb-4"
        />
        <button
          onClick={() => onVerify(token)}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
