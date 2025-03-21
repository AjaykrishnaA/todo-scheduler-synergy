import React, { useState, useEffect } from 'react';
import { Task, SchedulingAlgorithm, algorithms } from '@/utils/schedulingAlgorithms';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import SchedulingAlgorithms from '@/components/SchedulingAlgorithms';
import AlgorithmInfo from '@/components/AlgorithmInfo';
import { Button } from '@/components/ui/button';
import { ArrowDown, ClipboardList, InfoIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SchedulingAlgorithm | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        const convertedTasks = parsedTasks.map((task: any) => ({
          ...task,
          deadline: new Date(task.deadline),
          createdAt: new Date(task.createdAt)
        }));
        setTasks(convertedTasks);
        setDisplayedTasks(convertedTasks);
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const handleAddTask = (newTask: Task) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setDisplayedTasks(updatedTasks);
    setSelectedAlgorithm(null);
  };
  
  const handleTaskComplete = (id: string, isCompleted: boolean) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: isCompleted } : task
    );
    setTasks(updatedTasks);
    setDisplayedTasks(updatedTasks);
  };
  
  const handleSelectAlgorithm = (algorithm: SchedulingAlgorithm) => {
    if (tasks.length === 0) return;
    
    setIsReordering(true);
    const incompleteTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    
    const sortedIncompleteTasks = algorithm.algorithm(incompleteTasks);
    
    const sortedTasks = [...sortedIncompleteTasks, ...completedTasks];
    
    setDisplayedTasks(sortedTasks);
    setSelectedAlgorithm(algorithm);
    
    toast.success(`Sorted using ${algorithm.name}`);
    
    setTimeout(() => {
      setIsReordering(false);
    }, 500);
  };
  
  const resetSorting = () => {
    setDisplayedTasks([...tasks]);
    setSelectedAlgorithm(null);
    toast.info('Sorting reset to default order');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        <header className="text-center mb-12">
          <Badge 
            variant="outline" 
            className="mb-4 animate-fade-in bg-background border-muted px-3 py-1"
          >
            <ClipboardList className="h-3 w-3 mr-1" /> Task Management Reimagined
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight animate-slide-down">
            whatToDoNow
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Optimize your productivity with scheduling algorithms that help you decide which tasks to tackle first.
          </p>
        </header>
        
        <div className="space-y-8 mb-16">
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <TaskInput onAddTask={handleAddTask} />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <SchedulingAlgorithms 
              onSelectAlgorithm={handleSelectAlgorithm} 
              selectedAlgorithmId={selectedAlgorithm?.id || null}
              taskCount={tasks.filter(t => !t.completed).length}
            />
          </div>
          
          {selectedAlgorithm && (
            <div className="flex justify-between items-center px-1 animate-fade-in">
              <div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {selectedAlgorithm.name}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetSorting}
                className="text-xs"
              >
                Reset Order
              </Button>
            </div>
          )}
          
          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <TaskList 
              tasks={displayedTasks}
              onTaskComplete={handleTaskComplete}
              isReordering={isReordering}
            />
          </div>
        </div>
        
        {tasks.length > 0 && (
          <div className="flex justify-center my-16 animate-fade-in animate-pulse-subtle">
            <a href="#scheduling-info" className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-sm mb-2">Learn about scheduling algorithms</span>
              <ArrowDown className="h-5 w-5 animate-float" />
            </a>
          </div>
        )}
        
        <AlgorithmInfo />
        
        <footer className="border-t border-border/50 mt-20 pt-8 pb-12 text-center text-sm text-muted-foreground">
          <p>whatToDoNow - Optimize your productivity with algorithm-powered scheduling</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
