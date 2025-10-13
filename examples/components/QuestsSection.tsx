import { useQuests, QuestCard, QuestStats } from "questro/quests";
import { styles } from "../styles/appStyles";

export function QuestsSection() {
  const {
    availableQuests,
    activeQuests,
    completedQuests,
    startQuest,
    abandonQuest,
  } = useQuests();

  return (
    <div style={styles.moduleSection}>
      <div style={styles.moduleDemo}>
        <div style={styles.demoCard}>
          <div style={styles.demoHeader}>
            <h3 style={styles.demoTitle}>Try Quest System</h3>
            <QuestStats
              activeCount={activeQuests.length}
              completedCount={completedQuests.length}
              availableCount={availableQuests.length}
            />
          </div>

          <div style={styles.questsContainer}>
            {availableQuests.length > 0 && (
              <QuestCard
                quest={availableQuests[0]}
                onStart={() => startQuest(availableQuests[0].id)}
                showActions
              />
            )}
            {activeQuests.length > 0 && (
              <QuestCard
                quest={activeQuests[0]}
                onAbandon={() => abandonQuest(activeQuests[0].id)}
                showActions
              />
            )}
          </div>
        </div>
      </div>

      <div style={styles.moduleCode}>
        <h3 style={styles.codeTitle}>Components</h3>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>QuestCard</div>
          <pre style={styles.codeSnippet}>{`<QuestCard 
  quest={quest}
  onStart={() => startQuest(quest.id)}
  showActions
/>`}</pre>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>QuestList</div>
          <pre style={styles.codeSnippet}>{`<QuestList 
  quests={quests}
  onQuestStart={startQuest}
  onQuestAbandon={abandonQuest}
/>`}</pre>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>QuestStats</div>
          <pre style={styles.codeSnippet}>{`<QuestStats 
  activeCount={3}
  completedCount={10}
  availableCount={5}
/>`}</pre>
        </div>

        <div style={styles.codeBlock}>
          <div style={styles.codeLabel}>useQuests Hook</div>
          <pre
            style={styles.codeSnippet}
          >{`const { startQuest, updateProgress } = useQuests();

// Start a quest
startQuest('quest-id');

// Update objective progress
updateProgress('quest-id', 'objective-id', 5);`}</pre>
        </div>
      </div>
    </div>
  );
}
