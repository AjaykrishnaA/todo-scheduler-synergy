
import React from 'react';
import { Task } from '@/utils/schedulingAlgorithms';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Clock, Code, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: Task;
  index: number;
  onTaskComplete: (id: string, isCompleted: boolean) => void;
  isReordering: boolean;
}

const TaskItem = ({ task, index, onTaskComplete, isReordering }: TaskItemProps) => {
  const handleCheckboxChange = (checked: boolean) => {
    onTaskComplete(task.id, checked);
  };

  // Get relative time to deadline
  const getTimeStatus = () => {
    const now = new Date();
    const diffInHours = (task.deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 0) return { label: "Overdue", className: "bg-destructive text-destructive-foreground" };
    if (diffInHours < 24) return { label: "Due today", className: "bg-orange-500 text-white" };
    if (diffInHours < 48) return { label: "Due tomorrow", className: "bg-amber-500 text-white" };
    return { label: `Due ${format(task.deadline, 'MMM d')}`, className: "bg-primary/80 text-primary-foreground" };
  };

  const timeStatus = getTimeStatus();
  
  const importanceLabels = [
    "Very Low",
    "Low",
    "Medium",
    "High",
    "Critical"
  ];

  // Calculate animation delay based on index and whether reordering
  const animationDelay = isReordering ? `${index * 150}ms` : `${index * 100}ms`;

  return (
    <div 
      className={cn(
        "glass-card rounded-xl p-4 mb-3 transition-all duration-500",
        "group hover:shadow-lg hover:shadow-primary/5",
        "animate-fade-in",
        isReordering && "scale-[0.98] hover:scale-100",
        task.completed ? "opacity-60" : "opacity-100",
      )}
      style={{ animationDelay }}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Checkbox 
            checked={task.completed}
            onCheckedChange={handleCheckboxChange}
            className={cn(
              "h-5 w-5 rounded transition-all duration-300",
              task.completed ? "bg-primary border-primary" : "border-muted-foreground"
            )}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline" className={timeStatus.className}>
              <Clock className="mr-1 h-3 w-3" /> {timeStatus.label}
            </Badge>
            
            <Badge variant="outline" className="bg-secondary text-secondary-foreground">
              <Code className="mr-1 h-3 w-3" /> {task.duration} min
            </Badge>
            
            <Badge variant="outline" className="bg-secondary/80 text-secondary-foreground flex items-center">
              <Star className="mr-1 h-3 w-3 fill-amber-400 stroke-amber-500" /> 
              {importanceLabels[task.importance - 1]}
            </Badge>
          </div>
          
          <h3 className={cn(
            "text-lg font-medium mb-1 transition-all duration-200",
            task.completed ? "line-through text-muted-foreground" : "text-foreground"
          )}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={cn(
              "text-sm text-pretty transition-all duration-200 font-mono",
              task.completed ? "text-muted-foreground/70" : "text-muted-foreground"
            )}>
              {task.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
