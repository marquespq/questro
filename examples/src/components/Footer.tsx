import { QUESTRO_VERSION } from "../utils/version";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3 className="footer-logo">Questro</h3>
          <p className="footer-tagline">Gamification made simple</p>
        </div>
        <div className="footer-links">
          <a href="https://npmjs.com/package/questro" className="footer-link">
            npm
          </a>
          <a
            href="https://github.com/marquespq/questro"
            className="footer-link"
          >
            GitHub
          </a>
          <span className="footer-version">v{QUESTRO_VERSION}</span>
        </div>
      </div>
    </footer>
  );
}
