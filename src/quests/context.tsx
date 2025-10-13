import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { QuestsServiceImpl } from './service';
import type { Quest, QuestsConfig, QuestsService } from './types';

interface QuestsContextValue {
  service: QuestsService;
}

const QuestsContext = createContext<QuestsContextValue | null>(null);

export interface QuestsProviderProps {
  children: ReactNode;
  quests?: Quest[];
  config?: QuestsConfig;
}

export function QuestsProvider({ children, quests = [], config = {} }: QuestsProviderProps) {
  const service = useMemo(() => new QuestsServiceImpl(quests, config), []);

  const value = useMemo(() => ({ service }), [service]);

  return <QuestsContext.Provider value={value}>{children}</QuestsContext.Provider>;
}

export function useQuestsContext(): QuestsContextValue {
  const context = useContext(QuestsContext);
  if (!context) {
    throw new Error('useQuestsContext must be used within QuestsProvider');
  }
  return context;
}
