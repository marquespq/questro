import { styles } from "../styles/appStyles";

export function Hero() {
  return (
    <header style={styles.hero}>
      <div style={styles.heroContent}>
        <div style={styles.heroBadge}>✨ Now with 4 modules</div>
        <h1 style={styles.heroTitle}>
          Level up your app with
          <br />
          <span style={styles.heroGradient}>gamification</span>
        </h1>
        <p style={styles.heroSubtitle}>
          A powerful React library to add points, badges, quests, and
          leaderboards to your application. Make your users addicted to your
          product.
        </p>
        <div style={styles.heroButtons}>
          <button style={styles.heroPrimary}>
            <span>npm install questro</span>
          </button>
          <button style={styles.heroSecondary}>View on GitHub →</button>
        </div>
      </div>
    </header>
  );
}
