
import React, { useEffect, useState } from 'react';
import { Task } from '@/utils/schedulingAlgorithms';
import TaskItem from './TaskItem';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckIcon, ListChecks } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (id: string, isCompleted: boolean) => void;
  isReordering: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskComplete, isReordering }) => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(false);
  
  // Enable animations after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setMotionEnabled(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const displayTasks = showCompleted ? tasks : incompleteTasks;
  
  // Empty state or loading state
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <ListChecks className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Add your first task to get started, then try different scheduling strategies.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {displayTasks.length > 0 ? (
        <div>
          {motionEnabled ? (
            <AnimatePresence initial={false}>
              {displayTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ 
                    duration: 0.5,
                    delay: isReordering ? index * 0.1 : 0
                  }}
                >
                  <TaskItem 
                    task={task} 
                    index={index} 
                    onTaskComplete={onTaskComplete}
                    isReordering={isReordering}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            displayTasks.map((task, index) => (
              <TaskItem 
                key={task.id}
                task={task} 
                index={index} 
                onTaskComplete={onTaskComplete}
                isReordering={isReordering}
              />
            ))
          )}
        </div>
      ) : (
        <div className="py-6 text-center bg-muted/30 rounded-lg border border-dashed border-muted">
          <CheckIcon className="h-12 w-12 mx-auto text-primary/20 mb-2" />
          <p className="text-sm text-muted-foreground">All tasks completed!</p>
        </div>
      )}
      
      {completedTasks.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={cn(
              "text-sm text-muted-foreground hover:text-foreground transition-colors",
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
              "border border-transparent hover:border-border hover:bg-background",
              showCompleted && "bg-secondary"
            )}
          >
            {showCompleted ? "Hide" : "Show"} completed tasks ({completedTasks.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
