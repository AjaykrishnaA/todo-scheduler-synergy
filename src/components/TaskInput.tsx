
import React, { useState } from 'react';
import { Task } from '@/utils/schedulingAlgorithms';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

interface TaskInputProps {
  onAddTask: (task: Task) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [importance, setImportance] = useState(3);
  const [deadline, setDeadline] = useState<Date>(new Date(Date.now() + 24 * 60 * 60 * 1000)); // tomorrow

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim() || undefined,
      duration,
      importance,
      deadline,
      completed: false,
      createdAt: new Date()
    };
    
    onAddTask(newTask);
    
    // Reset the form
    setTitle('');
    setDescription('');
    setDuration(30);
    setImportance(3);
    setDeadline(new Date(Date.now() + 24 * 60 * 60 * 1000));
    
    // Collapse the form after submission
    setIsExpanded(false);
    
    toast.success('Task added successfully');
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setTitle('');
    setDescription('');
  };

  const importanceMarks = [
    { value: 1, label: 'Very Low' },
    { value: 2, label: 'Low' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'High' },
    { value: 5, label: 'Critical' }
  ];

  const renderImportanceValue = (value: number) => {
    const mark = importanceMarks.find(m => m.value === value);
    return mark ? mark.label : '';
  };

  return (
    <Card className={cn(
      "w-full bg-background/95 backdrop-blur transition-all duration-500 overflow-hidden shadow-md border border-border/50",
      isExpanded ? "max-h-[600px]" : "hover:shadow-lg"
    )}>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary transition-all",
              isExpanded && "animate-pulse-subtle"
            )}>
              <Plus size={18} />
            </div>
            <Input
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={handleFocus}
              className="flex-1 border-none bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            />
          </div>
          
          {isExpanded && (
            <div className="space-y-6 animate-scale-in pt-2">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add details about this task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium">
                  Estimated Duration (minutes): {duration}
                </Label>
                <Slider
                  id="duration"
                  min={5}
                  max={180}
                  step={5}
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  className="py-4"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="importance" className="text-sm font-medium">
                  Importance: {renderImportanceValue(importance)}
                </Label>
                <div className="py-6 px-1">
                  <Slider
                    id="importance"
                    min={1}
                    max={5}
                    step={1}
                    value={[importance]}
                    onValueChange={(value) => setImportance(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    {importanceMarks.map((mark) => (
                      <div key={mark.value} className="flex flex-col items-center">
                        {mark.value === importance && (
                          <Star className="h-3 w-3 mb-1 fill-amber-400 stroke-amber-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-sm font-medium">Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="deadline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, 'PPP') : 'Select a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={(date) => date && setDeadline(date)}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  className="btn-hover-effect btn-active-effect"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="btn-hover-effect btn-active-effect"
                >
                  Add Task
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskInput;
