export function Hero() {
  return (
    <header className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Level up your app with
          <br />
          <span className="hero-gradient">gamification</span>
        </h1>
        <p className="hero-subtitle">
          A powerful React library to add points, badges, quests, and
          leaderboards to your application. Make your users addicted to your
          product.
        </p>
        <div className="hero-buttons">
          <a
            href="https://www.npmjs.com/package/questro"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-primary"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            <span>npm install questro</span>
          </a>
          <a
            href="https://github.com/marquespq/questro"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-secondary"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </header>
  );
}
