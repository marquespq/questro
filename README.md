# 🎮 Questro

A lightweight, modular gamification library for React applications.

[![npm version](https://badge.fury.io/js/questro.svg)](https://www.npmjs.com/package/questro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 📖 Documentation

**[View Interactive Documentation →](https://marquespq.github.io/example-questro/)**

Explore all features with live demos, code examples, and interactive components:

- **📊 Points System** - Balance tracking, transactions, and rewards
- **🏆 Badges** - Achievements with progress tracking and rarity tiers
- **🎯 Quests** - Missions with multi-step objectives
- **🏅 Leaderboard** - Rankings and competitive features
- **💾 Storage Adapters** - LocalStorage, SessionStorage, Memory, Custom Backend
- **⚡ Event System** - Real-time notifications and listeners
- **🔌 Integrations** - Next.js, React Native, Tailwind, TypeScript, WebSockets

## ✨ Features

- 🪶 **Extremely Lightweight** - Zero dependencies (except React)
- 🎯 **Tree-shakeable** - Import only what you need
- 🔌 **Pluggable Storage** - Works with localStorage, sessionStorage, or any backend
- 🎨 **Unstyled Components** - Bring your own styles
- 📘 **TypeScript First** - Full type safety out of the box
- ⚡ **Performance Focused** - Optimized for production use
- ♿ **Accessible** - ARIA-compliant components

## 📦 Installation

```bash
npm install questro
```

```bash
yarn add questro
```

```bash
pnpm add questro
```

## 🚀 Quick Start

### Points System

```tsx
import { PointsProvider, usePoints, PointsDisplay } from 'questro/points';
import { LocalStorageAdapter } from 'questro';

function App() {
  return (
    <PointsProvider config={{ userId: 'user-123' }} storage={new LocalStorageAdapter()}>
      <GameContent />
    </PointsProvider>
  );
}

function GameContent() {
  const { balance, addPoints, subtractPoints } = usePoints();

  return (
    <div>
      <h1>Your Points</h1>
      <PointsDisplay />

      <button onClick={() => addPoints(10, { action: 'task-completed' })}>
        Complete Task (+10)
      </button>

      <button onClick={() => subtractPoints(5, { action: 'used-hint' })}>Use Hint (-5)</button>
    </div>
  );
}
```

## 📚 Documentation

### Points Module

The points system allows you to track user points with full transaction history.

#### Configuration

```tsx
interface PointsConfig {
  userId: string;
  initialBalance?: number;
  minBalance?: number;
  maxBalance?: number;
  onBalanceChange?: (balance: number) => void;
}
```

#### Hook API

```tsx
const {
  balance, // Current point balance
  lifetime, // Total points earned (never decreases)
  transactions, // Transaction history
  addPoints, // Add points
  subtractPoints, // Subtract points
  setBalance, // Set exact balance
  reset, // Reset to initial state
} = usePoints();
```

#### Components

**`<PointsDisplay />`** - Display current balance

```tsx
<PointsDisplay format={(balance) => `${balance} pts`} />
```

**`<LifetimePointsDisplay />`** - Display lifetime points

```tsx
<LifetimePointsDisplay />
```

**`<PointsAnimation />`** - Render prop for custom animations

```tsx
<PointsAnimation>
  {(balance, isIncreasing) => (
    <div className={isIncreasing ? 'points-up' : 'points-down'}>{balance}</div>
  )}
</PointsAnimation>
```

## 🎨 Styling

All components are unstyled by default. Add custom styles using:

- CSS classes
- CSS-in-JS libraries (styled-components, emotion, etc.)
- Tailwind CSS
- Inline styles

```tsx
<PointsDisplay className="text-2xl font-bold text-blue-600" style={{ fontSize: '24px' }} />
```

## 💾 Storage Adapters

Questro provides flexible storage options:

### LocalStorage (Default)

```tsx
import { LocalStorageAdapter } from 'questro';

<PointsProvider storage={new LocalStorageAdapter('my-game')} />;
```

### SessionStorage

```tsx
import { SessionStorageAdapter } from 'questro';

<PointsProvider storage={new SessionStorageAdapter('my-game')} />;
```

### Memory (Testing/SSR)

```tsx
import { MemoryStorageAdapter } from 'questro';

<PointsProvider storage={new MemoryStorageAdapter()} />;
```

### Custom Backend

Implement the `StorageAdapter` interface:

```tsx
import type { StorageAdapter } from 'questro';

class APIStorageAdapter<T> implements StorageAdapter<T> {
  async get(key: string): Promise<T | null> {
    const response = await fetch(`/api/storage/${key}`);
    return response.json();
  }

  async set(key: string, value: T): Promise<void> {
    await fetch(`/api/storage/${key}`, {
      method: 'PUT',
      body: JSON.stringify(value),
    });
  }

  async remove(key: string): Promise<void> {
    await fetch(`/api/storage/${key}`, { method: 'DELETE' });
  }

  async clear(): Promise<void> {
    await fetch('/api/storage', { method: 'DELETE' });
  }
}
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build library
npm run build

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

## 📋 Roadmap

- [x] Points System
- [ ] Badges/Achievements System
- [ ] Quests/Missions System
- [ ] Leaderboard/Ranking System
- [ ] Storybook Documentation
- [ ] Example Applications

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Gabriel Marques](https://github.com/marquespq)

## 🌟 Show Your Support

If you find Questro useful, please consider giving it a ⭐️ on [GitHub](https://github.com/marquespq/questro)!
