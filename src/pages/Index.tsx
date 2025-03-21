
import React, { useState, useEffect } from 'react';
import { Task, SchedulingAlgorithm, algorithms } from '@/utils/schedulingAlgorithms';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import SchedulingAlgorithms from '@/components/SchedulingAlgorithms';
import AlgorithmInfo from '@/components/AlgorithmInfo';
import { Button } from '@/components/ui/button';
import { ArrowDown, ClipboardList, Code, InfoIcon, Terminal } from 'lucide-react';
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

  const getMatrixChar = () => {
    const chars = "01";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        <header className="text-center mb-12">
          <Badge 
            variant="outline" 
            className="mb-4 animate-fade-in bg-secondary/50 border-primary/30 px-3 py-1"
          >
            <Terminal className="h-3 w-3 mr-1" /> Task Optimization System
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight animate-slide-down">
            <span className="text-primary">what</span>To<span className="text-primary">Do</span>Now
          </h1>
          
          <div className="flex justify-center mb-3">
            <div className="text-xs font-mono text-muted-foreground opacity-50">
              {Array.from({ length: 18 }).map((_, i) => (
                <span key={i} className="inline-block animate-pulse-subtle" style={{ animationDelay: `${i * 0.1}s` }}>
                  {getMatrixChar()}
                </span>
              ))}
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Optimize your productivity with <span className="text-primary">O(n log n)</span> scheduling algorithms
          </p>
        </header>
        
        <div className="space-y-8 mb-16">
          <div className="animate-fade-in glass-card p-6 rounded-lg border-t border-primary/30" style={{ animationDelay: '100ms' }}>
            <TaskInput onAddTask={handleAddTask} />
          </div>
          
          <div className="animate-fade-in glass-card p-6 rounded-lg" style={{ animationDelay: '200ms' }}>
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
                  <Code className="h-3 w-3 mr-1" /> {selectedAlgorithm.name}
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
            <a href="#scheduling-info" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
              <span className="text-sm mb-2 font-mono">algorithm.details()</span>
              <ArrowDown className="h-5 w-5 animate-float text-primary" />
            </a>
          </div>
        )}
        
        <AlgorithmInfo />
        
        <footer className="border-t border-border/50 mt-20 pt-8 pb-12 text-center text-sm text-muted-foreground font-mono">
          <p className="mb-2">whatToDoNow v1.0.0 | <span className="text-primary">Runtime Complexity: O(n log n)</span></p>
          <p className="text-xs opacity-60">(c) {new Date().getFullYear()} - Optimizing productivity one algorithm at a time</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
