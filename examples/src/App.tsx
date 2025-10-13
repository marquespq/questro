import { useState } from "react";
import { PointsProvider } from "questro/points";
import { BadgesProvider } from "questro/badges";
import { QuestsProvider } from "questro/quests";
import { LeaderboardProvider } from "questro/leaderboard";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { PointsSection } from "./components/PointsSection";
import { BadgesSection } from "./components/BadgesSection";
import { QuestsSection } from "./components/QuestsSection";
import { LeaderboardSection } from "./components/LeaderboardSection";
import { userId, badges, quests, leaderboardEntries } from "./data/mockData";
import "./styles/responsive.css";

function ComponentsShowcase() {
  const [activeTab, setActiveTab] = useState<
    "points" | "badges" | "quests" | "leaderboard"
  >("points");

  return (
    <div className="app-container">
      <Hero />
      <Features />

      <section className="interactive">
        <h2 className="interactive-title">Interactive Components</h2>
        <p className="interactive-subtitle">
          Try all features live. No installation needed.
        </p>

        <div className="tabs">
          <button
            className={activeTab === "points" ? "tab tab-active" : "tab"}
            onClick={() => setActiveTab("points")}
          >
            📊 Points
          </button>
          <button
            className={activeTab === "badges" ? "tab tab-active" : "tab"}
            onClick={() => setActiveTab("badges")}
          >
            🏆 Badges
          </button>
          <button
            className={activeTab === "quests" ? "tab tab-active" : "tab"}
            onClick={() => setActiveTab("quests")}
          >
            🎯 Quests
          </button>
          <button
            className={activeTab === "leaderboard" ? "tab tab-active" : "tab"}
            onClick={() => setActiveTab("leaderboard")}
          >
            🏅 Leaderboard
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "points" && <PointsSection />}
          {activeTab === "badges" && <BadgesSection />}
          {activeTab === "quests" && <QuestsSection />}
          {activeTab === "leaderboard" && <LeaderboardSection />}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <PointsProvider config={{ userId, initialBalance: 0 }}>
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
    </PointsProvider>
  );
}
