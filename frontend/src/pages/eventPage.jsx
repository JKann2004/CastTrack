import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import AddEvent from "../components/addEvent";

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
    const [editEvent, setEditEvent] = useState(null);

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
        setForm(emptyForm);
        setShowModal(true);
    }

    function openEdit(event) {
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
                                        <button onClick={() => setEditEvent(e)}>Edit</button>

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
                                        <button onClick={() => setEditEvent(e)}>Edit</button>

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
            <AddEvent
                canManage={canManage}
                waterbodies={waterbodies}
                user={user}
                onSuccess={() => {
                    loadAll();
                    setEditEvent(null);
                }}
                editEvent={editEvent}
            />
        </div>
    );
}