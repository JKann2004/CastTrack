import React, { useMemo, useState, useEffect } from "react";
import "../style.css";

function mapWeatherData(apiData) {
  const periods = apiData?.forecast?.periods || [];

  const current = periods[0] || {};

  return {
    temperature:
      current.temperature != null
        ? `${current.temperature}°F`
        : "N/A",

    wind: current.windSpeed || "N/A",

    precipitation:
      current.probabilityOfPrecipitation?.value != null
        ? `${current.probabilityOfPrecipitation.value}%`
        : "N/A",

    vision: "N/A",

    forecast: periods.slice(0, 5).map((p) => ({
      day: p.name,
      icon: mapIcon(p.shortForecast),
      hi: p.temperature,
      lo: (p.temperature ?? 0) - 10,
    })),

    alerts: (apiData?.alerts || []).map((a) => ({
      title: a?.properties?.headline || "Weather Alert",
      text: a?.properties?.description || "",
    })),
  };
}

function mapEvents(apiEvents) {
  return (apiEvents || []).map((e) => ({
    title: e.title,
    description: e.description,
    date: new Date(e.startDate).toLocaleDateString(),
    category: e.category,
  }));
}

function mapIcon(text) {
  if (!text) return "⛅";
  const t = text.toLowerCase();

  if (t.includes("rain")) return "🌧️";
  if (t.includes("cloud")) return "☁️";
  if (t.includes("sun") || t.includes("clear")) return "☀️";
  if (t.includes("storm")) return "⛈️";

  return "⛅";
}

const WATERBODIES = [
  {
    id: "26dfc947-4734-4783-ad62-f6105ad1961b", // this is big bear lake's id
    name: "Big Bear Lake",
    region: "San Bernardino County, CA",
    type: "Lake",
    activity: "High",
    imgClass: "lake-img",
    species: ["Rainbow Trout","Kokanee Salmon","Bass"],
    reports: 42,
    weather: { temperature: "62°F",wind: "22 mph",precipitation: "15%",vision: "10 mi" },
    alerts: [
      {
        title: "Wind Advisory",
        text: "Sustained winds expected this afternoon. Exercise caution on open water.",
      },
    ],
    forecast: [
      { day: "Today",icon: "⛅",hi: 62,lo: 48 },
      { day: "Sat",icon: "🌤️",hi: 68,lo: 50 },
      { day: "Sun",icon: "☀️",hi: 72,lo: 52 },
      { day: "Mon",icon: "🌧️",hi: 59,lo: 45 },
      { day: "Tue",icon: "🌦️",hi: 61,lo: 46 },
    ],
    events: [
      {
        title: "HAB Advisory — Emerald Bay",
        desc: "Avoid direct contact near affected shoreline areas.",
        date: "Apr 9, 2026",
        category: "Advisory",
      },
      {
        title: "Free Fishing Day",
        desc: "Fishing without a license on designated statewide date.",
        date: "Jul 4, 2026",
        category: "Event",
      },
    ],
    catches: [
      { species: "Rainbow Trout",method: "Spoon",user: "Anonymous",area: "South shore",time: "2 hrs ago" },
      { species: "Kokanee Salmon",method: "Trolling",user: "user_tahoe22",area: "East shore",time: "5 hrs ago" },
    ],
    trends: [
      { name: "Rainbow Trout",count: 42,pct: 90 },
      { name: "Kokanee",count: 28,pct: 60 },
      { name: "Bass",count: 16,pct: 35 },
    ],
  },
  {
    id: "528a8a3c-df22-4496-a0b3-bdede5e01841", // Santa Ana River ID
    name: "Santa Ana River",
    region: "Southern California",
    type: "River",
    activity: "Medium",
    imgClass: "river-img",
    species: ["Chinook Salmon","Steelhead","Striped Bass"],
    reports: 28,
    weather: { temperature: "58°F",wind: "14 mph",precipitation: "10%",vision: "9 mi" },
    alerts: [],
    forecast: [
      { day: "Today",icon: "🌤️",hi: 58,lo: 44 },
      { day: "Sat",icon: "☀️",hi: 65,lo: 46 },
      { day: "Sun",icon: "⛅",hi: 67,lo: 49 },
      { day: "Mon",icon: "🌧️",hi: 57,lo: 43 },
      { day: "Tue",icon: "🌤️",hi: 63,lo: 45 },
    ],
    events: [
      {
        title: "High Water Advisory",
        desc: "Flow levels elevated. Wade fishing may be hazardous.",
        date: "Apr 8, 2026",
        category: "Advisory",
      },
    ],
    catches: [
      { species: "Chinook Salmon",method: "Fly Fishing",user: "redding_angler",area: "Keswick pool",time: "3 hrs ago" },
      { species: "Steelhead",method: "Spinner",user: "Anonymous",area: "Milepost 14",time: "1 day ago" },
    ],
    trends: [
      { name: "Chinook",count: 19,pct: 90 },
      { name: "Steelhead",count: 12,pct: 60 },
      { name: "Striped Bass",count: 8,pct: 40 },
    ],
  },
  {
    id: "0c3827fb-a111-4da4-8ab5-79041f881fe4", // Diamond Valley Lake ID
    name: "Diamond Valley Lake",
    region: "Riverside County, CA",
    type: "Reservoir",
    activity: "High",
    imgClass: "reservoir-img",
    species: ["Bass","Trout","Catfish"],
    reports: 35,
    weather: { temperature: "64°F",wind: "9 mph",precipitation: "5%",vision: "10 mi" },
    alerts: [],
    forecast: [
      { day: "Today",icon: "☀️",hi: 64,lo: 49 },
      { day: "Sat",icon: "☀️",hi: 70,lo: 52 },
      { day: "Sun",icon: "🌤️",hi: 72,lo: 54 },
      { day: "Mon",icon: "🌦️",hi: 61,lo: 47 },
      { day: "Tue",icon: "☀️",hi: 68,lo: 50 },
    ],
    events: [
      {
        title: "Weekend Bass Tournament",
        desc: "Local tournament with restricted launch times in the morning.",
        date: "May 17, 2026",
        category: "Event",
      },
    ],
    catches: [
      { species: "Bass",method: "Crankbait",user: "bass_pro_99",area: "North arm",time: "4 hrs ago" },
      { species: "Trout",method: "PowerBait",user: "Anonymous",area: "Main body",time: "6 hrs ago" },
    ],
    trends: [
      { name: "Bass",count: 31,pct: 90 },
      { name: "Trout",count: 20,pct: 58 },
      { name: "Catfish",count: 11,pct: 32 },
    ],
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedWaterbody, setSelectedWaterbody] = useState(null);
  const [activeTab, setActiveTab] = useState("weather");
  const [favorites, setFavorites] = useState(["Lake Tahoe", "Sacramento River"]);

  const [weatherData, setWeatherData] = useState(null);
  const [events, setEvents] = useState();

  const filteredWaterbodies = useMemo(() => {
    return WATERBODIES.filter((w) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "ca" && w.region.includes("CA")) ||
        w.type.toLowerCase() === activeFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.region.toLowerCase().includes(q) ||
        w.type.toLowerCase().includes(q) ||
        w.species.some((s) => s.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  },[searchQuery,activeFilter]);

  function handleSearch() {
    if (filteredWaterbodies.length > 0) {
      setSelectedWaterbody(filteredWaterbodies[0]);
    }
  }

  function toggleFavorite(name) {
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev,name]
    );
  }

  async function openWaterbody(waterbody) {
    setSelectedWaterbody(waterbody);
    setActiveTab("weather");
    setWeatherData(null);
    setEvents([]);

    try {
      const [weatherRes, eventsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/weather/${waterbody.id}`),
        fetch(`http://localhost:3000/api/events?waterbodyid=${waterbody.id}`)
      ])

      const weatherData = await weatherRes.json();
      const eventsData = await eventsRes.json();

      setWeatherData(mapWeatherData(weatherData));
      setEvents(mapEvents(eventsData.data));
      console.log("RAW BACKEND RESPONSE(Event):", eventsData.data);
      console.log("RAW BACKEND RESPONSE(Weather):", weatherData.data);
    } catch (error) {
      console.error(error);
      setWeatherData(null);
      setEvents([]);
    }
  }

  const weather = weatherData;

  const forecast = weatherData?.forecast || [];

  const alerts = weatherData?.alerts || [];

  return (
    <div>
      <section className="hero">
        <h1>Plan your perfect fishing trip</h1>
        <p>
          Weather, advisories, and catch activity in one place for lakes, rivers,
          and reservoirs.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search a lake, river, or reservoir..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="filter-chips">
          {["all","lake","river","reservoir","ca"].map((filter) => (
            <button
              key={filter}
              className={`chip ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter === "all"
                ? "All types"
                : filter === "ca"
                  ? "California"
                  : `${filter.charAt(0).toUpperCase()}${filter.slice(1)}s`}
            </button>
          ))}
        </div>

        <div className="wave">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" fill="#f0f9ff">
            <path d="M0,40 C300,80 600,0 900,40 C1050,60 1150,20 1200,30 L1200,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      <div style={{ margin: "0 1.5rem" }}>
        <div className="alert-banner">
          <span>⚠️</span>
          <span style={{ flex: 1,fontSize: "13px" }}>
            <strong style={{ color: "#dc2626" }}>Harmful Algal Bloom Advisory:</strong>{" "}
            Clear Lake (CA) — Avoid water contact. See official advisory for details.
          </span>
        </div>
      </div>

      <div className="main">
        <div className="layout">
          <div>
            <h2>Popular fishing spots</h2>

            <div className="cards-grid">
              {filteredWaterbodies.map((w) => (
                <div key={w.id} onClick={() => openWaterbody(w)}>
                  {w.name}
                </div>
              ))}
            </div>

            {selectedWaterbody && (
              <div className="detail-panel">

                <div className="detail-header">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h2>{selectedWaterbody.name}</h2>
                      <p>{selectedWaterbody.region}</p>

                      <div className="detail-badge">
                        📍 <span>{selectedWaterbody.type}</span>
                        &nbsp;·&nbsp;
                        🐟 <span>{selectedWaterbody.activity} activity</span>
                      </div>
                    </div>

                    <button
                      className="fav-btn"
                      style={{ color: "white", fontSize: "1.4rem" }}
                      onClick={() => toggleFavorite(selectedWaterbody.name)}
                    >
                      {favorites.includes(selectedWaterbody.name) ? "★" : "☆"}
                    </button>
                  </div>
                </div>

                <div className="detail-tabs">
                  {["weather", "events", "catches", "trends"].map((tab) => (
                    <div
                      key={tab}
                      className={`dtab ${activeTab === tab ? "active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === "weather" && "🌤 Weather"}
                      {tab === "events" && "📋 Advisories"}
                      {tab === "catches" && "🎣 Catch Reports"}
                      {tab === "trends" && "📈 Trends"}
                    </div>
                  ))}
                </div>

                {/* WEATHER */}
                {activeTab === "weather" && (
                  <div className="tab-content active">

                    {alerts.length > 0 && (
                      <div className="wx-alert">
                        <span>⚠️</span>
                        <div>
                          <strong style={{ fontSize: "13px", color: "#991b1b" }}>
                            {alerts[0].title}
                          </strong>
                          {/* <br />
                          <span style={{ fontSize: "12px", color: "#7f1d1d" }}>
                            {alerts[0].text}
                          </span> */}
                        </div>
                      </div>
                    )}

                    <div className="wx-grid">
                      <div className="wx-card">
                        <div className="wx-icon">🌡️</div>
                        <div className="wx-val">{weather?.temperature}</div>
                        <div className="wx-label">Temperature</div>
                      </div>

                      <div className="wx-card">
                        <div className="wx-icon">💨</div>
                        <div className="wx-val">{weather?.wind}</div>
                        <div className="wx-label">Wind</div>
                      </div>

                      <div className="wx-card">
                        <div className="wx-icon">🌧️</div>
                        <div className="wx-val">{weather?.precipitation}</div>
                        <div className="wx-label">Precip chance</div>
                      </div>

                      <div className="wx-card">
                        <div className="wx-icon">👁️</div>
                        <div className="wx-val">{weather?.vision}</div>
                        <div className="wx-label">Visibility</div>
                      </div>
                    </div>

                    <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
                      5-day forecast
                    </p>

                    <div className="forecast-row">
                      {forecast.map((f) => (
                        <div key={f.day} className="forecast-cell">
                          <div className="fc-day">{f.day}</div>
                          <div className="fc-icon">{f.icon}</div>
                          <div className="fc-hi">{f.hi}°</div>
                          <div className="fc-lo">{f.lo}°</div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
                
                {activeTab === "events" && (
                  <div className="tab-content active">
                    <div className="event-list">
                      {events.length === 0 ? (
                        <p style={{ color: "var(--text3)",fontSize: "13px" }}>
                          No current advisories or events for this waterbody.
                        </p>
                      ) : (
                        events.map((event,index) => (
                          <div key={index} className="event-item">
                            <div className="event-dot dot-info"></div>
                            <div className="event-meta">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  marginBottom: "4px",
                                }}
                              >
                                <div className="event-title">{event.title}</div>
                                <span className="event-cat cat-event">{event.category}</span>
                              </div>
                              <div className="event-desc">{event.desc}</div>
                              <div className="event-footer">
                                <span className="event-date">📅 {event.date}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "catches" && (
                  <div className="tab-content active">
                    <div className="report-list">
                      {selectedWaterbody.catches.map((report,index) => (
                        <div key={index} className="report-item">
                          <span className="ri-species">🐟</span>
                          <div className="ri-meta">
                            <div className="ri-title">
                              {report.species} · {report.method}
                            </div>
                            <div className="ri-sub">
                              {report.user} · {report.area} · {report.time}
                            </div>
                          </div>
                          <span className="ri-badge">{report.species.split(" ")[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "trends" && (
                  <div className="tab-content active">
                    <div className="trend-grid">
                      <div className="trend-card">
                        <div className="trend-title">Top species</div>
                        <div className="bar-list">
                          {selectedWaterbody.trends.map((trend) => (
                            <div key={trend.name} className="bar-item">
                              <span className="bar-label">{trend.name}</span>
                              <div className="bar-track">
                                <div className="bar-fill" style={{ width: `${trend.pct}%` }}></div>
                              </div>
                              <span className="bar-count">{trend.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="trend-card">
                        <div className="trend-title">Quick summary</div>
                        <p style={{ fontSize: "13px",color: "var(--text2)" }}>
                          {selectedWaterbody.name} currently shows{" "}
                          <strong>{selectedWaterbody.activity.toLowerCase()}</strong> catch
                          activity, with <strong>{selectedWaterbody.reports}</strong> recent
                          reports and strong presence of{" "}
                          <strong>{selectedWaterbody.trends[0]?.name}</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="sidebar-card">
              <div className="sidebar-header">⭐ Saved spots</div>
              <div className="sidebar-body">
                <div className="fav-list">
                  {favorites.length === 0 ? (
                    <p style={{ fontSize: "12px",color: "var(--text3)" }}>
                      No saved spots yet.
                    </p>
                  ) : (
                    favorites.map((name) => {
                      const wb = WATERBODIES.find((item) => item.name === name);
                      return (
                        <div key={name} className="fav-item">
                          <div className="fav-dot"></div>
                          <span className="fav-name">{name}</span>
                          <span
                            className="fav-arrow"
                            onClick={() => wb && openWaterbody(wb)}
                          >
                            →
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <div className="sidebar-header">🌊 Quick conditions</div>
              <div className="sidebar-body">
                <div style={{ display: "flex",flexDirection: "column",gap: "8px" }}>
                  {WATERBODIES.slice(0,4).map((wb) => (
                    <div
                      key={wb.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px",
                        background: "var(--surface2)",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => openWaterbody(wb)}
                    >
                      <span style={{ fontSize: "13px" }}>{wb.name}</span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: wb.activity === "High" ? "var(--green)" : "#d97706",
                          fontWeight: 500,
                        }}
                      >
                        {wb.activity === "High" ? "Good ✓" : "Moderate"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}