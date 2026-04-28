import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const CATEGORIES = [
    "ALGAL_BLOOM",
    "FREE_FISHING_DAY",
    "TOURNAMENT",
    "SEASONAL_CLOSURE",
    "ACCESS_RESTRICTION",
];

const ADVISORY_CATEGORIES = new Set([
    "ALGAL_BLOOM",
    "SEASONAL_CLOSURE",
    "ACCESS_RESTRICTION",
]);

export default function EventPage() {
    const { role } = useAuth();
    const canManageEvents = role === "ADMIN" || role === "MODERATOR";
    const canDeleteEvents = role === "ADMIN";

    const [events, setEvents] = useState([]);
    const [waterbodies, setWaterbodies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
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
        setLoading(true);
        setError("");
        try {
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
        } catch (err) {
            setError(err.message || "Failed to load events.");
        } finally {
            setLoading(false);
        }
    }

    function startCreate() {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
    }

    function startEdit(event) {
        setEditingId(event.id);
        setForm({
            title: event.title,
            description: event.description,
            category: event.category,
            waterbodyId: event.waterbodyId || "",
            startDate: event.startDate ? event.startDate.slice(0, 10) : "",
            endDate: event.endDate ? event.endDate.slice(0, 10) : "",
            sourceUrl: event.sourceUrl || "",
        });
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const payload = {
                title: form.title,
                description: form.description,
                category: form.category,
                startDate: form.startDate,
                endDate: form.endDate || undefined,
                waterbodyId: form.waterbodyId || undefined,
                sourceUrl: form.sourceUrl || undefined,
            };
            if (editingId) {
                await api.patch(`/events/${editingId}`, payload);
                alert("Event updated.");
            } else {
                await api.post("/events", payload);
                alert("Event created.");
            }
            setShowForm(false);
            loadAll();
        } catch (err) {
            alert(err.message || "Save failed");
        }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this event?")) return;
        try {
            await api.delete(`/events/${id}`);
            loadAll();
        } catch (err) {
            alert(err.message || "Delete failed");
        }
    }

    const advisories = events.filter((e) => ADVISORY_CATEGORIES.has(e.category));
    const upcoming = events.filter((e) => !ADVISORY_CATEGORIES.has(e.category));

    return (
        <div className="page-shell">
            <section className="page-hero">
                <div>
                    <p className="eyebrow">AWARENESS CENTER</p>
                    <h1 className="page-title">Events & Advisories</h1>
                    <p className="page-subtitle">
                        Track upcoming fishing events alongside active safety notices and
                        environmental alerts that may affect trip planning.
                    </p>
                </div>
                <div className="status-pill warning">
                    {advisories.length} Active{" "}
                    {advisories.length === 1 ? "Advisory" : "Advisories"}
                </div>
            </section>

            {loading && <div className="content-card"><p>Loading...</p></div>}
            {error && <div className="content-card"><p style={{ color: "#dc2626" }}>{error}</p></div>}

            {/* Create/Edit form (admin/moderator only) */}
            {canManageEvents && showForm && (
                <form className="content-card" onSubmit={handleSubmit}>
                    <h3>{editingId ? "Edit event" : "Create event"}</h3>
                    <div style={{ display: "grid", gap: "8px" }}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            maxLength={200}
                        />
                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                            maxLength={2000}
                            rows={3}
                        />
                        <select
       