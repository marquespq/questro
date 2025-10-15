import { useEffect, useState } from "react";
import { PointsProvider } from "questro/points";
import { BadgesProvider } from "questro/badges";
import { QuestsProvider } from "questro/quests";
import { LeaderboardProvider } from "questro/leaderboard";
import { LevelsProvider } from "questro/levels";
import { NotificationsProvider } from "questro/notifications";
import { DemoStreaksProvider } from "./components/DemoStreaksProvider";
import { Footer } from "./components/Footer";
import { QuickStartSection } from "./components/QuickStartSection";
import { ModulesGrid } from "./components/ModulesGrid";
import { LivePlayground } from "./components/LivePlayground";
import { ShowcaseSection } from "./components/ShowcaseSection";
import { userId, badges, quests, leaderboardEntries } from "./data/mockData";
import { QUESTRO_VERSION } from "./utils/version";
import "./styles/responsive.css";

function ComponentsShowcase() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false); // Close menu when navigating
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Height of fixed nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Handle hash navigation on load
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => scrollToSection(id), 100);
    }
  }, []);

  return (
    <div className="app-container">
      {/* Fixed Navigation */}
      <nav className="fixed-nav">
        <div className="fixed-nav-content">
          <div className="nav-logo">questro</div>

          {/* Hamburger Button */}
          <button
            className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <button onClick={() => scrollToSection("quickstart")}>
              Quick Start
            </button>
            <button onClick={() => scrollToSection("modules")}>Modules</button>
            <button onClick={() => scrollToSection("playground")}>
              Playground
            </button>
            <button onClick={() => scrollToSection("showcase")}>
              Examples
            </button>
            <button
              className="nav-github-mobile"
              onClick={() => {
                setMobileMenuOpen(false);
                window.open("https://github.com/marquespq/questro", "_blank");
              }}
            >
              GitHub
            </button>
          </div>

          <div className="nav-actions">
            <button
              className="nav-github"
              onClick={() =>
                window.open("https://github.com/marquespq/questro", "_blank")
              }
            >
              GitHub
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero" id="hero">
        <div className="hero-content">
          <div className="badge">🎮 v{QUESTRO_VERSION}</div>
          <h1 className="hero-title">questro</h1>
          <p className="hero-subtitle">
            Add gamification to your React app in minutes.
            <br />
            Points, badges, quests, leaderboards, and streaks - all in one
            simple library.
          </p>
          <div className="hero-buttons">
            <button
              className="cta-button"
              onClick={() => scrollToSection("quickstart")}
            >
              Get Started →
            </button>
            <button
              className="secondary-button"
              onClick={() =>
                window.open("https://www.npmjs.com/package/questro", "_blank")
              }
            >
              npm install questro
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-value">7</div>
              <div className="stat-label">Core Modules</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">&lt;5KB</div>
              <div className="stat-label">Gzipped</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">100%</div>
              <div className="stat-label">TypeScript</div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Start */}
      <section id="quickstart" className="section-wrapper">
        <QuickStartSection />
      </section>

      {/* Modules Grid */}
      <section id="modules" className="section-wrapper">
        <ModulesGrid />
      </section>

      {/* Live Playground */}
      <section id="playground" className="section-wrapper">
        <LivePlayground />
      </section>

      {/* Showcase */}
      <section id="showcase" className="section-wrapper">
        <ShowcaseSection />
      </section>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <NotificationsProvider>
      <PointsProvider config={{ userId, initialBalance: 0 }}>
        <LevelsProvider config={{ userId, formula: "linear", baseXP: 100 }}>
          <DemoStreaksProvider>
            <BadgesProvider config={{ userId, badges }}>
              <QuestsProvider quests={quests} config={{ maxActiveQuests: 5 }}>
                <LeaderboardProvider
                  entries={leaderboardEntries}
                  config={{ userId, metric: "points" }}
                >
                  <ComponentsShowcase />
                </LeaderboardProvider>
              </QuestsProvider>
            </BadgesProvider>
          </DemoStreaksProvider>
        </LevelsProvider>
      </PointsProvider>
    </NotificationsProvider>
  );
}
