<div align="center">

# 🎮 Questro

**A lightweight, modular gamification library for React**

[![npm](https://img.shields.io/npm/v/questro.svg)](https://www.npmjs.com/package/questro)
[![npm downloads](https://img.shields.io/npm/dm/questro.svg)](https://www.npmjs.com/package/questro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**[📖 Documentation](https://marquespq.github.io/example-questro/)** • **[🌟 Examples](https://marquespq.github.io/example-questro/#showcase)** • **[💬 GitHub](https://github.com/marquespq/questro)**

</div>

---

## 🚀 Why Questro?

**Questro** provides a complete set of building blocks to add gamification to any React application. Whether you're building a fitness tracker, learning platform, or e-commerce loyalty program - Questro offers the tools you need.

- **🎯 Modular Architecture** - Import only what you need
- **⚡ Zero Dependencies** - Pure React, no external dependencies
- **📘 TypeScript First** - Full type safety out of the box
- **🎨 Unstyled Components** - Complete design freedom
- **🔌 Flexible Storage** - LocalStorage, SessionStorage, Memory, or custom backends
- **⚛️ React-Focused** - Built specifically for React applications

## Installation

```bash
npm install questro
# or
yarn add questro
# or
pnpm add questro
```

## ⚡ Quick Start

```tsx
import { PointsProvider, usePoints } from 'questro/points';

function App() {
  return (
    <PointsProvider config={{ userId: 'user-123' }}>
      <Game />
    </PointsProvider>
  );
}

function Game() {
  const { balance, addPoints } = usePoints();

  return (
    <div>
      <h1>Points: {balance}</h1>
      <button onClick={() => addPoints(10)}>Complete Task (+10)</button>
    </div>
  );
}
```

## 🎯 Core Modules

### 📊 Points System

Track user points with full transaction history and lifecycle events.

```tsx
import { PointsProvider, usePoints } from 'questro/points';

const { balance, lifetime, addPoints, subtractPoints } = usePoints();
```

### 🏆 Badges & Achievements

Unlock badges based on conditions with progress tracking and rarity tiers.

```tsx
import { BadgesProvider, useBadges } from 'questro/badges';

const { badges, updateProgress, checkAndUnlockBadges } = useBadges();
```

### 🎯 Quests & Missions

Multi-objective quests with automatic completion detection.

```tsx
import { QuestsProvider, useQuests } from 'questro/quests';

const { activeQuests, updateProgress, completeQuest } = useQuests();
```

### � Leaderboard

Competitive rankings with real-time updates.

```tsx
import { LeaderboardProvider, useLeaderboard } from 'questro/leaderboard';

const { entries, updateScore, getUserRank } = useLeaderboard();
```

## 🌟 Use Cases

### 🗣️ Language Learning

- Daily streak tracking with XP rewards
- Achievement badges for milestones
- Friend leaderboards by language

### 💪 Fitness & Wellness

- Workout quest system
- Consistency streak tracking
- Weekly challenge leaderboards

### ✅ Productivity Tools

- Points for completed tasks
- Daily/weekly goal quests
- Team performance leaderboards

### 🛒 E-commerce & Loyalty

- Purchase points system
- VIP tier badges
- Referral quests and rewards

### 🎓 Education & Learning

- Course completion badges
- Study streak tracking
- Skill mastery quests

### 📱 Social & Community

- Engagement points system
- Community badges
- Viral content challenges

**[→ View Interactive Examples](https://marquespq.github.io/example-questro/#showcase)**

## 💾 Storage Adapters

Questro works with any storage solution:

### LocalStorage

```tsx
import { LocalStorageAdapter } from 'questro';

<PointsProvider storage={new LocalStorageAdapter()} />;
```

### Custom Backend

```tsx
import type { StorageAdapter } from 'questro';

class APIStorage<T> implements StorageAdapter<T> {
  async get(key: string): Promise<T | null> {
    const res = await fetch(`/api/storage/${key}`);
    return res.json();
  }

  async set(key: string, value: T): Promise<void> {
    await fetch(`/api/storage/${key}`, {
      method: 'PUT',
      body: JSON.stringify(value),
    });
  }
}
```

## 🔌 Framework Compatibility

| Framework    | Support       | Notes                             |
| ------------ | ------------- | --------------------------------- |
| React        | ✅ Full       | Complete support                  |
| Next.js      | ✅ SSR Ready  | Use MemoryStorage for server-side |
| React Native | ✅ Compatible | AsyncStorage adapter recommended  |
| TypeScript   | ✅ Built-in   | Full type definitions included    |
| Remix        | ✅ Compatible | Works with all storage adapters   |
| Gatsby       | ✅ Compatible | Static site generation supported  |

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

- 🐛 [Report bugs](https://github.com/marquespq/questro/issues) - Help us identify and fix issues
- 💡 [Request features](https://github.com/marquespq/questro/issues/new) - Suggest new functionality
- 📖 [Improve docs](https://github.com/marquespq/questro) - Help make our documentation better
- 🔧 [Submit PRs](https://github.com/marquespq/questro/pulls) - Contribute code improvements

Please read our contributing guidelines before submitting pull requests.

## 📄 License

MIT © [Gabriel Marques](https://github.com/marquespq)

---

<div align="center">

## 🔗 Links

**[📖 Documentation](https://marquespq.github.io/example-questro/)** • **[📦 NPM](https://www.npmjs.com/package/questro)** • **[� Issues](https://github.com/marquespq/questro/issues)** • **[� Pull Requests](https://github.com/marquespq/questro/pulls)**

---

**Built with ❤️ by developers, for developers**

If Questro helps your project, please give it a ⭐ on **[GitHub](https://github.com/marquespq/questro)**!

</div>
