"use client";

import { useState } from "react";

interface Token {
  id: string;
  value: string;
  used: boolean;
  createdAt: string;
}

interface Props {
  tokens: Token[];
}

export default function TokenList({ tokens }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyToClipboard(token: string, id: string) {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      alert("Failed to copy!");
    }
  }

  return (
    <div className="space-y-3">
      {tokens.length === 0 ? (
        <p className="text-gray-500">No tokens created yet.</p>
      ) : (
        tokens.map((token) => (
          <div
            key={token.id}
            className="p-3 border rounded-md bg-white shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="font-mono text-sm text-gray-800">{token.value}</p>
              <p className="text-xs text-gray-500">
                Created: {new Date(token.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  token.used
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {token.used ? "Used" : "Unused"}
              </span>

              <button
                onClick={() => copyToClipboard(token.value, token.id)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm transition"
                aria-label={`Copy token ${token.value}`}
              >
                {copiedId === token.id ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
