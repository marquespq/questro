import { useState } from "react";

export function QuickStartSection() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyCode = (code: string, step: number) => {
    navigator.clipboard.writeText(code);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      number: "01",
      title: "Install",
      description: "Add questro to your project",
      code: "npm install questro",
    },
    {
      number: "02",
      title: "Wrap",
      description: "Wrap your app with providers",
      code: `import { PointsProvider } from 'questro/points';

function App() {
  return (
    <PointsProvider>
      <YourApp />
    </PointsProvider>
  );
}`,
    },
    {
      number: "03",
      title: "Use",
      description: "Start tracking points in any component",
      code: `import { usePoints } from 'questro/points';

function MyComponent() {
  const { balance, addPoints } = usePoints();
  
  return (
    <button onClick={() => addPoints(10)}>
      Score: {balance}
    </button>
  );
}`,
    },
  ];

  return (
    <div className="quickstart-section">
      <div className="section-header">
        <h2 className="section-title">Get Started in 60 Seconds</h2>
        <p className="section-subtitle">
          Three simple steps to add gamification to your React app
        </p>
      </div>

      <div className="quickstart-grid">
        {steps.map((step, index) => (
          <div key={index} className="quickstart-card">
            <div className="quickstart-number">{step.number}</div>
            <h3 className="quickstart-title">{step.title}</h3>
            <p className="quickstart-description">{step.description}</p>
            <div className="quickstart-code-wrapper">
              <button
                className="copy-button"
                onClick={() => copyCode(step.code, index)}
                title="Copy to clipboard"
              >
                {copiedStep === index ? "✓" : "📋"}
              </button>
              <pre className="quickstart-code">
                <code>{step.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      <div className="quickstart-next">
        <p>
          Ready to explore all features? Scroll down to see each module in
          action.
        </p>
      </div>
    </div>
  );
}
