import React, { useEffect, useState, useMemo } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";


export default function CatchPage() {
    const [waterbodies, setWaterbodies] = useState([]);
    const [selectedWaterbodyId, setSelectedWaterbodyId] = useState("");
    const [reports, setReports] = useState([]);
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const { role } = useAuth();
    const canManage = role === "ADMIN" || role === "MODERATOR";
    const canDelete = role === "ADMIN";

    const getWaterbodyName = (id) =>
        waterbodies.find(w => w.id === id)?.name || "Unknown";

    const [form, setForm] = useState({
        species: "",
        method: "",
        notes: "",
        visibility: "PUBLIC",
    });

    const { isLoggedIn } = useAuth();

    // Initial waterbody list
    useEffect(() => {
        api.get("/waterbodies")
            .then((res) => {
                const list = Array.isArray(res) ? res : res?.data || [];
                setWaterbodies(list);
                if (list.length > 0) setSelectedWaterbodyId(list[0].id);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load waterbodies.");
            });
    }, []);

    // Reload reports + trends whenever the waterbody changes
    useEffect(() => {
        if (!selectedWaterbodyId) return;
        loadReports(selectedWaterbodyId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWaterbodyId]);

    async function loadReports(id = selectedWaterbodyId) {
        setLoading(true);
        setError("");

        try {
            const [reportsRes, trendsRes] = await Promise.allSettled([
                api.get(`/catch-reports?waterbody_id=${id}&limit=20`),
                api.get(`/catch-reports/trends?waterbody_id=${id}`),
            ]);

            if (reportsRes.status === "fulfilled") {
                setReports(reportsRes.value?.data || []);
            }

            if (trendsRes.status === "fulfilled") {
                setTrends(trendsRes.value?.data || null);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!selectedWaterbodyId || !form.species.trim() || !form.method.trim()) {
            console.log("Missing required fields", form);
            return;
        }

        try {
            console.log("Submitting payload:", {
                waterbodyId: selectedWaterbodyId,
                species: form.species.trim(),
                method: form.method.trim(),
                notes: form.notes?.trim() || undefined,
                visibility: form.visibility,
            });

            const res = await api.post("/catch-reports", {
                waterbodyId: selectedWaterbodyId,
                species: form.species.trim(),
                method: form.method.trim(),
                notes: form.notes?.trim() || undefined,
                visibility: form.visibility,
            });

            console.log("Submit success:", res);

            setForm({
                species: "",
                method: "",
                notes: "",
                visibility: "PUBLIC",
            });

            setShowModal(false);

            await loadReports(selectedWaterbodyId);
        } catch (err) {
            console.error("❌ Submit failed FULL ERROR:", err);
            setError(err?.response?.data?.message || "Failed to submit catch.");
        }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this catch report?")) return;

        try {
            await api.delete(`/catch-reports/${id}`);
            await loadReports(selectedWaterbodyId);
        } catch (err) {
            console.error("❌ DELETE ERROR:", err.message);
            alert(err.message || "Failed to delete report");
        }
    }

    async function handleFlag(id) {
        if (!confirm("Flag this report for moderator review?")) return;
        try {
            await api.post(`/catch-reports/${id}/flag`);
            alert("Report flagged.");
            loadReports();
        } catch (err) {
            alert(err.message || "Failed to flag report");
        }
    }

    const weekly = trends?.weekly ?? {};
    const { topSpecies, topLocation, topTime } = useMemo(() => {
        const speciesCount = {};
        const locationCount = {};
        const timeCount = {};

        reports.forEach((r) => {
            // Species
            if (r.species) {
                speciesCount[r.species] = (speciesCount[r.species] || 0) + 1;
            }

            // Location (FIXED)
            if (r.waterbodyId) {
                locationCount[r.waterbodyId] =
                    (locationCount[r.waterbodyId] || 0) + 1;
            }

            // Time bucket (FIXED from createdAt)
            if (r.createdAt) {
                const hour = new Date(r.createdAt).getHours();
                const label =
                    hour < 6 ? "Night" :
                    hour < 12 ? "Morning" :
                    hour < 18 ? "Afternoon" :
                    "Evening";

                timeCount[label] = (timeCount[label] || 0) + 1;
            }
        });

        const getTop = (obj) =>
            Object.entries(obj)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        return {
            topSpecies: getTop(speciesCount),
            topLocation: getTop(locationCount),
            topTime: getTop(timeCount),
        };
    }, [reports]);


    return (
        <div className="page-shell">
            <section className="page-hero">
                <div>
                    <p className="eyebrow">COMMUNITY DATA</p>
                    <h1 className="page-title">Catch Reports & Trends</h1>
                    <p className="page-subtitle">
                        Review recent angler-submitted catches and identify patterns that
                        help users understand what is being caught and where activity is rising.
                    </p>
                </div>
                <div className="status-pill info">Community Reports Live</div>
            </section>

            <section className="content-grid two-col">
                <div className="content-card">
                    <div className="card-header">
                        <h3>Recent Catch Reports</h3>
                        <span className="card-badge">Latest Entries</span>
                    </div>

                    <div className="stack-list">
                        {!loading && reports.length === 0 && (
                            <div className="empty-state">
                                No catch reports yet.
                            </div>
                        )}
                        {reports.map((report) => (
                            <div key={report.id} className="list-card">
                                <div className="list-card-top">
                                    <h4>{report.species}</h4>
                                    <div>
                                        <span className="username">
                                            {report.user?.displayName || "Unknown"}
                                        </span>
                                    </div>
                                </div>
                                <div className="report-grid">
                                    <p><span>Location</span><strong>
                                        {waterbodies.find(w => w.id === report.waterbodyId)?.name || "Unknown"}
                                    </strong></p>
                                    <p><span>Method</span><strong>{report.method}</strong></p>
                                    <p><span>Notes</span><strong>{report.notes}</strong></p>
                                </div>
                                {canManage && (
                                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                                        {canDelete && (
                                            <button onClick={() => handleDelete(report.id)}>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h3>Trend Highlights</h3>
                        <span className="card-badge soft">Weekly Snapshot</span>
                    </div>

                    <div className="stack-list">
                        <div className="trend-card">
                            <p className="trend-label">Top Species this week</p>
                            <h4>{topSpecies || "No data"}</h4>
                            <p>Most frequently reported across active locations.</p>
                        </div>

                        <div className="trend-card">
                            <p className="trend-label">Most Active Location</p>
                            <h4>
                                {waterbodies.find(w => w.id === topLocation)?.name || "No data"}
                            </h4>
                            <p>Highest recent report volume in the sample data.</p>
                        </div>

                        <div className="trend-card">
                            <p className="trend-label">Best reported time</p>
                            <h4>{topTime || "No data"}</h4>
                            <p>Most successful reports were submitted before 10 AM.</p>
                        </div>
                    </div>
                </div>
            </section>

            {!showModal && (
                <button
                    className="fab-button"
                    style={{ background: "#1f4f91", color: "white" }}
                    onClick={() => setShowModal(true)}
                >
                    +
                </button>
            )}

            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>

                        <h3>Add Catch</h3>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="field">
                                <label>Waterbody</label>
                                <select
                                    value={selectedWaterbodyId}
                                    onChange={(e) => setSelectedWaterbodyId(e.target.value)}
                                >
                                    {waterbodies.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label>Species</label>
                                <input
                                    value={form.species}
                                    onChange={(e) =>
                                        setForm({ ...form, species: e.target.value })
                                    }
                                    placeholder="e.g. Bass"
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>Method</label>
                                <input
                                    value={form.method}
                                    onChange={(e) =>
                                        setForm({ ...form, method: e.target.value })
                                    }
                                    placeholder="e.g. Spinnerbait"
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>Notes</label>
                                <textarea
                                    value={form.notes}
                                    onChange={(e) =>
                                        setForm({ ...form, notes: e.target.value })
                                    }
                                    placeholder="Optional notes..."
                                    rows={3}
                                />
                            </div>

                            <div className="field">
                                <label>Visibility</label>
                                <select
                                    value={form.visibility}
                                    onChange={(e) =>
                                        setForm({ ...form, visibility: e.target.value })
                                    }
                                >
                                    <option value="PUBLIC">Public</option>
                                    <option value="PRIVATE">Private</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>

                                <button type="submit">
                                    Submit Catch
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            <section className="content-card summary-card">
                <div className="card-header">
                    <h3>Product Value</h3>
                    <span className="card-badge">Insights</span>
                </div>
                <p>
                    Catch reports give the platform a community-driven layer that goes beyond
                    static regulations or weather alone. By surfacing recent catches and simple
                    trend summaries, CastTrack gives users a more practical idea of real fishing
                    activity in nearby locations.
                </p>
            </section>
        </div>
    );
}