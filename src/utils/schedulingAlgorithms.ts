
export interface Task {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  importance: number; // 1-5 scale
  deadline: Date;
  completed: boolean;
  createdAt: Date;
}

// Shortest Processing Time (SPT) - Sorts tasks by duration (shortest first)
export const shortestProcessingTime = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => a.duration - b.duration);
};

// Earliest Deadline First (EDF) - Sorts tasks by deadline (earliest first)
export const earliestDeadlineFirst = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
};

// Weighted Shortest Processing Time (WSPT) - Consider both duration and importance
export const weightedShortestProcessingTime = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const ratioA = a.importance / a.duration;
    const ratioB = b.importance / b.duration;
    return ratioB - ratioA; // Higher ratio first
  });
};

// First-Come-First-Served (FCFS) - Sort by creation time
export const firstComeFirstServed = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

// Highest Priority First (HPF) - Sort by importance level
export const highestPriorityFirst = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => b.importance - a.importance);
};

// Critical Ratio (CR) - Balance of deadline proximity and processing time
export const criticalRatio = (tasks: Task[]): Task[] => {
  const now = new Date();
  return [...tasks].sort((a, b) => {
    const timeLeftA = a.deadline.getTime() - now.getTime();
    const timeLeftB = b.deadline.getTime() - now.getTime();
    const ratioA = timeLeftA / (a.duration * 60 * 1000); // Convert minutes to ms
    const ratioB = timeLeftB / (b.duration * 60 * 1000);
    return ratioA - ratioB; // Lower ratio first (more critical)
  });
};

export type SchedulingAlgorithm = {
  id: string;
  name: string;
  description: string;
  algorithm: (tasks: Task[]) => Task[];
  bestFor: string[];
  limitations: string[];
  icon: string;
};

export const algorithms: SchedulingAlgorithm[] = [
  {
    id: "spt",
    name: "Shortest Processing Time",
    description: "Sort tasks from shortest to longest duration",
    algorithm: shortestProcessingTime,
    bestFor: [
      "Maximizing the number of completed tasks",
      "When all tasks have similar importance",
      "When you want to build momentum with quick wins"
    ],
    limitations: [
      "Important tasks might be delayed if they take longer",
      "Doesn't consider deadlines"
    ],
    icon: "timer"
  },
  {
    id: "edf",
    name: "Earliest Deadline First",
    description: "Prioritize tasks with the closest deadlines",
    algorithm: earliestDeadlineFirst,
    bestFor: [
      "Meeting important deadlines",
      "Time-sensitive projects",
      "When late tasks have significant consequences"
    ],
    limitations: [
      "Short tasks might be delayed despite being quick wins",
      "Doesn't consider importance directly"
    ],
    icon: "calendar"
  },
  {
    id: "wspt",
    name: "Weighted Shortest Job First",
    description: "Balance duration with importance for optimal value delivery",
    algorithm: weightedShortestProcessingTime,
    bestFor: [
      "Balancing efficiency with importance",
      "Maximizing value per time spent",
      "Mixed priority environments"
    ],
    limitations: [
      "Complexity in calculating the perfect weight between factors",
      "May not respect hard deadlines"
    ],
    icon: "gauge"
  },
  {
    id: "fcfs",
    name: "First Come First Served",
    description: "Complete tasks in the order they were added",
    algorithm: firstComeFirstServed,
    bestFor: [
      "Sequential dependencies",
      "When fairness in order is important",
      "Simple workflows"
    ],
    limitations: [
      "No optimization for importance or urgency",
      "Can be inefficient for time management"
    ],
    icon: "list-ordered"
  },
  {
    id: "hpf",
    name: "Highest Priority First",
    description: "Tackle the most important tasks first",
    algorithm: highestPriorityFirst,
    bestFor: [
      "When task importance varies significantly",
      "High-value deliverables",
      "Strategic prioritization"
    ],
    limitations: [
      "May ignore quick wins",
      "Doesn't consider deadlines directly"
    ],
    icon: "arrow-up"
  },
  {
    id: "cr",
    name: "Critical Ratio",
    description: "Balance deadline proximity with processing time",
    algorithm: criticalRatio,
    bestFor: [
      "Complex project management",
      "Balancing deadline and duration",
      "Managing time-sensitive workloads"
    ],
    limitations: [
      "More complex to understand",
      "Requires accurate duration estimates"
    ],
    icon: "timer-reset"
  }
];
