import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

export default function CatchPage() {
    const [waterbodies, setWaterbodies] = useState([]);
    const [selectedWaterbodyId, setSelectedWaterbodyId] = useState("");
    const [reports, setReports] = useState([]);
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Submission form state
    const [species, setSpecies] = useState("");
    const [method, setMethod] = useState("");
    const [notes, setNotes] = useState("");
    const [visibility, setVisibility] = useState("PUBLIC");
    const [submitting, setSubmitting] = useState(false);

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
        loadReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWaterbodyId]);

    async function loadReports() {
        setLoading(true);
        setError("");
        try {
            const [reportsRes, trendsRes] = await Promise.allSettled([
                api.get(`/catch-reports?waterbody_id=${selectedWaterbodyId}&limit=20`),
                api.get(`/catch-reports/trends?waterbody_id=${selectedWaterbodyId}`),
            ]);
            if (reportsRes.status === "fulfilled") {
                setReports(reportsRes.value?.data || []);
            }
            if (trendsRes.status === "fulfilled") {
                setTrends(trendsRes.value);
            }
        } catch (err) {
            setError(err.message || "Failed to load reports.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!selectedWaterbodyId || !species.trim() || !method.trim()) return;

        setSubmitting(true);
        try {
            await api.post("/catch-reports", {
                waterbodyId: selectedWaterbodyId,
                species: species.trim(),
                method: method.trim(),
                notes: notes.trim() || undefined,
                visibility,
            });
            setSpecies("");
            setMethod("");
            setNotes("");
            await loadReports();
            alert("Report submitted!");
        } catch (err) {
            console.error(err);
            alert(err.message || "Submission failed");
        } finally {
            setSubmitting(false);
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

    const topSpecies = trends?.weekly?.topSpecies || [];
    const topMethods = trends?.weekly?.topMethods || [];

    return (
        <div className="page-shell">
            <section className="page-hero">
                <div>
                    <p className="eyebrow">COMMUNITY DATA</p>
                    <h1 className="page-title">Catch Reports & Trends</h1>
                    <p className="page-subtitle">
                        Recent angler-submitted catches and the trends emerging across this
                        waterbody.
                    </p>
                </div>
                <div className="status-pill info">Community Reports Live</div>
            </section>

            {/* Waterbody selector */}
            <div className="content-card">
                <label style={{ fontSize: "13px", fontWeight: 600, marginRight: "8px" }}>
                    Waterbody:
                </label>
                <select
                    value={selectedWaterbodyId}
                    onChange={(e) => setSelectedWaterbodyId(e.target.value)}
                    style={{ padding: "6px 10px", borderRadius: "6px" }}
                >
                    {waterbodies.map((w) => (
          