import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const ADVISORY_CATEGORIES = new Set([
    "ALGAL_BLOOM",
    "SEASONAL_CLOSURE",
    "ACCESS_RESTRICTION",
]);

const CATEGORIES = [
    "ALGAL_BLOOM",
    "FREE_FISHING_DAY",
    "TOURNAMENT",
    "SEASONAL_CLOSURE",
    "ACCESS_RESTRICTION",
];

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export default function EventPage() {
    const { role, user } = useAuth();
    const canManage = role === "ADMIN" || role === "MODERATOR";
    const canDelete = role === "ADMIN";

    const [events, setEvents] = useState([]);
    const [waterbodies, setWaterbodies] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const emptyForm = {
        title: "",
        description: "",
        category: "TOURNAMENT",
        waterbodyId: "",
        startDate: "",
        endDate: "",
        sourceUrl: "",
    };

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        loadAll();
    }, []);

    async function loadAll() {
        const [evRes, wbRes] = await Promise.allSettled([
            api.get("/events"),
            api.get("/waterbodies"),
        ]);

        if (evRes.status === "fulfilled") {
            setEvents(evRes.value?.data || []);
        }

        if (wbRes.status === "fulfilled") {
            const list = Array.isArray(wbRes.value)
                ? wbRes.value
                : wbRes.value?.data || [];
            setWaterbodies(list);
        }
    }

    function openCreate() {
        setEditingId(null);
        setForm(emptyForm);
        setShowModal(true);
    }

    function openEdit(event) {
        setEditingId(event.id);
        setForm({
            title: event.title,
            description: event.description,
            category: event.category,
            waterbodyId: event.waterbodyId || "",
            startDate: event.startDate?.slice(0, 10) || "",
            endDate: event.endDate?.slice(0, 10) || "",
            sourceUrl: event.sourceUrl || "",
        });
        setShowModal(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const payload = {
                title: form.title,
                description: form.description,
                category: form.category,
                startDate: new Date(form.startDate).toISOString(),
                endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
                waterbodyId: form.waterbodyId || undefined,
                sourceUrl: form.sourceUrl || undefined,
                createdBy: user?.id
            };

            if (editingId) {
                await api.patch(`/events/${editingId}`, payload);
            } else {
                await api.post("/events", payload);
            }

            setShowModal(false);
            setForm(emptyForm);
            setEditingId(null);
            await loadAll();

        } catch (err) {
            console.error("CREATE/UPDATE ERROR:", err);
            alert(err?.response?.data?.message || err.message);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this event?")) return;

        try {
            await api.delete(`/events/${id}`);
            await loadAll();
        } catch (err) {
            console.error("❌ DELETE ERROR:", err.message);
            alert(err.message);
        }
    }

    const advisories = events.filter((e) =>
        ADVISORY_CATEGORIES.has(e.category)
    );

    const upcoming = events.filter((e) =>
        !ADVISORY_CATEGORIES.has(e.category)
    );

    return (
        <div className="page-shell">

            <section className="page-hero">
                <div>
                    <p className="eyebrow">AWARENESS CENTER</p>
                    <h1 className="page-title">Events & Advisories</h1>
                </div>
            </section>

            <section className="content-grid two-col">

                {/* ADVISORIES */}
                <div className="content-card">
                    <h3>Active Advisories</h3>

                    <div className="stack-list">
                        {advisories.map((e) => (
                            <div key={e.id} className="list-card">

                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div className="event-title">{e.title}</div>
                                    <div className="mini-date">{formatDate(e.startDate)}</div>
                                </div>

                                {e.waterbodyId && (
                                    <div className="list-meta" style={{ color: "#1f4f91" }}>
                                        {waterbodies.find(w => w.id === e.waterbodyId)?.name}
                                    </div>
                                )}

                                <div className="event-desc">{e.description}</div>

                                {canManage && (
                                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                                        <button onClick={() => openEdit(e)}>Edit</button>

                                        {canDelete && (
                                            <button onClick={() => handleDelete(e.id)}>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* UPCOMING */}
                <div className="content-card">
                    <h3>Upcoming Events</h3>

                    <div className="stack-list">
                        {upcoming.map((e) => (
                            <div key={e.id} className="list-card">

                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div className="event-title">{e.title}</div>
                                    <div className="mini-date">{formatDate(e.startDate)}</div>
                                </div>

                                {e.waterbodyId && (
                                    <div className="list-meta" style={{ color: "#1f4f91" }}>
                                        {waterbodies.find(w => w.id === e.waterbodyId)?.name}
                                    </div>
                                )}

                                <div className="event-desc">{e.description}</div>

                                {canManage && (
                                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                                        <button onClick={() => openEdit(e)}>Edit</button>

                                        {canDelete && (
                                            <button onClick={() => handleDelete(e.id)}>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAB */}
            {canManage && (
                <button
                    className="fab-button"
                    style={{ background: "#1f4f91", color: "white" }}
                    onClick={openCreate}
                >
                    +
                </button>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal-card clean-modal" onClick={(e) => e.stopPropagation()}>

                        <h2>{editingId ? "Edit Event" : "Create Event"}</h2>

                        <form onSubmit={handleSubmit} className="modal-form">

                            <div className="field">
                                <label>Title</label>
                                <input
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm({ ...form, title: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>Description</label>
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({ ...form, category: e.target.value })
                                    }
                                    required
                                >
                                    {CATEGORIES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label>Location</label>
                                <select
                                    value={form.waterbodyId}
                                    onChange={(e) =>
                                        setForm({ ...form, waterbodyId: e.target.value })
                                    }
                                >
                                    <option value="">None</option>
                                    {waterbodies.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={form.startDate}
                                    onChange={(e) =>
                                        setForm({ ...form, startDate: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={form.endDate}
                                    onChange={(e) =>
                                        setForm({ ...form, endDate: e.target.value })
                                    }
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>

                                <button type="submit" className="btn-primary" style={{ background: "#1f4f91", color: "white" }}>
                                    {editingId ? "Update" : "Create"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
            <section className="content-card summary-card">
                <div className="card-header">
                    <h3>Why This Page Matters</h3>
                    <span className="card-badge">Planning Support</span>
                </div>
                <p>
                    This page combines helpful trip-planning information with public safety
                    context. Instead of requiring anglers to search multiple websites for
                    warnings, local events, or environmental notices, CastTrack brings that
                    information into one organized view.
                </p>
            </section>
        </div>
    );
}