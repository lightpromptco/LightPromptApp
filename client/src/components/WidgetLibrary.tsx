import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Widget {
  id: string;
  title: string;
  type: 'metric' | 'progress' | 'activity' | 'chart' | 'quick-action' | 'weather' | 'quotes' | 'calendar' | 'book-store';
  content: any;
  size: 'small' | 'medium' | 'large';
  enabled: boolean;
  description: string;
}

interface WidgetLibraryProps {
  onAddWidget: (widget: Widget) => void;
  currentWidgets: Widget[];
}

const AVAILABLE_WIDGETS: Omit<Widget, 'enabled'>[] = [
  {
    id: 'wellness-overview',
    title: 'Wellness Overview',
    type: 'metric',
    content: { metric: 'wellness' },
    size: 'large',
    description: 'Track your daily mood, energy, and wellness streaks'
  },
  {
    id: 'daily-checkin',
    title: 'Daily Check-in',
    type: 'quick-action',
    content: { action: 'checkin' },
    size: 'medium',
    description: 'Quick emotional check-in and mood tracking'
  },
  {
    id: 'habit-progress',
    title: 'Habit Progress',
    type: 'progress',
    content: { metric: 'habits' },
    size: 'medium',
    description: 'Monitor your daily habit completion and streaks'
  },
  {
    id: 'recent-activity',
    title: 'Recent Activity',
    type: 'activity',
    content: { type: 'recent' },
    size: 'large',
    description: 'See your latest wellness activities and achievements'
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    type: 'chart',
    content: { type: 'insights' },
    size: 'medium',
    description: 'Personalized wellness insights from your AI companion'
  },
  {
    id: 'quick-chat',
    title: 'Quick Chat',
    type: 'quick-action',
    content: { action: 'chat' },
    size: 'small',
    description: 'Start a conversation with your AI wellness coach'
  },
  {
    id: 'inspiration-quotes',
    title: 'Daily Inspiration',
    type: 'quotes',
    content: { type: 'quotes' },
    size: 'medium',
    description: 'Uplifting quotes and affirmations for your day'
  },
  {
    id: 'weather-wellness',
    title: 'Weather & Wellness',
    type: 'weather',
    content: { type: 'weather' },
    size: 'small',
    description: 'Weather-aware wellness recommendations'
  },
  {
    id: 'upcoming-events',
    title: 'Upcoming Events',
    type: 'calendar',
    content: { type: 'calendar' },
    size: 'medium',
    description: 'Your wellness schedule and upcoming activities'
  },
  {
    id: 'book-store',
    title: 'LightPrompt:ed Book',
    type: 'book-store',
    content: { type: 'store' },
    size: 'large',
    description: 'Purchase the foundational LightPrompt:ed guide and other soul-tech resources'
  }
];

export function WidgetLibrary({ onAddWidget, currentWidgets }: WidgetLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const enabledWidgetIds = currentWidgets.filter(w => w.enabled).map(w => w.id);
  const availableWidgets = AVAILABLE_WIDGETS.filter(w => !enabledWidgetIds.includes(w.id));

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'metric': return <i className="fas fa-chart-bar text-blue-500"></i>;
      case 'progress': return <i className="fas fa-tasks text-green-500"></i>;
      case 'activity': return <i className="fas fa-clock text-purple-500"></i>;
      case 'chart': return <i className="fas fa-chart-line text-orange-500"></i>;
      case 'quick-action': return <i className="fas fa-bolt text-yellow-500"></i>;
      case 'quotes': return <i className="fas fa-quote-left text-pink-500"></i>;
      case 'weather': return <i className="fas fa-cloud-sun text-cyan-500"></i>;
      case 'calendar': return <i className="fas fa-calendar text-indigo-500"></i>;
      case 'book-store': return <i className="fas fa-book text-emerald-500"></i>;
      default: return <i className="fas fa-square text-gray-500"></i>;
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Small';
      case 'medium': return 'Medium';
      case 'large': return 'Large';
      default: return 'Medium';
    }
  };

  const handleAddWidget = (widget: Omit<Widget, 'enabled'>) => {
    onAddWidget({ ...widget, enabled: true });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <i className="fas fa-plus mr-2"></i>
          Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Widget Library</DialogTitle>
          <DialogDescription>
            Choose from our collection of wellness widgets to customize your dashboard
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableWidgets.map((widget) => (
            <Card key={widget.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  {getWidgetIcon(widget.type)}
                  <span className="ml-2 flex-1">{widget.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {getSizeLabel(widget.size)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  {widget.description}
                </p>
                <Button 
                  size="sm" 
                  className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleAddWidget(widget)}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add to Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {availableWidgets.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-check-circle text-green-500 text-xl"></i>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">All widgets added!</h3>
            <p className="text-gray-500 text-sm">
              You're using all available widgets. You can remove widgets from your dashboard to add different ones.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}