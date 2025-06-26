import { useState, useEffect } from 'react';
import './LocationBar.css';

export default function FilterLocation({ onZipCodes, clearTrigger }) {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    setCity('');
    setState('');
  }, [clearTrigger]);

  const handleSearch = async () => {
    try {
      const res = await fetch('/locations/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          city,
          states: [state],
          size: 100,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch locations: ${res.status}`);
      }
      const data = await res.json();
      console.log('HERE ARE LOCATIONS:', data);
      
      const zipCodes = data.results.map(loc => loc.zip_code);
      onZipCodes(zipCodes);

    } catch (err) {
      console.error('Error fetching ZIP codes:', err);
    }
  };

  return (
   <div className="location-filter">
    <label>Location:</label>
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="text"
        placeholder="State (e.g. WA)"
        value={state}
        maxLength={2}
        onChange={(e) => setState(e.target.value)}
      />
      <button onClick={handleSearch}>Search by Location</button>
    </div>
  );
}
