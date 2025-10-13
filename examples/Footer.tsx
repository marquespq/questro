import { styles } from "../styles/appStyles";

export function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <div style={styles.footerBrand}>
          <h3 style={styles.footerLogo}>Questro</h3>
          <p style={styles.footerTagline}>Gamification made simple</p>
        </div>
        <div style={styles.footerLinks}>
          <a href="https://npmjs.com/package/questro" style={styles.footerLink}>
            npm
          </a>
          <a
            href="https://github.com/marquespq/questro"
            style={styles.footerLink}
          >
            GitHub
          </a>
          <span style={styles.footerVersion}>v0.2.2</span>
        </div>
      </div>
    </footer>
  );
}
