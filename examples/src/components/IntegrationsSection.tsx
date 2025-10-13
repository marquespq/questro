import { useState } from "react";

type IntegrationExample = {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  tags: string[];
};

export function IntegrationsSection() {
  const [selectedIntegration, setSelectedIntegration] = useState("nextjs");

  const integrations: IntegrationExample[] = [
    {
      id: "nextjs",
      name: "Next.js App Router",
      icon: "▲",
      description: "Server-side rendering with React Server Components",
      difficulty: "Medium",
      tags: ["SSR", "React 18", "App Router"],
    },
    {
      id: "backend",
      name: "Backend API",
      icon: "🔌",
      description: "Sync gamification data with your REST API",
      difficulty: "Medium",
      tags: ["REST", "Sync", "Persistence"],
    },
    {
      id: "react-native",
      name: "React Native",
      icon: "📱",
      description: "Mobile apps with AsyncStorage",
      difficulty: "Easy",
      tags: ["Mobile", "iOS", "Android"],
    },
    {
      id: "tailwind",
      name: "Tailwind CSS",
      icon: "🎨",
      description: "Style components with Tailwind utility classes",
      difficulty: "Easy",
      tags: ["Styling", "CSS", "Design"],
    },
    {
      id: "typescript",
      name: "TypeScript",
      icon: "📘",
      description: "Full type safety with custom types",
      difficulty: "Easy",
      tags: ["Types", "IntelliSense", "DX"],
    },
    {
      id: "websockets",
      name: "Real-time WebSockets",
      icon: "⚡",
      description: "Live multiplayer with Socket.io",
      difficulty: "Advanced",
      tags: ["Real-time", "Multiplayer", "WebSockets"],
    },
  ];

  const codeExamples: Record<string, string> = {
    nextjs: `// app/providers.tsx
'use client';

import { PointsProvider, MemoryStorageAdapter } from 'questro';

export function Providers({ children }: { children: React.ReactNode }) {
  // Use MemoryStorage for SSR, sync with server on mount
  const storage = new MemoryStorageAdapter();
  
  return (
    <PointsProvider 
      config={{ userId: 'user-123' }}
      storage={storage}
    >
      {children}
    </PointsProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// app/game/page.tsx
'use client';

import { usePoints } from 'questro/points';

export default function GamePage() {
  const { balance, addPoints } = usePoints();
  
  return (
    <div>
      <h1>Balance: {balance}</h1>
      <button onClick={() => addPoints(10)}>
        Earn Points
      </button>
    </div>
  );
}`,
    backend: `import type { StorageAdapter } from 'questro';

// Custom storage adapter that syncs with your API
class BackendStorageAdapter<T> implements StorageAdapter<T> {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async get(key: string): Promise<T | null> {
    const response = await fetch(\`\${this.baseUrl}/storage/\${key}\`, {
      headers: { Authorization: \`Bearer \${this.token}\` },
    });
    
    if (!response.ok) return null;
    return response.json();
  }

  async set(key: string, value: T): Promise<void> {
    await fetch(\`\${this.baseUrl}/storage/\${key}\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${this.token}\`,
      },
      body: JSON.stringify(value),
    });
  }

  async remove(key: string): Promise<void> {
    await fetch(\`\${this.baseUrl}/storage/\${key}\`, {
      method: 'DELETE',
      headers: { Authorization: \`Bearer \${this.token}\` },
    });
  }

  async clear(): Promise<void> {
    await fetch(\`\${this.baseUrl}/storage\`, {
      method: 'DELETE',
      headers: { Authorization: \`Bearer \${this.token}\` },
    });
  }
}

// Usage
const storage = new BackendStorageAdapter(
  'https://api.yourgame.com',
  userToken
);

<PointsProvider storage={storage} />`,
    "react-native": `// App.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PointsProvider } from 'questro/points';
import type { StorageAdapter } from 'questro';

// AsyncStorage adapter for React Native
class AsyncStorageAdapter<T> implements StorageAdapter<T> {
  private prefix: string;

  constructor(prefix = 'questro') {
    this.prefix = prefix;
  }

  async get(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(\`\${this.prefix}:\${key}\`);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(
      \`\${this.prefix}:\${key}\`,
      JSON.stringify(value)
    );
  }

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(\`\${this.prefix}:\${key}\`);
  }

  async clear(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const prefixedKeys = keys.filter(k => k.startsWith(\`\${this.prefix}:\`));
    await AsyncStorage.multiRemove(prefixedKeys);
  }
}

// Usage in your app
export default function App() {
  const storage = new AsyncStorageAdapter();
  
  return (
    <PointsProvider 
      config={{ userId: 'user-123' }}
      storage={storage}
    >
      <GameScreen />
    </PointsProvider>
  );
}`,
    tailwind: `import { usePoints, PointsDisplay } from 'questro/points';

function GameUI() {
  const { balance, addPoints } = usePoints();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Points Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Your Balance
              </p>
              <PointsDisplay className="text-5xl font-black text-gray-900" />
            </div>
            <div className="text-6xl">💎</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => addPoints(10)}
            className="bg-gradient-to-r from-green-400 to-blue-500 
                     text-white font-bold py-4 px-8 rounded-xl
                     transform transition hover:scale-105 hover:shadow-xl
                     active:scale-95"
          >
            🎯 Earn +10 Points
          </button>
          
          <button
            onClick={() => addPoints(50)}
            className="bg-gradient-to-r from-purple-400 to-pink-500 
                     text-white font-bold py-4 px-8 rounded-xl
                     transform transition hover:scale-105 hover:shadow-xl
                     active:scale-95"
          >
            ⭐ Bonus +50 Points
          </button>
        </div>
      </div>
    </div>
  );
}`,
    typescript: `import type { Badge, Quest, LeaderboardEntry } from 'questro';

// Extend types for your app
interface CustomBadge extends Badge {
  customData: {
    animation: string;
    sound: string;
  };
}

interface CustomQuest extends Quest {
  prerequisites: string[];
  rewards: {
    points?: number;
    badgeId?: string;
    items?: Array<{ id: string; quantity: number }>;
  };
}

// Type-safe hooks
import { usePoints, useBadges, useQuests } from 'questro';

function TypeSafeComponent() {
  const points = usePoints();
  const badges = useBadges();
  const quests = useQuests();
  
  // All methods are fully typed!
  points.addPoints(10, { 
    action: 'task-complete',
    description: 'Completed daily task' 
  });
  
  badges.updateProgress('badge-id', 50);
  
  quests.startQuest('quest-id');
  
  // Type inference works!
  const balance: number = points.balance;
  const allBadges: readonly Badge[] = badges.allBadges;
  const activeQuests: Quest[] = quests.activeQuests;
}

// Custom event types
type CustomEvents = {
  'points:milestone': { points: number; milestone: number };
  'badge:rare-unlocked': { badge: Badge };
};`,
    websockets: `import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { usePoints } from 'questro/points';

// Real-time sync with WebSockets
function MultiplayerGame() {
  const { balance, addPoints, setBalance } = usePoints();
  
  useEffect(() => {
    const socket = io('wss://game-server.com');
    
    // Send local changes to server
    socket.on('connect', () => {
      socket.emit('sync-points', { balance });
    });
    
    // Receive updates from other players/server
    socket.on('points-updated', (data: { userId: string; balance: number }) => {
      if (data.userId === 'current-user-id') {
        setBalance(data.balance);
      }
    });
    
    // Broadcast when earning points
    const handlePointsEarned = (amount: number) => {
      addPoints(amount, { action: 'multiplayer-action' });
      socket.emit('earned-points', { amount });
    };
    
    return () => {
      socket.disconnect();
    };
  }, [balance, addPoints, setBalance]);
  
  return <div>Multiplayer Game UI</div>;
}

// Server-side (Node.js + Socket.io)
/*
io.on('connection', (socket) => {
  socket.on('earned-points', async (data) => {
    // Update database
    await db.updatePoints(socket.userId, data.amount);
    
    // Broadcast to all players
    io.emit('points-updated', {
      userId: socket.userId,
      balance: newBalance
    });
  });
});
*/`,
  };

  const selected = integrations.find((i) => i.id === selectedIntegration)!;

  const difficultyColor = {
    Easy: "#10b981",
    Medium: "#f59e0b",
    Advanced: "#ef4444",
  };

  return (
    <div className="module-section">
      <div className="module-demo">
        <div className="demo-card">
          <div className="demo-header">
            <h3 className="demo-title">Integration Examples</h3>
            <div className="demo-badge">Production Ready</div>
          </div>

          {/* Explicação */}
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
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
                style={{ fontSize: "14px", fontWeight: 700, color: "#15803d" }}
              >
                Framework Integration
              </div>
            </div>
            <div
              style={{ fontSize: "13px", color: "#15803d", lineHeight: "1.6" }}
            >
              <strong>Universal:</strong> Works with any React framework or
              vanilla React
              <br />
              <strong>Flexible:</strong> Adapt storage and state management to
              your stack
              <br />
              <strong>Production-tested:</strong> Real-world examples from
              production apps
            </div>
          </div>

          {/* Integration Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            {integrations.map((integration) => (
              <button
                key={integration.id}
                onClick={() => setSelectedIntegration(integration.id)}
                style={{
                  padding: "16px",
                  backgroundColor:
                    selectedIntegration === integration.id ? "#f8fafc" : "#fff",
                  border: `2px solid ${
                    selectedIntegration === integration.id
                      ? "#0f172a"
                      : "#e2e8f0"
                  }`,
                  borderRadius: "12px",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ fontSize: "32px" }}>{integration.icon}</div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      backgroundColor: difficultyColor[integration.difficulty],
                      color: "#fff",
                    }}
                  >
                    {integration.difficulty}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {integration.name}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  {integration.description}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Integration Details */}
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
              <div style={{ fontSize: "48px", marginRight: "16px" }}>
                {selected.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {selected.name}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  {selected.description}
                </div>
              </div>
              <div
                style={{
                  padding: "6px 16px",
                  borderRadius: "8px",
                  backgroundColor: difficultyColor[selected.difficulty],
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                {selected.difficulty}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {selected.tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "4px 12px",
                    backgroundColor: "#e2e8f0",
                    color: "#475569",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="module-code">
        <h3 className="code-title">Implementation</h3>

        <div className="code-block">
          <div className="code-label">{selected.name}</div>
          <pre
            className="code-snippet"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            {codeExamples[selectedIntegration]}
          </pre>
        </div>
      </div>
    </div>
  );
}
