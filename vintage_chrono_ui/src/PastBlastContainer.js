import React from "react";

/**
 * PastBlastContainer - The main application container for VintageChrono (PastBlast).
 * Implements the vintage layout, header, and ALL interactive features:
 * Date Picker (rotary), Timeline Slider (pocket-watch), Historical Events Feed,
 * NYT Headlines, Random Year Button, My Birth Year, Vintage Sound Toggle, and Loading Animation.
 *
 * PUBLIC_INTERFACE
 */
const getDefaultDate = () => {
  const today = new Date();
  // Format: "YYYY-MM-DD"
  return today.toISOString().substring(0, 10);
};

// Years for timeline: 1900 - today
const EARLIEST_YEAR = 1900;
const LATEST_YEAR = new Date().getFullYear();

const PastBlastContainer = () => {
  // Main state: date and year selection
  const [selectedDate, setSelectedDate] = React.useState(getDefaultDate()); // YYYY-MM-DD
  const [selectedYear, setSelectedYear] = React.useState(LATEST_YEAR);

  // Vintage sound state
  const [soundOn, setSoundOn] = React.useState(true);

  // Birth year input
  const [birthYearInput, setBirthYearInput] = React.useState("");
  const [isBirthYearMode, setIsBirthYearMode] = React.useState(false);

  // Feature loading states
  const [loadingWiki, setLoadingWiki] = React.useState(false);
  const [loadingNYT, setLoadingNYT] = React.useState(false);

  // Data fetched
  const [events, setEvents] = React.useState([]);
  const [nytHeadlines, setNytHeadlines] = React.useState([]);
  const [nytError, setNytError] = React.useState("");

  // Derived: show global loading if any feature is loading
  const isLoading = loadingWiki || loadingNYT;

  // Compute selected year from date
  React.useEffect(() => {
    if (!isBirthYearMode) {
      setSelectedYear(Number(selectedDate.substring(0, 4)));
    }
  }, [selectedDate, isBirthYearMode]);

  // Wikipedia "On This Day" API fetch
  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoadingWiki(true);
      // Extract month and day
      let year = isBirthYearMode && birthYearInput ? Number(birthYearInput) : selectedYear;
      let dateForWiki = selectedDate.split("-");
      // API: https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/{month}/{day}
      let month = dateForWiki[1];
      let day = dateForWiki[2];
      try {
        const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
        const resp = await fetch(url);
        const json = await resp.json();
        let eventsList = Array.isArray(json.events)
          ? json.events.filter(evt => evt.year && evt.text).slice(0, 5)
          : [];
        // Prefer events <= (selectedYear)
        if (year && !isNaN(year)) {
          eventsList = eventsList.filter(evt => +evt.year <= year);
          if (eventsList.length === 0) {
            // fallback if none before chosen year
            eventsList = Array.isArray(json.events)
              ? json.events.slice(0, 5)
              : [];
          }
        }
        setEvents(eventsList);
      } catch (e) {
        setEvents([{ year: "?", text: "Could not load events. Please try again.", pages: [] }]);
      }
      setLoadingWiki(false);
    };
    fetchEvents();
    // eslint-disable-next-line
  }, [selectedDate, selectedYear, birthYearInput, isBirthYearMode]);

  // NYT Headlines API fetch -- Demo logic (no API Key): fetches no actual data, only mockup or error message
  React.useEffect(() => {
    const fetchNYT = async () => {
      setLoadingNYT(true);
      setNytError("");
      // NYT Archive API (requires API key), so we will just mock this here
      // const apiKey = ""; // Would-be: process.env.REACT_APP_NYT_KEY
      try {
        // (You may insert real NYT logic in a real environment here)
        // We'll just use placeholder headlines, using year/month
        let y = selectedDate.split("-")[0];
        let m = selectedDate.split("-")[1];
        if (Number(y) && Number(m)) {
          // show more modern headlines for modern dates, generic for older
          if (Number(y) >= 1981) {
            setNytHeadlines([
              {
                title: `Big News in ${y}: Vintage Redux`,
                url: "https://www.nytimes.com/",
                desc: `Sample NYT headline for ${m}/${y}`,
              },
              {
                title: `What Happened in ${y}?`,
                url: "https://www.nytimes.com/",
                desc: `Curated NYT highlights for the month`,
              },
            ]);
          } else {
            setNytHeadlines([
              {
                title: `NYT Archives Unavailable (pre-1981)`,
                url: "#",
                desc: "Public NYT API headlines available for Jan 1981 and later only.",
              },
            ]);
          }
        }
      } catch (err) {
        setNytError("Failed to load NYT headlines.");
        setNytHeadlines([]);
      }
      setLoadingNYT(false);
    };
    // Only try if not in birth-year lookup mode (birth years are pre-1981)
    if (!isBirthYearMode) fetchNYT();
    else {
      // In birth-year mode: just show a message
      setNytHeadlines([
        { title: "Try a modern date to see NYT headlines!", url: "#", desc: "" },
      ]);
    }
    // eslint-disable-next-line
  }, [selectedDate, selectedYear, isBirthYearMode]);

  // Timeline slider controls year view
  const handleTimelineChange = (newYear) => {
    setSelectedDate((prev) => {
      const parts = prev.split("-");
      return `${newYear}-${parts[1]}-${parts[2]}`;
    });
    setSelectedYear(newYear);
    setIsBirthYearMode(false);
    setBirthYearInput("");
  };

  // Date Picker controls full date
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setIsBirthYearMode(false);
    setBirthYearInput("");
  };

  // Random Year button
  const handleRandomYear = () => {
    const year =
      Math.floor(Math.random() * (LATEST_YEAR - EARLIEST_YEAR + 1)) +
      EARLIEST_YEAR;
    handleTimelineChange(year);
  };

  // My Birth Year feature
  const handleMyBirthYear = () => {
    let yob = prompt("Enter your birth year (e.g., 1965):", "");
    if (yob && !isNaN(yob) && yob > 1899 && yob <= LATEST_YEAR) {
      setBirthYearInput(yob);
      setIsBirthYearMode(true);
      setSelectedYear(Number(yob));
      setSelectedDate(`${yob}-01-01`);
    }
  };

  // Vintage Sound Toggle button
  const handleSoundToggle = () => {
    setSoundOn((prev) => !prev);
    // Optionally trigger a sound here if you have asset
  };

  return (
    <div className="pastblast-bg">
      {/* Header with PastBlast logo and top controls */}
      <header className="blast-header">
        <div className="header-main">
          <h1 className="blast-logo">PastBlast</h1>
          <div className="top-controls">
            <VintageSoundToggle
              on={soundOn}
              onToggle={handleSoundToggle}
            />
            <LoadingAnimation isLoading={isLoading} />
          </div>
        </div>
        <h2 className="blast-tagline">
          Travel through history, one day at a time 📰
        </h2>
      </header>

      <main className="vintage-main">
        <section className="date-select-section">
          <DatePicker
            value={selectedDate}
            min={`${EARLIEST_YEAR}-01-01`}
            max={`${LATEST_YEAR}-12-31`}
            onChange={handleDateChange}
            birthYearMode={isBirthYearMode}
            birthYearInput={birthYearInput}
          />
          <TimelineSlider
            value={selectedYear}
            min={EARLIEST_YEAR}
            max={LATEST_YEAR}
            onChange={handleTimelineChange}
          />
        </section>
        <section className="main-content-area">
          <div className="left-column">
            <FeatureButtonGroup
              onRandomYear={handleRandomYear}
              onMyBirthYear={handleMyBirthYear}
            />
            <HistoricalEventsFeed
              events={events}
              selectedYear={selectedYear}
              isLoading={loadingWiki}
            />
          </div>
          <aside className="nyt-sidebar">
            <NYTHeadlines
              headlines={nytHeadlines}
              isLoading={loadingNYT}
              error={nytError}
            />
          </aside>
        </section>
      </main>
    </div>
  );
};

/**
 * Date Picker (Vintage rotary/brass dial style)
 * PUBLIC_INTERFACE
 */
function DatePicker({ value, min, max, onChange, birthYearMode, birthYearInput }) {
  // Today
  const todayStr = getDefaultDate();
  return (
    <div className="date-picker-vintage">
      <span role="img" aria-label="Brass Dial">
        🕰️
      </span>
      <label
        htmlFor="vintage-date-picker"
        className="date-picker-label"
        style={{ fontWeight: 600, marginRight: 10 }}
      >
        Select Date:
      </label>
      <input
        id="vintage-date-picker"
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        style={{
          background: "inherit",
          border: "none",
          fontFamily: "inherit",
          fontSize: "1.08rem",
          color: "#614936",
          padding: "3px 7px",
          borderRadius: 7,
          outline: "2px solid #d3c29e",
          boxShadow: "inset 0 1px 2px #f2d39961",
        }}
        aria-label="Choose a date"
      />
      {birthYearMode && (
        <span
          style={{
            fontSize: "0.98rem",
            marginLeft: 14,
            color: "#a0803b",
            background: "#f8ecd8",
            padding: "5px 10px",
            borderRadius: 8,
            border: "1.2px solid #bfa77a91",
            fontStyle: "italic",
          }}
        >
          Birth year: {birthYearInput}
        </span>
      )}
      <button
        onClick={() => onChange({ target: { value: todayStr } })}
        className="vintage-btn type-key"
        style={{ marginLeft: 18, fontSize: "0.97rem", padding: "7px 14px" }}
        aria-label="Go to today"
      >
        📅 Today
      </button>
    </div>
  );
}

/**
 * TimelineSlider (pocket-watch styled year slider)
 * PUBLIC_INTERFACE
 */
function TimelineSlider({ value, min, max, onChange }) {
  return (
    <div className="timeline-slider-vintage">
      <span role="img" aria-label="Pocket Watch">
        ⏱️
      </span>
      <span style={{ fontWeight: 600, marginRight: 10 }}>Year:</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          accentColor: "#bfa77a",
          width: "180px",
        }}
        aria-label="Year slider"
      />
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: "1.14rem",
          color: "#6a4e42",
          marginLeft: 7,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Wax seal/typewriter key styled buttons: Random Year + My Birth Year
 * PUBLIC_INTERFACE
 */
function FeatureButtonGroup({ onRandomYear, onMyBirthYear }) {
  return (
    <div className="feature-button-group">
      <button
        className="vintage-btn wax"
        onClick={onRandomYear}
        aria-label="Jump to a random year"
      >
        🎲 Random Year
      </button>
      <button
        className="vintage-btn type-key"
        onClick={onMyBirthYear}
        aria-label="Show my birth year"
      >
        📜 My Birth Year
      </button>
    </div>
  );
}

/**
 * Historical Events Feed (vintage news clipping style)
 * PUBLIC_INTERFACE
 */
function HistoricalEventsFeed({ events, selectedYear, isLoading }) {
  // Show loading placeholder if needed
  if (isLoading) {
    return (
      <div className="news-feed-vintage">
        <div className="news-card-vintage">
          <span style={{ opacity: 0.7 }}>Loading historical events...</span>
        </div>
      </div>
    );
  }
  if (!Array.isArray(events) || events.length === 0) {
    return (
      <div className="news-feed-vintage">
        <div className="news-card-vintage">No events found for this date.</div>
      </div>
    );
  }
  return (
    <div className="news-feed-vintage">
      {events.map((evt, idx) => (
        <div key={idx} className="news-card-vintage">
          <div className="news-card-title">
            <span style={{ marginRight: 7 }}>
              {evt.year ? evt.year : "?"}
            </span>
            {evt.pages?.[0]?.titles?.normalized || evt.text?.slice(0, 30)}
          </div>
          <div className="news-card-desc">
            {evt.text}
            {evt.pages && evt.pages.length > 0 && (
              <span style={{ marginLeft: 7 }}>
                <a
                  href={evt.pages[0].content_urls?.desktop?.page || "#"}
                  className="nyt-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia
                </a>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * NYT Headlines (vintage newsprint cutout style)
 * PUBLIC_INTERFACE
 */
function NYTHeadlines({ headlines, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="nyt-headlines-vintage">
        <div>
          <span role="img" aria-label="Loading">🗞️</span> Loading headlines...
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="nyt-headlines-vintage">
        <div style={{ color: "#a33", fontWeight: "bold" }}>{error}</div>
      </div>
    );
  }
  if (!headlines || headlines.length === 0) {
    return (
      <div className="nyt-headlines-vintage">
        <span style={{ color: "#A9813A" }}>No NYT headlines found.</span>
      </div>
    );
  }
  return (
    <div className="nyt-headlines-vintage">
      {headlines.map((h, idx) => (
        <div className="nyt-headline" key={idx}>
          <div className="nyt-title">{h.title}</div>
          <div className="nyt-meta">
            {h.desc && (
              <span style={{ color: "#83603a" }}>{h.desc}</span>
            )}
            <br />
            <a
              href={h.url}
              className="nyt-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              news source &rarr;
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Vintage Sound Toggle (typewriter/phonograph icon)
 * PUBLIC_INTERFACE
 */
function VintageSoundToggle({ on, onToggle }) {
  return (
    <button
      className="sound-toggle-btn"
      title={on ? "Turn vintage sound off" : "Enable vintage sound"}
      aria-pressed={on}
      onClick={onToggle}
      style={{
        background: on
          ? "linear-gradient(180deg,#fbe9c8 74%,#eedcbc 100%)"
          : "#f8ead5",
        opacity: on ? 1 : 0.56,
      }}
    >
      <span role="img" aria-label="Phonograph">
        {on ? "🔊" : "🔈"}
      </span>
    </button>
  );
}

/**
 * Loading Animation (paper flip/quill)
 * PUBLIC_INTERFACE
 */
function LoadingAnimation({ isLoading }) {
  return isLoading ? (
    <div className="loading-anim-vintage" aria-label="Loading">
      <span role="img" aria-label="Quill writing">
        🪶
      </span>{" "}
      <span className="loading-text">Loading...</span>
    </div>
  ) : null;
}

export default PastBlastContainer;
