
import React from 'react';
import { algorithms, SchedulingAlgorithm } from '@/utils/schedulingAlgorithms';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUp, Calendar, CheckCheck, Clock, GaugeCircle, ListOrdered, Timer } from 'lucide-react';

interface SchedulingAlgorithmsProps {
  onSelectAlgorithm: (algorithm: SchedulingAlgorithm) => void;
  selectedAlgorithmId: string | null;
  taskCount: number;
}

const SchedulingAlgorithms: React.FC<SchedulingAlgorithmsProps> = ({ 
  onSelectAlgorithm, 
  selectedAlgorithmId,
  taskCount
}) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'timer':
        return <Timer className="h-4 w-4" />;
      case 'calendar':
        return <Calendar className="h-4 w-4" />;
      case 'gauge':
        return <GaugeCircle className="h-4 w-4" />;
      case 'list-ordered':
        return <ListOrdered className="h-4 w-4" />;
      case 'arrow-up':
        return <ArrowUp className="h-4 w-4" />;
      case 'timer-reset':
        return <Clock className="h-4 w-4" />;
      default:
        return <CheckCheck className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full mb-6">
      <h2 className="text-lg font-medium mb-3 text-center">Choose a Scheduling Strategy</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {algorithms.map((algorithm) => (
          <Button
            key={algorithm.id}
            variant={selectedAlgorithmId === algorithm.id ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-auto py-3 px-3 flex flex-col items-center gap-2 transition-all duration-300",
              selectedAlgorithmId === algorithm.id 
                ? "border-primary/30 shadow-md" 
                : "border-border hover:border-primary/20",
              taskCount === 0 && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => taskCount > 0 && onSelectAlgorithm(algorithm)}
            disabled={taskCount === 0}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all",
              selectedAlgorithmId === algorithm.id 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            )}>
              {getIconComponent(algorithm.icon)}
            </div>
            <span className="text-xs font-medium text-center">{algorithm.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SchedulingAlgorithms;
