import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main container component for PastBlast (VintageChrono)
 * Responsive, accessible, and styled in classic newspaper/vintage theme.
 * All features are included as interactive skeletons ready for API wiring.
 */
function App() {
  // STATE for all major interactive elements
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [vintageSound, setVintageSound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myBirthYear, setMyBirthYear] = useState('');
  const [randomYear, setRandomYear] = useState(null);

  // PUBLIC_INTERFACE
  function handleDateChange(e) {
    setSelectedDate(e.target.value);
    setLoading(true);
    setTimeout(() => setLoading(false), 800); // Simulated loading
  }

  // PUBLIC_INTERFACE
  function handleTimelineChange(e) {
    // Year only slider
    const date = new Date(selectedDate);
    const newYear = Number(e.target.value);
    setSelectedDate(`${newYear}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }

  // PUBLIC_INTERFACE
  function handleRandomYear() {
    const minYear = 1851; // Example: NYT founded
    const maxYear = new Date().getFullYear();
    const randYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
    const date = new Date(selectedDate);
    setSelectedDate(`${randYear}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
    setRandomYear(randYear);
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  }

  // PUBLIC_INTERFACE
  function handleBirthYearChange(e) {
    setMyBirthYear(e.target.value);
    // Could trigger info fetch for birth year
  }

  // PUBLIC_INTERFACE
  function handleVintageSoundToggle() {
    setVintageSound(v => !v);
  }

  // Loading Overlay Animation (Quill & Parchment)
  const renderLoading = () => (
    <div className="vintage-loading" aria-live="polite" aria-label="Loading">
      <div className="quill" title="Vintage quill animation"></div>
      <div className="parchment-sheet" title="Parchment animation"></div>
    </div>
  );

  // Render PastBlast App top-to-bottom
  return (
    <div className="vc-app">
      <div className="vc-parchment-bg">
        {/* HEADER */}
        <header className="vc-header" role="banner">
          <div className="vc-logo-area">
            <span className="vc-logo-title" style={{fontFamily: "'Cormorant Garamond', 'Playfair Display', serif"}}>
              PastBlast
            </span>
            <span className="vc-logo-sub" style={{fontFamily: "'Special Elite', serif"}}>VintageChrono</span>
          </div>
          <div className="vc-header-controls">
            <button
              className={`vc-sound-toggle${vintageSound ? ' on' : ''}`}
              aria-pressed={vintageSound}
              onClick={handleVintageSoundToggle}
              title="Toggle Vintage Sound"
              tabIndex="0"
            >
              <span role="img" aria-label="phonograph">🎶</span>
              {vintageSound ? 'On' : 'Off'}
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="vc-main">
          {/* Top Controls Row */}
          <div className="vc-top-controls" role="region" aria-label="Date selection and tools">
            {/* Brass/Rotary Date Picker */}
            <div className="vc-date-picker">
              <label>
                <span className="vc-picker-label">Date: </span>
                {/* Custom rotary could use <select>s, here basic styled date for accessibility */}
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="vc-picker-input"
                  aria-label="Select date"
                  style={{ fontFamily: "'EB Garamond', serif", background: 'transparent'}}
                />
              </label>
            </div>
            {/* Pocket-Watch Timeline Slider */}
            <div className="vc-timeline-slider">
              <span className="vc-slider-label">Timeline: </span>
              <input
                type="range"
                min="1851"
                max={new Date().getFullYear()}
                value={selectedDate.split('-')[0]}
                onChange={handleTimelineChange}
                className="vc-timeline-input"
                aria-label="Timeline year"
                style={{ width: 160 }}
              />
              <span className="vc-slider-year">{selectedDate.split('-')[0]}</span>
            </div>
            {/* Wax Seal Buttons: Random Year, My Birth Year input */}
            <div className="vc-random-area">
              <button
                className="vc-btn-wax"
                onClick={handleRandomYear}
                aria-label="Jump to random history year"
                tabIndex="0"
              >
                🎲 Random Year
              </button>
              {/* Pocket Paper for user's birth year */}
              <span className="vc-birthyear">
                <label>
                  📜
                  <input
                    type="date"
                    value={myBirthYear}
                    onChange={handleBirthYearChange}
                    className="vc-birthyear-input"
                    aria-label="Select your Birth Year"
                    max={new Date().toISOString().substring(0, 10)}
                  />
                  <span className="vc-birthyear-text">My Birth Year</span>
                </label>
              </span>
            </div>
          </div>

          {/* Newspaper Content Areas: Main feed and NYT aside */}
          <div className="vc-content-area" role="main">
            {/* Main Event Clipping Cards */}
            <div className="vc-event-feed" aria-label="Historical Event Feed">
              <h2 className="vc-section-heading">On This Day: Historical Events</h2>
              <div className="vc-clipping-cards">
                {/* Event placeholders, easily mapped from API */}
                {[...Array(5)].map((_, i) => (
                  <div className="vc-newspaper-card" key={i} tabIndex="0" aria-label={`Historical event placeholder ${i+1}`}>
                    <div className="vc-news-headline">
                      Event #{i + 1} - Placeholder headline
                    </div>
                    <div className="vc-news-text">
                      Brief description of a notable event for {selectedDate}...
                    </div>
                    <div className="vc-news-source">
                      <span>Source: Wikipedia</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* NYT Headlines Aside */}
            <aside className="vc-nyt-aside" aria-label="New York Times Headlines">
              <h3 className="vc-nyt-headline-title">
                NYT Headlines ({selectedDate.split('-')[1]}/{selectedDate.split('-')[0]})
              </h3>
              <ul className="vc-nyt-headlines">
                {[...Array(2)].map((_, i) => (
                  <li className="vc-nyt-card" key={i}>
                    <div className="vc-nyt-title">Sample NYT Headline #{i + 1}</div>
                    <div className="vc-nyt-img-thumb" alt="NYT archive preview"></div>
                    <a className="vc-nyt-link" href="#" tabIndex="0" rel="noopener noreferrer">
                      Read original
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </main>

        {/* Loading overlay */}
        {loading && renderLoading()}

        {/* FOOTER */}
        <footer className="vc-footer">
          <div>
            <span className="vc-footer-brand">
              VintageChrono © {new Date().getFullYear()} | PastBlast
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
