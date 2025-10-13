export function Features() {
  return (
    <section className="features">
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3 className="feature-title">Points System</h3>
          <p className="feature-text">
            Track rewards, transactions, and lifetime achievements
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3 className="feature-title">Badge Awards</h3>
          <p className="feature-text">
            Unlock achievements with custom rarities and conditions
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3 className="feature-title">Quest Missions</h3>
          <p className="feature-text">
            Create engaging objectives with automatic progress tracking
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏅</div>
          <h3 className="feature-title">Leaderboards</h3>
          <p className="feature-text">
            Competitive rankings with filtering and real-time updates
          </p>
        </div>
      </div>
    </section>
  );
}
