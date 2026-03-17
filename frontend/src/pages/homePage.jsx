import React from "react";
import { Link } from "react-router-dom"
import "../style.css";

export default function HomePage() {
  return (
    <div className="home">
      <div className="top-section">
        <div className="info-card">
          <h2>Weather</h2>
          <p>Temperature | Wind Speed</p>
        </div>

        <div className="info-card">
          <h2>Waterbody</h2>
          <p>Waterbody info</p>
        </div>
      </div>
      <div className="dashboard">
        <Link to="/regulationPage" className="card">
        <h3>Fishing Regulations</h3>
        <p>View bag limits, possession limits, seasonal limits or general fishing rules.</p>
        </Link>

        <Link to="/catchPage" className="card">
        <h3>Catch Trends</h3>
        <p>See what fishes the community is catching.</p>
        </Link>

        <Link to="/eventPage" className="card">
        <h3>Events / Advisories</h3>
        <p>View current events or safety warnings.</p>
        </Link>

      </div>
    </div>
  );
}