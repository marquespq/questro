import { useEffect, useState, useCallback } from 'react';
import { useQuestsContext } from './context';
import type { Quest } from './types';
import type { EntityId } from '@questro/core';

export interface UseQuestsReturn {
  allQuests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  availableQuests: Quest[];
  startQuest: (questId: EntityId) => void;
  abandonQuest: (questId: EntityId) => void;
  updateProgress: (questId: EntityId, objectiveId: EntityId, progress: number) => void;
  completeObjective: (questId: EntityId, objectiveId: EntityId) => void;
  getQuestById: (questId: EntityId) => Quest | undefined;
  resetQuest: (questId: EntityId) => void;
  addQuest: (quest: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeQuest: (questId: EntityId) => void;
}

export function useQuests(): UseQuestsReturn {
  const { service } = useQuestsContext();
  const [allQuests, setAllQuests] = useState<Quest[]>(service.getAllQuests());
  const [activeQuests, setActiveQuests] = useState<Quest[]>(service.getActiveQuests());
  const [completedQuests, setCompletedQuests] = useState<Quest[]>(service.getCompletedQuests());
  const [availableQuests, setAvailableQuests] = useState<Quest[]>(service.getAvailableQuests());

  useEffect(() => {
    const unsubscribe = service.on('state-changed', () => {
      setAllQuests(service.getAllQuests());
      setActiveQuests(service.getActiveQuests());
      setCompletedQuests(service.getCompletedQuests());
      setAvailableQuests(service.getAvailableQuests());
    });

    return () => unsubscribe();
  }, [service]);

  const startQuest = useCallback(
    (questId: EntityId) => {
      service.startQuest(questId);
    },
    [service],
  );

  const abandonQuest = useCallback(
    (questId: EntityId) => {
      service.abandonQuest(questId);
    },
    [service],
  );

  const updateProgress = useCallback(
    (questId: EntityId, objectiveId: EntityId, progress: number) => {
      service.updateObjectiveProgress(questId, objectiveId, progress);
    },
    [service],
  );

  const completeObjective = useCallback(
    (questId: EntityId, objectiveId: EntityId) => {
      service.completeObjective(questId, objectiveId);
    },
    [service],
  );

  const getQuestById = useCallback(
    (questId: EntityId) => {
      return service.getQuestById(questId);
    },
    [service],
  );

  const resetQuest = useCallback(
    (questId: EntityId) => {
      service.resetQuest(questId);
    },
    [service],
  );

  const addQuest = useCallback(
    (quest: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>) => {
      service.addQuest(quest);
    },
    [service],
  );

  const removeQuest = useCallback(
    (questId: EntityId) => {
      service.removeQuest(questId);
    },
    [service],
  );

  return {
    allQuests,
    activeQuests,
    completedQuests,
    availableQuests,
    startQuest,
    abandonQuest,
    updateProgress,
    completeObjective,
    getQuestById,
    resetQuest,
    addQuest,
    removeQuest,
  };
}
