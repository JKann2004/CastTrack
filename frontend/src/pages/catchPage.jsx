import React from "react";

export default function CatchPage() {
    const reports = [
        {
            id: 1,
            species: "Largemouth Bass",
            location: "Lake Perris",
            bait: "Plastic Worm",
            size: "3.2 lbs",
            date: "April 7, 2026",
        },
        {
            id: 2,
            species: "Rainbow Trout",
            location: "Big Bear Lake",
            bait: "PowerBait",
            size: "2.1 lbs",
            date: "April 8, 2026",
        },
        {
            id: 3,
            species: "Channel Catfish",
            location: "Santa Ana River Lakes",
            bait: "Chicken Liver",
            size: "5.6 lbs",
            date: "April 9, 2026",
        },
    ];

    const trends = [
        {
            id: 1,
            label: "Top Species This Week",
            value: "Largemouth Bass",
            note: "Most frequently reported across active locations.",
        },
        {
            id: 2,
            label: "Most Active Location",
            value: "Lake Perris",
            note: "Highest recent report volume in the sample data.",
        },
        {
            id: 3,
            label: "Best Reported Time",
            value: "Early Morning",
            note: "Most successful reports were submitted before 10 AM.",
        },
    ];

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
                        {reports.map((report) => (
                            <div key={report.id} className="list-card">
                                <div className="list-card-top">
                                    <h4>{report.species}</h4>
                                    <span className="mini-date">{report.date}</span>
                                </div>
                                <div className="report-grid">
                                    <p><span>Location</span><strong>{report.location}</strong></p>
                                    <p><span>Bait</span><strong>{report.bait}</strong></p>
                                    <p><span>Size</span><strong>{report.size}</strong></p>
                                </div>
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
                        {trends.map((trend) => (
                            <div key={trend.id} className="trend-card">
                                <p className="trend-label">{trend.label}</p>
                                <h4>{trend.value}</h4>
                                <p>{trend.note}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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