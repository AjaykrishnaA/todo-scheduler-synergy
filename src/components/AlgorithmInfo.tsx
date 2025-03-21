
import React from 'react';
import { algorithms } from '@/utils/schedulingAlgorithms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, Calendar, CheckCheck, Clock, GaugeCircle, InfoIcon, ListOrdered, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

const AlgorithmInfo: React.FC = () => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'timer':
        return <Timer className="h-5 w-5" />;
      case 'calendar':
        return <Calendar className="h-5 w-5" />;
      case 'gauge':
        return <GaugeCircle className="h-5 w-5" />;
      case 'list-ordered':
        return <ListOrdered className="h-5 w-5" />;
      case 'arrow-up':
        return <ArrowUp className="h-5 w-5" />;
      case 'timer-reset':
        return <Clock className="h-5 w-5" />;
      default:
        return <CheckCheck className="h-5 w-5" />;
    }
  };

  return (
    <section id="scheduling-info" className="scheduling-section space-y-8 py-12">
      <div className="text-center space-y-4 mb-12">
        <Badge variant="outline" className="mx-auto bg-background border-muted px-3 py-1">
          <InfoIcon className="h-3 w-3 mr-1" /> 
          Understanding Scheduling Algorithms
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight">Choose the Right Strategy for Your Tasks</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Different scheduling algorithms optimize for different outcomes. Learn about each strategy to make the best choice for your workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {algorithms.map((algorithm, index) => (
          <Card 
            key={algorithm.id} 
            className={cn(
              "overflow-hidden transition-all duration-500 hover:shadow-lg",
              "border border-border/50"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {getIconComponent(algorithm.icon)}
                </div>
                <CardTitle>{algorithm.name}</CardTitle>
              </div>
              <CardDescription className="text-balance">{algorithm.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Best For:</h4>
                <ul className="space-y-1">
                  {algorithm.bestFor.map((point, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Limitations:</h4>
                <ul className="space-y-1">
                  {algorithm.limitations.map((point, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-destructive mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AlgorithmInfo;
