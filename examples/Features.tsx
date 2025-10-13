import { styles } from "../styles/appStyles";

export function Features() {
  return (
    <section style={styles.features}>
      <div style={styles.featuresGrid}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>📊</div>
          <h3 style={styles.featureTitle}>Points System</h3>
          <p style={styles.featureText}>
            Track rewards, transactions, and lifetime achievements
          </p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🏆</div>
          <h3 style={styles.featureTitle}>Badge Awards</h3>
          <p style={styles.featureText}>
            Unlock achievements with custom rarities and conditions
          </p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🎯</div>
          <h3 style={styles.featureTitle}>Quest Missions</h3>
          <p style={styles.featureText}>
            Create engaging objectives with automatic progress tracking
          </p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🏅</div>
          <h3 style={styles.featureTitle}>Leaderboards</h3>
          <p style={styles.featureText}>
            Competitive rankings with filtering and real-time updates
          </p>
        </div>
      </div>
    </section>
  );
}
