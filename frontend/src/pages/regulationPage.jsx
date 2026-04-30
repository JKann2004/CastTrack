import React,{ useEffect,useState } from "react";
import LocationSearch from "../components/LocationSearch";

export default function RegulationPage() {
    const [selectedLocation,setSelectedLocation] = useState(null);
    const [weather,setWeather] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");

    useEffect(() => {
        if (!selectedLocation) return;

        async function fetchWeather() {
            try {
                setLoading(true);
                setError("");

                const { latitude,longitude } = selectedLocation;

                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&temperature_unit=fahrenheit&timezone=auto`
                );

                if (!res.ok) throw new Error("Weather request failed");

                const data = await res.json();
                setWeather(data.current);
            } catch (err) {
                console.error(err);
                setError("Unable to load live weather for this location.");
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    },[selectedLocation]);

    function getWeatherSummary(code) {
        if (code === 0) return { icon: "☀️",label: "Clear Sky" };
        if ([1,2,3].includes(code)) return { icon: "⛅",label: "Partly Cloudy" };
        if ([45,48].includes(code)) return { icon: "🌫️",label: "Foggy" };
        if ([51,53,55,61,63,65,80,81,82].includes(code)) return { icon: "🌧️",label: "Rain Nearby" };
        if ([71,73,75,77,85,86].includes(code)) return { icon: "❄️",label: "Snowy" };
        if ([95,96,99].includes(code)) return { icon: "⛈️",label: "Storm Risk" };
        return { icon: "🌤️",label: "Live Weather" };
    }

    function getFishingRating() {
        if (!weather) return "Waiting for data";

        const temp = weather.temperature_2m;
        const wind = weather.wind_speed_10m;
        const rain = weather.precipitation;

        if (wind <= 8 && temp >= 55 && temp <= 80 && rain === 0) {
            return "Good Conditions";
        }

        if (wind > 15 || rain > 0) {
            return "Use Caution";
        }

        return "Fair Conditions";
    }

    function getFishingNote() {
        if (!weather) {
            return "Search for a waterbody to view live condition details.";
        }

        const wind = weather.wind_speed_10m;
        const temp = weather.temperature_2m;
        const rain = weather.precipitation;

        if (rain > 0) {
            return "Rain may affect visibility, comfort, and shoreline access. Check local advisories before heading out.";
        }

        if (wind > 15) {
            return "Wind speed is elevated, so boating and casting may be more difficult than usual.";
        }

        if (temp >= 55 && temp <= 80 && wind <= 8) {
            return "Conditions look comfortable for fishing, with manageable wind and a solid temperature range.";
        }

        return "Conditions are usable, but it may be worth checking wind, temperature, and local waterbody updates before leaving.";
    }

    const weatherSummary = weather ? getWeatherSummary(weather.weather_code) : null;
    const fishingRating = getFishingRating();

    return (
        <div className="page-shell weather-page">
            <section className="page-hero weather-hero">
                <div>
                    <p className="eyebrow">LIVE CONDITIONS</p>
                    <h1 className="page-title">Waterbody & Weather</h1>
                    <p className="page-subtitle">
                        Search a fishing location and view live weather details, wind conditions,
                        precipitation, and a quick fishing-readiness summary.
                    </p>
                </div>

                <div className="status-pill info">
                    Live API Enabled
                </div>
            </section>

            <section className="feature-banner weather-feature-banner">
                <div>
                    <p className="feature-label">Plan Before You Cast</p>
                    <h2>Check conditions before heading to the water</h2>
                    <p>
                        CastTrack uses live weather data to help anglers quickly understand
                        whether the current conditions are comfortable, risky, or worth monitoring.
                    </p>
                </div>

                <div className="banner-metrics">
                    <div className="metric-box">
                        <span>Data Type</span>
                        <strong>Live Weather</strong>
                    </div>
                    <div className="metric-box">
                        <span>Use Case</span>
                        <strong>Fishing Prep</strong>
                    </div>
                </div>
            </section>

            <section className="content-card search-panel">
                <div className="card-header">
                    <div>
                        <h3>Search Waterbody</h3>
                        <p className="search-helper">
                            Try searching for a lake, dam, reservoir, or nearby fishing area.
                        </p>
                    </div>
                    <span className="card-badge">Location Lookup</span>
                </div>

                <LocationSearch onSelectLocation={setSelectedLocation} />
            </section>

            {selectedLocation && (
                <section className="content-card selected-location-card">
                    <div>
                        <p className="feature-label">Selected Location</p>
                        <h3>
                            {selectedLocation.name}
                            {selectedLocation.admin1 ? `, ${selectedLocation.admin1}` : ""}
                        </h3>
                        <p>
                            Lat: {selectedLocation.latitude}, Lon: {selectedLocation.longitude}
                        </p>
                    </div>

                    <div className="location-mini-card">
                        <span>Location Status</span>
                        <strong>Ready</strong>
                    </div>
                </section>
            )}

            {loading && (
                <div className="content-card loading-card">
                    <p>Loading live weather...</p>
                </div>
            )}

            {error && (
                <div className="content-card error-card">
                    <p>{error}</p>
                </div>
            )}

            {weather && (
                <>
                    <section className="weather-overview-card">
                        <div className="weather-main-reading">
                            <div className="weather-icon-large">
                                {weatherSummary.icon}
                            </div>
                            <div>
                                <p className="feature-label">Current Conditions</p>
                                <h2>{weather.temperature_2m}°F</h2>
                                <p>{weatherSummary.label}</p>
                            </div>
                        </div>

                        <div className="weather-rating-box">
                            <span>Fishing Rating</span>
                            <strong>{fishingRating}</strong>
                            <p>{getFishingNote()}</p>
                        </div>
                    </section>

                    <section className="content-grid two-col">
                        <div className="content-card">
                            <div className="card-header">
                                <h3>Current Weather</h3>
                                <span className="card-badge good-badge">Live</span>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-tile weather-stat-tile">
                                    <span>Temperature</span>
                                    <strong>{weather.temperature_2m}°F</strong>
                                </div>
                                <div className="stat-tile weather-stat-tile">
                                    <span>Humidity</span>
                                    <strong>{weather.relative_humidity_2m}%</strong>
                                </div>
                                <div className="stat-tile weather-stat-tile">
                                    <span>Wind Speed</span>
                                    <strong>{weather.wind_speed_10m} mph</strong>
                                </div>
                                <div className="stat-tile weather-stat-tile">
                                    <span>Precipitation</span>
                                    <strong>{weather.precipitation}%</strong>
                                </div>
                            </div>
                        </div>

                        <div className="content-card">
                            <div className="card-header">
                                <h3>Fishing Conditions</h3>
                                <span className="card-badge soft">Auto Summary</span>
                            </div>

                            <div className="detail-list">
                                <div className="detail-row">
                                    <span>Wind Impact</span>
                                    <strong>
                                        {weather.wind_speed_10m <= 8
                                            ? "Calm"
                                            : weather.wind_speed_10m <= 15
                                                ? "Moderate"
                                                : "High"}
                                    </strong>
                                </div>

                                <div className="detail-row">
                                    <span>Comfort Level</span>
                                    <strong>
                                        {weather.temperature_2m >= 55 && weather.temperature_2m <= 80
                                            ? "Comfortable"
                                            : "Check Temperature"}
                                    </strong>
                                </div>

                                <div className="detail-row">
                                    <span>Rain Impact</span>
                                    <strong>
                                        {weather.precipitation > 0 ? "Possible Rain" : "Clear"}
                                    </strong>
                                </div>

                                <div className="detail-row">
                                    <span>Overall</span>
                                    <strong>{fishingRating}</strong>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="content-grid two-col">
                        <div className="content-card">
                            <div className="card-header">
                                <h3>Today’s Quick Tips</h3>
                                <span className="card-badge">Guide</span>
                            </div>

                            <div className="stack-list">
                                <div className="list-card">
                                    <h4>Check wind before boating</h4>
                                    <p>
                                        Wind speed can affect casting accuracy, small boat safety,
                                        and how comfortable the waterbody feels.
                                    </p>
                                </div>

                                <div className="list-card">
                                    <h4>Watch precipitation</h4>
                                    <p>
                                        Rain can change shoreline conditions and visibility. If rain
                                        is showing, check local advisories before traveling.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="content-card">
                            <div className="card-header">
                                <h3>Condition Snapshot</h3>
                                <span className="card-badge soft">Summary</span>
                            </div>

                            <p className="condition-summary">
                                This location currently has a temperature of{" "}
                                <strong>{weather.temperature_2m}°F</strong>, humidity at{" "}
                                <strong>{weather.relative_humidity_2m}%</strong>, wind speed around{" "}
                                <strong>{weather.wind_speed_10m} mph</strong>, and precipitation at{" "}
                                <strong>{weather.precipitation}%</strong>.
                            </p>
                        </div>
                    </section>
                </>
            )}

            {!selectedLocation && !weather && (
                <section className="empty-state-card">
                    <div className="empty-icon">🎣</div>
                    <h3>Search for a waterbody to get started</h3>
                    <p>
                        Once you select a location, live weather and fishing condition
                        summaries will appear here.
                    </p>
                </section>
            )}
        </div>
    );
}