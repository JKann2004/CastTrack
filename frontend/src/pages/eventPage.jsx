import React from "react";

export default function EventPage() {
    const userRole = localStorage.getItem("userRole");
    const canManageEvents = userRole === "ADMIN" || userRole === "MODERATOR";
    const canDeleteEvents = userRole === "ADMIN";
    const advisories = [
        {
            id: 1,
            title: "Algae Bloom Warning",
            severity: "High",
            location: "Castaic Lake",
            description:
                "Avoid direct water contact near affected shoreline areas due to potentially harmful algae activity.",
        },
        {
            id: 2,
            title: "Strong Wind Advisory",
            severity: "Moderate",
            location: "Silverwood Lake",
            description:
                "Afternoon gusts may affect small boats and reduce shoreline fishing comfort and safety.",
        },
    ];

    const events = [
        {
            id: 1,
            title: "California Free Fishing Day",
            date: "June 6, 2026",
            location: "Statewide",
            description:
                "Anglers may fish without a license during California's designated free fishing opportunity.",
        },
        {
            id: 2,
            title: "Weekend Bass Tournament",
            date: "June 14, 2026",
            location: "Lake Perris",
            description:
                "A local catch-and-release tournament focused on bass activity and community participation.",
        },
        {
            id: 3,
            title: "Youth Fishing Clinic",
            date: "June 21, 2026",
            location: "Big Bear Lake",
            description:
                "Beginner-focused event introducing young anglers to basic fishing skills and safety practices.",
        },
    ];

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
                <div className="status-pill warning">2 Active Advisories</div>
            </section>

            <section className="content-grid two-col">
                <div className="content-card">
                    <div className="card-header">
                        <h3>Active Advisories</h3>
                        <span className="card-badge warning-badge">Priority Alerts</span>
                    </div>

                    <div className="stack-list">
                        {advisories.map((advisory) => (
                            <div key={advisory.id} className="list-card advisory-card">
                                <div className="list-card-top">
                                    <h4>{advisory.title}</h4>
                                    <span
                                        className={`severity-tag ${advisory.severity === "High" ? "high" : "moderate"
                                            }`}
                                    >
                                        {advisory.severity}
                                    </span>
                                </div>
                                <p className="list-meta">{advisory.location}</p>
                                <p>{advisory.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="content-card">
                    {canManageEvents && (
                        <button onClick={() => { /* your create handler */ }}>+ Add Event</button>
                    )}
                    <div className="card-header">
                        <h3>Upcoming Events</h3>
                        <span className="card-badge soft">Community Calendar</span>
                    </div>

                    <div className="stack-list">
                        {events.map((event) => (
                            <div key={event.id} className="list-card">
                                {canManageEvents && (
                                    <button onClick={() => { /* your edit handler */ }}>Edit</button>
                                )}
                                {canDeleteEvents && (
                                    <button onClick={() => { /* your delete handler */ }}>Delete</button>
                                )}
                                <div className="list-card-top">
                                    <h4>{event.title}</h4>
                                    <span className="mini-date">{event.date}</span>
                                </div>
                                <p className="list-meta">{event.location}</p>
                                <p>{event.description}</p>
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
        </div>
    );
}