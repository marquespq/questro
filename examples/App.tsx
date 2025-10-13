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
import { styles } from "./styles/appStyles";

function ComponentsShowcase() {
  const [activeTab, setActiveTab] = useState<
    "points" | "badges" | "quests" | "leaderboard"
  >("points");

  return (
    <div style={styles.container}>
      <Hero />
      <Features />

      <section style={styles.interactive}>
        <h2 style={styles.interactiveTitle}>Interactive Components</h2>
        <p style={styles.interactiveSubtitle}>
          Try all features live. No installation needed.
        </p>

        <div style={styles.tabs}>
          <button
            style={
              activeTab === "points"
                ? { ...styles.tab, ...styles.tabActive }
                : styles.tab
            }
            onClick={() => setActiveTab("points")}
          >
            📊 Points
          </button>
          <button
            style={
              activeTab === "badges"
                ? { ...styles.tab, ...styles.tabActive }
                : styles.tab
            }
            onClick={() => setActiveTab("badges")}
          >
            🏆 Badges
          </button>
          <button
            style={
              activeTab === "quests"
                ? { ...styles.tab, ...styles.tabActive }
                : styles.tab
            }
            onClick={() => setActiveTab("quests")}
          >
            🎯 Quests
          </button>
          <button
            style={
              activeTab === "leaderboard"
                ? { ...styles.tab, ...styles.tabActive }
                : styles.tab
            }
            onClick={() => setActiveTab("leaderboard")}
          >
            🏅 Leaderboard
          </button>
        </div>

        <div style={styles.tabContent}>
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
