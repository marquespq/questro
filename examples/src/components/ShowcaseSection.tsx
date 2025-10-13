import { useState } from "react";

type ShowcaseApp = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  gradient: string;
  features: string[];
  stats: {
    users?: string;
    points?: string;
    badges?: string;
  };
  complexity: "beginner" | "intermediate" | "advanced";
  tags: string[];
  preview: string;
};

export function ShowcaseSection() {
  const [selectedApp, setSelectedApp] = useState<string>("language-learning");

  const showcaseApps: ShowcaseApp[] = [
    {
      id: "language-learning",
      name: "Language Learning App",
      description:
        "Duolingo-style gamification with daily streaks, XP, and achievements",
      thumbnail: "🗣️",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      features: [
        "Daily streak tracking with flame icons",
        "XP points for completed lessons",
        "Achievement badges for milestones",
        "Friend leaderboards by language",
        "Daily quest challenges",
      ],
      stats: {
        users: "10K+ learners",
        points: "5M+ XP earned",
        badges: "50+ achievements",
      },
      complexity: "intermediate",
      tags: ["Education", "Daily Streaks", "Multiplayer"],
      preview: `// Daily Streak Example
import { usePoints, useBadges } from 'questro';

function LessonComplete() {
  const { addPoints } = usePoints();
  const { updateProgress } = useBadges();
  
  const completeLesson = () => {
    // Award XP
    addPoints(10, { 
      action: 'lesson-complete',
      description: 'Completed Spanish Lesson 5' 
    });
    
    // Update streak badge
    updateProgress('daily-streak-badge', currentStreak + 1);
  };
}`,
    },
    {
      id: "fitness-tracker",
      name: "Fitness Tracker",
      description: "Track workouts with motivating gamification mechanics",
      thumbnail: "💪",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      features: [
        "Workout quest system (cardio, strength, yoga)",
        "Streak badges for consistency",
        "Weight/distance milestone badges",
        "Weekly challenge leaderboards",
        "Achievement notifications",
      ],
      stats: {
        users: "5K+ athletes",
        points: "100K+ workouts logged",
        badges: "30+ fitness goals",
      },
      complexity: "beginner",
      tags: ["Health", "Fitness", "Challenges"],
      preview: `// Workout Quest Example
import { useQuests, usePoints } from 'questro';

function WorkoutLogger() {
  const { updateProgress, activeQuests } = useQuests();
  const { addPoints } = usePoints();
  
  const logWorkout = (type: 'cardio' | 'strength', duration: number) => {
    // Update quest progress
    const quest = activeQuests.find(q => q.type === type);
    if (quest) {
      updateProgress(quest.id, quest.objectives[0].id, duration);
    }
    
    // Award points
    addPoints(duration * 10, { 
      action: 'workout-logged' 
    });
  };
}`,
    },
    {
      id: "productivity",
      name: "Productivity Dashboard",
      description: "Gamified todo app that makes getting things done fun",
      thumbnail: "✅",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      features: [
        "Points for completed tasks",
        "Daily/weekly goal quests",
        "Productivity streak badges",
        "Focus time tracking",
        "Team leaderboards",
      ],
      stats: {
        users: "8K+ productive users",
        points: "2M+ tasks completed",
        badges: "25+ productivity badges",
      },
      complexity: "beginner",
      tags: ["Productivity", "Tasks", "Teams"],
      preview: `// Task Completion Example
import { usePoints, useQuests } from 'questro';

function TaskItem({ task }) {
  const { addPoints } = usePoints();
  const { updateProgress } = useQuests();
  
  const completeTask = () => {
    // Points based on priority
    const points = task.priority === 'high' ? 50 : 
                   task.priority === 'medium' ? 25 : 10;
    addPoints(points, { 
      action: 'task-complete',
      taskId: task.id 
    });
    
    // Update daily quest
    updateProgress('daily-tasks-quest', 'complete-5-tasks', 1);
  };
}`,
    },
    {
      id: "ecommerce",
      name: "E-commerce Loyalty",
      description: "Customer loyalty program with tiers and rewards",
      thumbnail: "🛒",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      features: [
        "Purchase points system",
        "Tier badges (Bronze, Silver, Gold, Platinum)",
        "Referral quests with bonuses",
        "VIP customer leaderboard",
        "Birthday/anniversary badges",
      ],
      stats: {
        users: "50K+ customers",
        points: "10M+ loyalty points",
        badges: "15+ tier levels",
      },
      complexity: "intermediate",
      tags: ["E-commerce", "Loyalty", "Rewards"],
      preview: `// Purchase Points Example
import { usePoints, useBadges } from 'questro';

function CheckoutSuccess({ order }) {
  const { addPoints } = usePoints();
  const { updateProgress, checkAndUnlockBadges } = useBadges();
  
  useEffect(() => {
    // Award points (1 point per $1)
    addPoints(order.total, { 
      action: 'purchase',
      orderId: order.id 
    });
    
    // Update spending tier badge
    updateProgress('vip-tier-badge', order.totalLifetime);
    checkAndUnlockBadges();
  }, [order]);
}`,
    },
    {
      id: "social-media",
      name: "Social Media App",
      description: "Engagement-driven social platform with gamification",
      thumbnail: "📱",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      features: [
        "Post interaction points (likes, comments, shares)",
        "Influencer badges by follower count",
        "Viral content quests",
        "Top creators leaderboard",
        "Monthly challenge events",
      ],
      stats: {
        users: "100K+ creators",
        points: "50M+ interactions",
        badges: "40+ creator levels",
      },
      complexity: "advanced",
      tags: ["Social", "Content", "Viral"],
      preview: `// Social Engagement Example
import { usePoints, useLeaderboard } from 'questro';

function PostInteraction({ post, action }) {
  const { addPoints } = usePoints();
  const { updateScore } = useLeaderboard();
  
  const handleInteraction = () => {
    const pointsMap = {
      like: 1,
      comment: 5,
      share: 10,
    };
    
    const points = pointsMap[action];
    addPoints(points, { 
      action: \`post-\${action}\`,
      postId: post.id 
    });
    
    // Update creator leaderboard
    updateScore(post.authorId, points);
  };
}`,
    },
    {
      id: "learning-platform",
      name: "Online Course Platform",
      description:
        "Learning platform with progress tracking and certifications",
      thumbnail: "🎓",
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      features: [
        "Course completion badges",
        "Quiz/test point rewards",
        "Study streak tracking",
        "Skill mastery quests",
        "Student leaderboards by course",
      ],
      stats: {
        users: "25K+ students",
        points: "5M+ lessons completed",
        badges: "100+ certifications",
      },
      complexity: "intermediate",
      tags: ["Education", "Courses", "Certificates"],
      preview: `// Course Progress Example
import { useQuests, useBadges } from 'questro';

function CourseModule({ course, module }) {
  const { updateProgress } = useQuests();
  const { unlockBadge } = useBadges();
  
  const completeModule = () => {
    // Update course quest
    updateProgress(
      \`course-\${course.id}\`, 
      \`module-\${module.id}\`, 
      1
    );
    
    // Unlock certificate badge if course complete
    if (course.progress === 100) {
      unlockBadge(\`certificate-\${course.id}\`);
    }
  };
}`,
    },
  ];

  const selected = showcaseApps.find((app) => app.id === selectedApp)!;

  const complexityColors = {
    beginner: "#10b981",
    intermediate: "#f59e0b",
    advanced: "#ef4444",
  };

  return (
    <div className="module-section">
      <div className="module-demo">
        <div className="demo-card">
          <div className="demo-header">
            <h3 className="demo-title">Built With Questro</h3>
            <div className="demo-badge">Real-World Apps</div>
          </div>

          {/* Hero Message */}
          <div
            style={{
              marginBottom: "32px",
              padding: "24px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "16px",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🚀</div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "8px",
                margin: 0,
              }}
            >
              Build Amazing Apps
            </h2>
            <p style={{ fontSize: "16px", opacity: 0.9, margin: "8px 0 0 0" }}>
              See how developers are using Questro to create engaging, gamified
              experiences
            </p>
          </div>

          {/* App Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {showcaseApps.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app.id)}
                style={{
                  padding: "0",
                  background: selectedApp === app.id ? app.gradient : "#fff",
                  border: `3px solid ${
                    selectedApp === app.id ? "transparent" : "#e2e8f0"
                  }`,
                  borderRadius: "16px",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  overflow: "hidden",
                  boxShadow:
                    selectedApp === app.id
                      ? "0 10px 30px rgba(0,0,0,0.15)"
                      : "0 2px 8px rgba(0,0,0,0.05)",
                  transform:
                    selectedApp === app.id ? "scale(1.02)" : "scale(1)",
                }}
              >
                <div
                  style={{
                    padding: "20px",
                    background:
                      selectedApp === app.id
                        ? "rgba(255,255,255,0.95)"
                        : "#fff",
                    backdropFilter:
                      selectedApp === app.id ? "blur(10px)" : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "start",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "40px",
                        marginRight: "12px",
                        filter:
                          selectedApp === app.id ? "none" : "grayscale(50%)",
                      }}
                    >
                      {app.thumbnail}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "#0f172a",
                          marginBottom: "4px",
                        }}
                      >
                        {app.name}
                      </div>
                      <div
                        style={{
                          display: "inline-block",
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          backgroundColor: complexityColors[app.complexity],
                          color: "#fff",
                          textTransform: "uppercase",
                        }}
                      >
                        {app.complexity}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      lineHeight: "1.5",
                      marginBottom: "12px",
                    }}
                  >
                    {app.description}
                  </div>
                  <div
                    style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                  >
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "11px",
                          padding: "3px 8px",
                          backgroundColor: "#f1f5f9",
                          color: "#475569",
                          borderRadius: "4px",
                          fontWeight: 600,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected App Details */}
          <div
            style={{
              padding: "32px",
              background: selected.gradient,
              borderRadius: "20px",
              color: "#fff",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div style={{ fontSize: "64px", marginRight: "20px" }}>
                {selected.thumbnail}
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    margin: "0 0 8px 0",
                  }}
                >
                  {selected.name}
                </h3>
                <p style={{ fontSize: "16px", opacity: 0.95, margin: 0 }}>
                  {selected.description}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {Object.entries(selected.stats).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    padding: "16px",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      opacity: 0.9,
                      textTransform: "uppercase",
                    }}
                  >
                    {key}
                  </div>
                </div>
              ))}
            </div>

            {/* Screenshot Preview */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                App Preview
              </div>
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  minHeight: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}screenshots/${
                    selected.id
                  }.svg`}
                  alt={`${selected.name} Screenshot`}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    display: "block",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector(".fallback-text")) {
                      const fallback = document.createElement("div");
                      fallback.className = "fallback-text";
                      fallback.style.cssText =
                        "color: rgba(255,255,255,0.8); text-align: center; font-size: 14px;";
                      fallback.textContent = `Preview image not found`;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            </div>

            {/* Features */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Key Features
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {selected.features.map((feature, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        marginRight: "12px",
                      }}
                    />
                    <div style={{ fontSize: "14px", opacity: 0.95 }}>
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="module-code">
        <h3 className="code-title">Implementation Example</h3>

        <div className="code-block">
          <div className="code-label">{selected.name} - Code Sample</div>
          <pre
            className="code-snippet"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {selected.preview}
          </pre>
        </div>

        <div className="code-block">
          <div className="code-label">Quick Start Template</div>
          <pre className="code-snippet">{`// 1. Install Questro
npm install questro

// 2. Wrap your app with providers
import { PointsProvider, BadgesProvider } from 'questro';

function App() {
  return (
    <PointsProvider config={{ userId: 'user-123' }}>
      <BadgesProvider config={{ userId: 'user-123', badges }}>
        <YourApp />
      </BadgesProvider>
    </PointsProvider>
  );
}

// 3. Use hooks in components
import { usePoints, useBadges } from 'questro';

function YourFeature() {
  const { addPoints } = usePoints();
  const { unlockBadge } = useBadges();
  
  // Add your gamification logic here!
}`}</pre>
        </div>

        <div className="code-block">
          <div className="code-label">Want to Build This?</div>
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
                fontSize: "14px",
                color: "#0f172a",
                marginBottom: "16px",
              }}
            >
              <strong>Get started in 3 steps:</strong>
            </div>
            <ol
              style={{
                margin: 0,
                paddingLeft: "20px",
                fontSize: "14px",
                color: "#64748b",
                lineHeight: "1.8",
              }}
            >
              <li>
                <code>npm install questro</code>
              </li>
              <li>
                Choose which modules you need (Points, Badges, Quests,
                Leaderboard)
              </li>
              <li>Start building! Check our docs for detailed guides</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
