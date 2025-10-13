import { createEventEmitter, generateId, now } from '@questro/core';
import type { Quest, QuestsState, QuestsConfig, QuestsService, QuestsEvents } from './types';
import type { EntityId, Result } from '@questro/core';

export class QuestsServiceImpl implements QuestsService {
  private state: QuestsState;
  private config: { maxActiveQuests: number; autoStartQuests: boolean };
  public readonly events = createEventEmitter<QuestsEvents>();

  constructor(initialQuests: Quest[] = [], config: QuestsConfig = {}) {
    this.config = {
      maxActiveQuests: config.maxActiveQuests ?? 5,
      autoStartQuests: config.autoStartQuests ?? false,
    };

    this.state = {
      quests: [...initialQuests],
      activeQuests: initialQuests.filter((q) => q.status === 'in-progress'),
      completedQuests: initialQuests.filter((q) => q.status === 'completed'),
      lastUpdated: now(),
    };

    this.checkExpiredQuests();
  }

  on = this.events.on;
  emit = this.events.emit;

  private notifyStateChange(): void {
    this.state.lastUpdated = now();
    this.emit('state-changed', this.state);
  }

  private checkExpiredQuests(): void {
    const currentTime = now();
    const expiredQuests: Quest[] = [];

    this.state.quests.forEach((quest) => {
      if (quest.status === 'in-progress' && quest.expiresAt && quest.expiresAt < currentTime) {
        quest.status = 'expired';
        quest.updatedAt = currentTime;
        expiredQuests.push(quest);
      }
    });

    if (expiredQuests.length > 0) {
      this.state.activeQuests = this.state.activeQuests.filter(
        (q) => !expiredQuests.some((eq) => eq.id === q.id),
      );
      expiredQuests.forEach((quest) => this.emit('quest-expired', quest));
      this.notifyStateChange();
    }
  }

  getState(): QuestsState {
    return {
      quests: [...this.state.quests],
      activeQuests: [...this.state.activeQuests],
      completedQuests: [...this.state.completedQuests],
      lastUpdated: this.state.lastUpdated,
    };
  }

  getAllQuests(): Quest[] {
    return [...this.state.quests];
  }

  getQuestById(id: EntityId): Quest | undefined {
    return this.state.quests.find((q) => q.id === id);
  }

  getActiveQuests(): Quest[] {
    this.checkExpiredQuests();
    return [...this.state.activeQuests];
  }

  getCompletedQuests(): Quest[] {
    return [...this.state.completedQuests];
  }

  getAvailableQuests(): Quest[] {
    return this.state.quests.filter((q) => q.status === 'available');
  }

  startQuest(questId: EntityId): Result<Quest> {
    const quest = this.state.quests.find((q) => q.id === questId);

    if (!quest) {
      return { success: false, error: new Error('Quest not found') };
    }

    if (quest.status !== 'available') {
      return { success: false, error: new Error('Quest is not available') };
    }

    if (this.state.activeQuests.length >= this.config.maxActiveQuests) {
      return { success: false, error: new Error('Maximum active quests reached') };
    }

    quest.status = 'in-progress';
    quest.startDate = now();
    quest.updatedAt = now();
    this.state.activeQuests.push(quest);

    this.emit('quest-started', quest);
    this.notifyStateChange();

    return { success: true, data: quest };
  }

  updateObjectiveProgress(
    questId: EntityId,
    objectiveId: EntityId,
    progress: number,
  ): Result<Quest> {
    const quest = this.state.quests.find((q) => q.id === questId);

    if (!quest) {
      return { success: false, error: new Error('Quest not found') };
    }

    if (quest.status !== 'in-progress') {
      return { success: false, error: new Error('Quest is not in progress') };
    }

    const objective = quest.objectives.find((o) => o.id === objectiveId);
    if (!objective) {
      return { success: false, error: new Error('Objective not found') };
    }

    if (objective.completed) {
      return { success: false, error: new Error('Objective already completed') };
    }

    objective.current = Math.min(progress, objective.target);

    if (objective.current >= objective.target) {
      objective.completed = true;
      this.emit('objective-completed', { quest, objective });
    }

    quest.updatedAt = now();
    this.emit('objective-progress', { quest, objective });
    this.notifyStateChange();

    this.checkQuestCompletion(questId);

    return { success: true, data: quest };
  }

  completeObjective(questId: EntityId, objectiveId: EntityId): Result<Quest> {
    const quest = this.state.quests.find((q) => q.id === questId);
    if (!quest) {
      return { success: false, error: new Error('Quest not found') };
    }

    const objective = quest.objectives.find((o) => o.id === objectiveId);
    if (!objective) {
      return { success: false, error: new Error('Objective not found') };
    }

    return this.updateObjectiveProgress(questId, objectiveId, objective.target);
  }

  checkQuestCompletion(questId: EntityId): Result<Quest> {
    const quest = this.state.quests.find((q) => q.id === questId);

    if (!quest) {
      return { success: false, error: new Error('Quest not found') };
    }

    if (quest.status !== 'in-progress') {
      return { success: true, data: quest };
    }

    const allObjectivesCompleted = quest.objectives.every((obj) => obj.completed);

    if (allObjectivesCompleted) {
      quest.status = 'completed';
      quest.completedAt = now();
      quest.updatedAt = now();
      this.state.activeQuests = this.state.activeQuests.filter((q) => q.id !== questId);
      this.state.completedQuests.push(quest);

      this.emit('quest-completed', quest);
      this.notifyStateChange();
    }

    return { success: true, data: quest };
  }

  abandonQuest(questId: EntityId): Result<Quest> {
    const quest = this.state.quests.find((q) => q.id === questId);

    if (!quest) {
      return { success: false, error: new Error('Quest not found') };
    }

    if (quest.status !== 'in-progress') {
      return { success: false, error: new Error('Quest is not in progress') };
    }

    quest.status = 'failed';
    quest.updatedAt = now();
    this.state.activeQuests = this.state.activeQuests.filter((q) => q.id !== questId);

    this.emit('quest-failed', quest);
    this.notifyStateChange();

    return { success: true, data: quest };
  }

  resetQuest(questId: EntityId): Result<Quest> {
    const quest = this.state.quests.find((q) => q.id === questId);

    if (!quest) {
      return { success: false, error: new Error('Quest not found') };
    }

    quest.status = 'available';
    quest.objectives.forEach((obj) => {
      obj.current = 0;
      obj.completed = false;
    });
    quest.startDate = undefined;
    quest.completedAt = undefined;
    quest.updatedAt = now();
    this.state.activeQuests = this.state.activeQuests.filter((q) => q.id !== questId);
    this.state.completedQuests = this.state.completedQuests.filter((q) => q.id !== questId);

    this.notifyStateChange();

    return { success: true, data: quest };
  }

  addQuest(questData: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>): Result<Quest> {
    const quest: Quest = {
      ...questData,
      id: generateId(),
      createdAt: now(),
      updatedAt: now(),
    };

    this.state.quests.push(quest);
    if (quest.status === 'in-progress') {
      this.state.activeQuests.push(quest);
    } else if (quest.status === 'completed') {
      this.state.completedQuests.push(quest);
    }

    this.notifyStateChange();

    if (this.config.autoStartQuests && quest.status === 'available') {
      return this.startQuest(quest.id);
    }

    return { success: true, data: quest };
  }

  removeQuest(questId: EntityId): Result<boolean> {
    const questExists = this.state.quests.some((q) => q.id === questId);

    if (!questExists) {
      return { success: false, error: new Error('Quest not found') };
    }

    this.state.quests = this.state.quests.filter((q) => q.id !== questId);
    this.state.activeQuests = this.state.activeQuests.filter((q) => q.id !== questId);
    this.state.completedQuests = this.state.completedQuests.filter((q) => q.id !== questId);

    this.notifyStateChange();

    return { success: true, data: true };
  }

  reset(): void {
    this.state = {
      quests: [],
      activeQuests: [],
      completedQuests: [],
      lastUpdated: now(),
    };
    this.notifyStateChange();
  }
}
