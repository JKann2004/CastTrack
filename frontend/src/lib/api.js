// Tiny wrapper around fetch for the CastTrack API.
//
// - Reads the API base URL from VITE_API_URL (set in .env), falls back to localhost.
// - Automatically attaches `Authorization: Bearer <token>` if a JWT is in localStorage.
// - Parses JSON, throws an Error on non-2xx with the server's error message.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function authHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
            ...(options.headers || {}),
        },
    });

    // Try to parse JSON regardless of status — most errors come back as JSON
    let data = null;
    const text = await res.text();
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { raw: text };
        }
    }

    if (!res.ok) {
        const message =
            data?.error ||
            data?.message ||
            (data?.errors && data.errors.map((e) => `${e.field}: ${e.message}`).join(", ")) ||
            `Request failed with status ${res.status}`;
        const err = new Error(message);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

export const api = {
    get: (path) => request(path, { method: "GET" }),
    post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
    patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: "DELETE" }),
};

export const API_BASE = API_URL;
