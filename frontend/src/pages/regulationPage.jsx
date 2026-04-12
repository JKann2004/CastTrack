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
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=auto`
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

    return (
        <div className="page-shell">
            <section className="page-hero">
                <div>
                    <p className="eyebrow">LIVE CONDITIONS</p>
                    <h1 className="page-title">Waterbody & Weather</h1>
                    <p className="page-subtitle">
                        Search any supported location and view current weather conditions.
                    </p>
                </div>
            </section>

            <LocationSearch onSelectLocation={setSelectedLocation} />

            {selectedLocation && (
                <div className="content-card">
                    <h3>
                        Selected Location: {selectedLocation.name}
                        {selectedLocation.admin1 ? `, ${selectedLocation.admin1}` : ""}
                    </h3>
                    <p>
                        Lat: {selectedLocation.latitude}, Lon: {selectedLocation.longitude}
                    </p>
                </div>
            )}

            {loading && <div className="content-card"><p>Loading live weather...</p></div>}
            {error && <div className="content-card"><p>{error}</p></div>}

            {weather && (
                <section className="content-grid two-col">
                    <div className="content-card">
                        <h3>Current Weather</h3>
                        <div className="stats-grid">
                            <div className="stat-tile">
                                <span>Temperature</span>
                                <strong>{weather.temperature_2m}°</strong>
                            </div>
                            <div className="stat-tile">
                                <span>Humidity</span>
                                <strong>{weather.relative_humidity_2m}%</strong>
                            </div>
                            <div className="stat-tile">
                                <span>Wind Speed</span>
                                <strong>{weather.wind_speed_10m}</strong>
                            </div>
                            <div className="stat-tile">
                                <span>Precipitation</span>
                                <strong>{weather.precipitation}</strong>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}