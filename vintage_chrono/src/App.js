import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main container component for VintageChrono (PastBlast)
 * Implements a vintage newspaper aesthetic with interactive feature placeholders.
 */
function App() {
  // State placeholders (can be expanded when implementing actual functionality)
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

  // Render loading overlay animation
  const renderLoading = () => (
    <div className="vintage-loading">
      <div className="quill"></div>
      <div className="parchment-sheet"></div>
    </div>
  );

  // Render main content
  return (
    <div className="vc-app">
      <div className="vc-parchment-bg">
        <header className="vc-header">
          <div className="vc-logo-area">
            <span className="vc-logo-title">PastBlast</span>
            <span className="vc-logo-sub">VintageChrono</span>
          </div>
          <div className="vc-header-controls">
            <button
              className={`vc-sound-toggle${vintageSound ? ' on' : ''}`}
              aria-pressed={vintageSound}
              onClick={handleVintageSoundToggle}
              title="Toggle Vintage Sound"
            >
              <span role="img" aria-label="phonograph">🎶</span>
              {vintageSound ? 'On' : 'Off'}
            </button>
          </div>
        </header>
        <main className="vc-main">
          <div className="vc-top-controls">
            <div className="vc-date-picker">
              <label>
                <span className="vc-picker-label">Date: </span>
                {/* Rotary/Brass Picker Sim: standard date picker as placeholder */}
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="vc-picker-input"
                  aria-label="Select date"
                  style={{ fontFamily: '"EB Garamond",serif', background: 'transparent'}}
                />
              </label>
            </div>
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
            <div className="vc-random-area">
              <button
                className="vc-btn-wax"
                onClick={handleRandomYear}
              >
                🎲 Random Year
              </button>
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
          <div className="vc-content-area">
            <div className="vc-event-feed">
              {/* Placeholder for event cards */}
              <h2 className="vc-section-heading">On This Day: Historical Events</h2>
              <div className="vc-clipping-cards">
                {[...Array(5)].map((_, i) => (
                  <div className="vc-newspaper-card" key={i}>
                    <div className="vc-news-headline">Event #{i + 1} - Placeholder headline</div>
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
            <aside className="vc-nyt-aside">
              <h3 className="vc-nyt-headline-title">NYT Headlines ({selectedDate.split('-')[1]}/{selectedDate.split('-')[0]})</h3>
              <ul className="vc-nyt-headlines">
                {[...Array(2)].map((_, i) => (
                  <li className="vc-nyt-card" key={i}>
                    <div className="vc-nyt-title">Sample NYT Headline #{i + 1}</div>
                    <div className="vc-nyt-img-thumb"></div>
                    <a className="vc-nyt-link" href="#" rel="noopener noreferrer">
                      Read original
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </main>
        {loading && renderLoading()}
        <footer className="vc-footer">
          <div>
            <span className="vc-footer-brand">VintageChrono © {new Date().getFullYear()} | PastBlast</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
