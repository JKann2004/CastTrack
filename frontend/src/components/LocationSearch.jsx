import React,{ useState } from "react";

export default function LocationSearch({ onSelectLocation }) {
    const [query,setQuery] = useState("");
    const [results,setResults] = useState([]);
    const [loading,setLoading] = useState(false);

    async function searchLocations() {
        if (!query.trim()) return;

        try {
            setLoading(true);
            const res = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
            );
            const data = await res.json();
            setResults(data.results || []);
        } catch (err) {
            console.error("Location search failed:",err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="location-search">
            <div className="search-row">
                <input
                    type="text"
                    placeholder="Search lake, reservoir, city, or region..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={searchLocations}>Search</button>
            </div>

            {loading && <p>Searching locations...</p>}

            {!!results.length && (
                <div className="search-results">
                    {results.map((place) => (
                        <button
                            key={`${place.id}-${place.latitude}-${place.longitude}`}
                            className="search-result-item"
                            onClick={() =>
                                onSelectLocation({
                                    name: place.name,
                                    admin1: place.admin1,
                                    country: place.country,
                                    latitude: place.latitude,
                                    longitude: place.longitude,
                                })
                            }
                        >
                            {place.name}
                            {place.admin1 ? `, ${place.admin1}` : ""}
                            {place.country ? `, ${place.country}` : ""}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}