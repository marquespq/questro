import { useState } from "react";

export function StorageSection() {
  const [selectedAdapter, setSelectedAdapter] = useState<
    "local" | "session" | "memory" | "custom"
  >("local");

  const adapters = [
    {
      id: "local",
      name: "LocalStorage",
      icon: "💾",
      description: "Persistent storage that survives browser restarts",
      useCases: [
        "Production apps",
        "Long-term user data",
        "Offline-first apps",
      ],
    },
    {
      id: "session",
      name: "SessionStorage",
      icon: "⏳",
      description: "Temporary storage cleared when tab closes",
      useCases: [
        "Per-session tracking",
        "Temporary game states",
        "Privacy-focused apps",
      ],
    },
    {
      id: "memory",
      name: "MemoryStorage",
      icon: "🧠",
      description: "In-memory storage (no persistence)",
      useCases: ["Testing", "Server-side rendering", "Demos"],
    },
    {
      id: "custom",
      name: "Custom Backend",
      icon: "🔌",
      description: "Connect to your own API/database",
      useCases: ["Multi-device sync", "Analytics", "Real-time updates"],
    },
  ];

  const codeExamples = {
    local: `import { PointsProvider, LocalStorageAdapter } from 'questro';

function App() {
  const storage = new LocalStorageAdapter('my-game');
  
  return (
    <PointsProvider 
      config={{ userId: 'user-123' }}
      storage={storage}
    >
      {/* Your app */}
    </PointsProvider>
  );
}`,
    session: `import { PointsProvider, SessionStorageAdapter } from 'questro';

function App() {
  const storage = new SessionStorageAdapter('temp-session');
  
  return (
    <PointsProvider 
      config={{ userId: 'user-123' }}
      storage={storage}
    >
      {/* Data cleared when tab closes */}
    </PointsProvider>
  );
}`,
    memory: `import { PointsProvider, MemoryStorageAdapter } from 'questro';

function App() {
  const storage = new MemoryStorageAdapter();
  
  return (
    <PointsProvider 
      config={{ userId: 'user-123' }}
      storage={storage}
    >
      {/* Perfect for SSR (Next.js, Remix) */}
    </PointsProvider>
  );
}`,
    custom: `import type { StorageAdapter } from 'questro';

class APIStorageAdapter<T> implements StorageAdapter<T> {
  async get(key: string): Promise<T | null> {
    const response = await fetch(\`/api/storage/\${key}\`);
    return response.json();
  }

  async set(key: string, value: T): Promise<void> {
    await fetch(\`/api/storage/\${key}\`, {
      method: 'PUT',
      body: JSON.stringify(value),
    });
  }

  async remove(key: string): Promise<void> {
    await fetch(\`/api/storage/\${key}\`, { 
      method: 'DELETE' 
    });
  }

  async clear(): Promise<void> {
    await fetch('/api/storage', { 
      method: 'DELETE' 
    });
  }
}

// Usage
const storage = new APIStorageAdapter();
<PointsProvider storage={storage} />`,
  };

  const selected = adapters.find((a) => a.id === selectedAdapter)!;

  return (
    <div className="module-section">
      <div className="module-demo">
        <div className="demo-card">
          <div className="demo-header">
            <h3 className="demo-title">Storage Adapters</h3>
            <div className="demo-badge">Flexible Persistence</div>
          </div>

          {/* Explicação */}
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "#faf5ff",
              border: "1px solid #e9d5ff",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "20px", marginRight: "8px" }}>💡</span>
              <div
                style={{ fontSize: "14px", fontWeight: 700, color: "#6b21a8" }}
              >
                How Storage Works
              </div>
            </div>
            <div
              style={{ fontSize: "13px", color: "#6b21a8", lineHeight: "1.6" }}
            >
              <strong>Pluggable Storage:</strong> Choose where to store your
              gamification data
              <br />
              <strong>Auto-persistence:</strong> State automatically saved on
              every change
              <br />
              <strong>Type-safe:</strong> Full TypeScript support for custom
              adapters
            </div>
          </div>

          {/* Seletor de Adapters */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "12px",
              }}
            >
              Choose Storage Adapter
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
              }}
            >
              {adapters.map((adapter) => (
                <button
                  key={adapter.id}
                  onClick={() =>
                    setSelectedAdapter(
                      adapter.id as "local" | "session" | "memory" | "custom"
                    )
                  }
                  style={{
                    padding: "16px",
                    backgroundColor:
                      selectedAdapter === adapter.id ? "#faf5ff" : "#fff",
                    border: `2px solid ${
                      selectedAdapter === adapter.id ? "#8b5cf6" : "#e2e8f0"
                    }`,
                    borderRadius: "12px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    {adapter.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {adapter.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "4px",
                    }}
                  >
                    {adapter.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detalhes do Adapter Selecionado */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div style={{ fontSize: "32px", marginRight: "12px" }}>
                {selected.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {selected.name}
                </div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>
                  {selected.description}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#64748b",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Best For
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {selected.useCases.map((useCase, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "4px 12px",
                      backgroundColor: "#ede9fe",
                      color: "#6b21a8",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {useCase}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="module-code">
        <h3 className="code-title">Implementation</h3>

        <div className="code-block">
          <div className="code-label">{selected.name} Example</div>
          <pre className="code-snippet">{codeExamples[selectedAdapter]}</pre>
        </div>

        {selectedAdapter === "custom" && (
          <div className="code-block">
            <div className="code-label">TypeScript Interface</div>
            <pre className="code-snippet">{`interface StorageAdapter<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}`}</pre>
          </div>
        )}

        <div className="code-block">
          <div className="code-label">Works with All Providers</div>
          <pre className="code-snippet">{`import { LocalStorageAdapter } from 'questro';

const storage = new LocalStorageAdapter('my-app');

// Use with any provider
<PointsProvider storage={storage} />
<BadgesProvider storage={storage} />
<QuestsProvider storage={storage} />
<LeaderboardProvider storage={storage} />`}</pre>
        </div>
      </div>
    </div>
  );
}
