<div align="center">

# 🎮 Questro

**A lightweight, modular gamification library for React**

[![npm](https://img.shields.io/npm/v/questro.svg)](https://www.npmjs.com/package/questro)
[![npm downloads](https://img.shields.io/npm/dm/questro.svg)](https://www.npmjs.com/package/questro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/questro)](https://bundlephobia.com/package/questro)

**[📖 Interactive Docs](https://marquespq.github.io/example-questro/)** • **[🌟 Showcase](https://marquespq.github.io/example-questro/#showcase)** • **[💬 GitHub](https://github.com/marquespq/questro)**

</div>

---

## 🚀 Why Questro?

**Questro** makes it dead simple to add gamification to any React app. Whether you're building a fitness tracker, learning platform, or e-commerce loyalty program - Questro provides the building blocks you need.

- **🪶 Lightweight** - Only 135 kB (68% smaller than v0.1.0)
- **🎯 Modular** - Import only what you need
- **⚡ Zero Dependencies** - Except React
- **📘 TypeScript First** - Full type safety
- **🎨 Unstyled** - Bring your own design
- **🔌 Flexible Storage** - LocalStorage, SessionStorage, Memory, or custom backends

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

## 🌟 Showcase

Real apps built with Questro:

### 🗣️ Language Learning (Duolingo-style)

- Daily streak tracking with XP rewards
- Achievement badges for milestones
- Friend leaderboards by language
- **Complexity:** Intermediate

### 💪 Fitness Tracker

- Workout quest system
- Consistency streak badges
- Weekly challenge leaderboards
- **Complexity:** Beginner

### ✅ Productivity Dashboard

- Points for completed tasks
- Daily/weekly goal quests
- Team leaderboards
- **Complexity:** Beginner

### 🛒 E-commerce Loyalty Program

- Purchase points system
- VIP tier badges
- Referral quests
- **Complexity:** Advanced

### 🎓 Learning Platform

- Course completion badges
- Study streak tracking
- Skill mastery quests
- **Complexity:** Intermediate

### 📱 Social Media Gamification

- Engagement points system
- Influencer badges
- Viral content quests
- **Complexity:** Advanced

**[→ View Full Showcase](https://marquespq.github.io/example-questro/#showcase)**

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

## 🔌 Framework Support

| Framework    | Support       | Notes                          |
| ------------ | ------------- | ------------------------------ |
| React        | ✅ Full       | Complete support               |
| Next.js      | ✅ SSR Ready  | Use MemoryStorage on server    |
| React Native | ✅ Compatible | AsyncStorage adapter available |
| TypeScript   | ✅ Built-in   | Full type definitions included |
| Remix        | ✅ Compatible | Works out of the box           |
| Gatsby       | ✅ Compatible | Works out of the box           |

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 [Report bugs](https://github.com/marquespq/questro/issues)
- 💡 [Suggest features](https://github.com/marquespq/questro/issues/new)
- 📖 [Improve documentation](https://github.com/marquespq/questro)
- 🔧 [Submit pull requests](https://github.com/marquespq/questro/pulls)

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
