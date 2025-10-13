import { generateId, now } from "questro";
import type { Badge } from "questro/badges";
import type { Quest } from "questro/quests";
import type { LeaderboardEntry } from "questro/leaderboard";

export const userId = "demo-user";

export const badges: Badge[] = [
  {
    id: generateId(),
    name: "Getting Started",
    description: "Complete your first action",
    icon: "🎯",
    rarity: "common",
    category: "achievement",
    conditions: [{ type: "actions-completed", value: 1 }],
    points: 10,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    name: "Rising Star",
    description: "Earn 100 points",
    icon: "⭐",
    rarity: "uncommon",
    category: "achievement",
    conditions: [{ type: "points-earned", value: 100 }],
    points: 25,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    name: "On Fire",
    description: "Complete 5 actions in a row",
    icon: "🔥",
    rarity: "rare",
    category: "streak",
    conditions: [{ type: "streak-count", value: 5 }],
    points: 50,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    name: "Legend",
    description: "Reach level 10",
    icon: "👑",
    rarity: "epic",
    category: "level",
    conditions: [{ type: "level-reached", value: 10 }],
    points: 100,
    createdAt: now(),
    updatedAt: now(),
  },
];

export const quests: Quest[] = [
  {
    id: generateId(),
    title: "Getting Started",
    description: "Complete your first actions",
    icon: "🎯",
    difficulty: "easy",
    recurrence: "one-time",
    status: "available",
    objectives: [
      {
        id: generateId(),
        description: "Earn 50 points",
        target: 50,
        current: 0,
        completed: false,
      },
      {
        id: generateId(),
        description: "Unlock a badge",
        target: 1,
        current: 0,
        completed: false,
      },
    ],
    rewards: { points: 25 },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    title: "Daily Challenge",
    description: "Complete daily objectives",
    icon: "📅",
    difficulty: "medium",
    recurrence: "daily",
    status: "available",
    objectives: [
      {
        id: generateId(),
        description: "Earn 100 points today",
        target: 100,
        current: 0,
        completed: false,
      },
    ],
    rewards: { points: 50, badgeId: badges[1].id },
    createdAt: now(),
    updatedAt: now(),
  },
];

export const leaderboardEntries: LeaderboardEntry[] = [
  {
    userId: "user-1",
    username: "Alice",
    score: 1250,
    rank: 1,
    updatedAt: now(),
  },
  {
    userId: "user-2",
    username: "Bob",
    score: 980,
    rank: 2,
    updatedAt: now(),
  },
  {
    userId: "user-3",
    username: "Charlie",
    score: 875,
    rank: 3,
    updatedAt: now(),
  },
  {
    userId: "user-4",
    username: "Diana",
    score: 720,
    rank: 4,
    updatedAt: now(),
  },
  {
    userId,
    username: "You",
    score: 0,
    rank: 5,
    updatedAt: now(),
  },
];
