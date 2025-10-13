import type { EntityId, Timestamp, EventEmitter, Result } from '@questro/core';

export type QuestStatus = 'available' | 'in-progress' | 'completed' | 'failed' | 'expired';

export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type QuestRecurrence = 'daily' | 'weekly' | 'monthly' | 'one-time';

export interface QuestObjective {
  id: EntityId;
  description: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface QuestReward {
  points?: number;
  badgeId?: EntityId;
  customReward?: Record<string, unknown>;
}

export interface Quest {
  id: EntityId;
  title: string;
  description: string;
  icon?: string;
  difficulty: QuestDifficulty;
  recurrence: QuestRecurrence;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards: QuestReward;
  startDate?: Timestamp;
  endDate?: Timestamp;
  expiresAt?: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface QuestsState {
  quests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  lastUpdated: Timestamp;
}

export interface QuestsConfig {
  maxActiveQuests?: number;
  storageKey?: string;
  autoStartQuests?: boolean;
  persistState?: boolean;
}

export type QuestsEvents = {
  'quest-started': Quest;
  'quest-completed': Quest;
  'quest-failed': Quest;
  'quest-expired': Quest;
  'objective-progress': { quest: Quest; objective: QuestObjective };
  'objective-completed': { quest: Quest; objective: QuestObjective };
  'state-changed': QuestsState;
};

export interface QuestsService extends EventEmitter<QuestsEvents> {
  getState(): QuestsState;
  getAllQuests(): Quest[];
  getQuestById(id: EntityId): Quest | undefined;
  getActiveQuests(): Quest[];
  getCompletedQuests(): Quest[];
  getAvailableQuests(): Quest[];
  startQuest(questId: EntityId): Result<Quest>;
  updateObjectiveProgress(
    questId: EntityId,
    objectiveId: EntityId,
    progress: number
  ): Result<Quest>;
  completeObjective(questId: EntityId, objectiveId: EntityId): Result<Quest>;
  checkQuestCompletion(questId: EntityId): Result<Quest>;
  abandonQuest(questId: EntityId): Result<Quest>;
  resetQuest(questId: EntityId): Result<Quest>;
  addQuest(quest: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>): Result<Quest>;
  removeQuest(questId: EntityId): Result<boolean>;
  reset(): void;
}
