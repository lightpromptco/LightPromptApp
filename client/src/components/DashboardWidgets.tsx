import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WidgetLibrary } from '@/components/WidgetLibrary';

interface Widget {
  id: string;
  title: string;
  type: 'metric' | 'progress' | 'activity' | 'chart' | 'quick-action' | 'weather' | 'quotes' | 'calendar' | 'book-store';
  content: any;
  size: 'small' | 'medium' | 'large';
  enabled: boolean;
  description?: string;
}

interface DashboardWidgetsProps {
  userId: string;
  dashboardData: any;
  user: any;
}

const DEFAULT_WIDGETS: Widget[] = [
  {
    id: 'wellness-overview',
    title: 'Wellness Overview',
    type: 'metric',
    content: { metric: 'wellness' },
    size: 'large',
    enabled: true
  },
  {
    id: 'daily-checkin',
    title: 'Daily Check-in',
    type: 'quick-action',
    content: { action: 'checkin' },
    size: 'medium',
    enabled: true
  },
  {
    id: 'habit-progress',
    title: 'Habit Progress',
    type: 'progress',
    content: { metric: 'habits' },
    size: 'medium',
    enabled: true
  },
  {
    id: 'recent-activity',
    title: 'Recent Activity',
    type: 'activity',
    content: { type: 'recent' },
    size: 'large',
    enabled: true
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    type: 'chart',
    content: { type: 'insights' },
    size: 'medium',
    enabled: true
  },
  {
    id: 'quick-chat',
    title: 'Quick Chat',
    type: 'quick-action',
    content: { action: 'chat' },
    size: 'small',
    enabled: true
  },
  {
    id: 'book-store',
    title: 'LightPrompt:ed Book',
    type: 'book-store',
    content: { type: 'store' },
    size: 'large',
    enabled: true
  }
];

export function DashboardWidgets({ userId, dashboardData, user }: DashboardWidgetsProps) {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    // Load saved layout from localStorage
    const saved = localStorage.getItem(`dashboard-layout-${userId}`);
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Save layout to localStorage whenever widgets change
  useEffect(() => {
    localStorage.setItem(`dashboard-layout-${userId}`, JSON.stringify(widgets));
  }, [widgets, userId]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  const toggleWidget = (widgetId: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, enabled: !widget.enabled }
        : widget
    ));
  };

  const resetLayout = () => {
    setWidgets(DEFAULT_WIDGETS);
    localStorage.removeItem(`dashboard-layout-${userId}`);
  };

  const addWidget = (widget: Widget) => {
    setWidgets([...widgets, widget]);
  };

  const enabledWidgets = widgets.filter(w => w.enabled);

  const renderWidget = (widget: Widget, index: number) => {
    const isDragging = isEditMode;
    
    return (
      <Draggable key={widget.id} draggableId={widget.id} index={index} isDragDisabled={!isEditMode}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`transition-all duration-200 ${
              snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''
            } ${isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
          >
            <Card className={`
              ${getWidgetSizeClass(widget.size)} 
              ${isEditMode ? 'border-blue-300 border-2 border-dashed bg-blue-50' : ''}
              ${snapshot.isDragging ? 'shadow-2xl border-blue-500' : ''}
              hover:shadow-lg transition-all duration-200
            `}>
              {isEditMode && (
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleWidget(widget.id)}
                    className="h-6 w-6 p-0 bg-white/80 hover:bg-red-100"
                  >
                    <i className="fas fa-times text-red-500 text-xs"></i>
                  </Button>
                </div>
              )}
              
              <CardHeader className={isEditMode ? 'pb-2' : ''}>
                <CardTitle className="flex items-center text-lg">
                  {isEditMode && <i className="fas fa-grip-vertical mr-2 text-gray-400"></i>}
                  {getWidgetIcon(widget.type)}
                  <span className="ml-2">{widget.title}</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {renderWidgetContent(widget)}
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    );
  };

  const getWidgetSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-1 md:col-span-2';
      case 'large': return 'col-span-1 md:col-span-2 lg:col-span-3';
      default: return 'col-span-1';
    }
  };

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

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'metric':
        return renderMetricWidget(widget);
      case 'progress':
        return renderProgressWidget(widget);
      case 'activity':
        return renderActivityWidget(widget);
      case 'chart':
        return renderChartWidget(widget);
      case 'quick-action':
        return renderQuickActionWidget(widget);
      case 'quotes':
        return renderQuotesWidget(widget);
      case 'weather':
        return renderWeatherWidget(widget);
      case 'calendar':
        return renderCalendarWidget(widget);
      case 'book-store':
        return renderBookStoreWidget(widget);
      default:
        return <div className="text-gray-500">Widget content</div>;
    }
  };

  const renderMetricWidget = (widget: Widget) => {
    const metrics = dashboardData?.wellnessMetrics || {};
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {metrics.mood ? '😊' : '😐'}
            </div>
            <div className="text-sm text-gray-600">Mood</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.energy || 0}/10
            </div>
            <div className="text-sm text-gray-600">Energy</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">
            {dashboardData?.streakDays || 0} day streak
          </div>
          <div className="text-xs text-gray-500">Keep it up!</div>
        </div>
      </div>
    );
  };

  const renderProgressWidget = (widget: Widget) => {
    const habits = dashboardData?.habits || [];
    const completedToday = habits.filter((h: any) => h.completedToday).length;
    const totalHabits = habits.length;
    const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Today's Habits</span>
          <Badge variant="outline">{completedToday}/{totalHabits}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-xs text-gray-500 text-center">
          {Math.round(progress)}% complete
        </div>
      </div>
    );
  };

  const renderActivityWidget = (widget: Widget) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <i className="fas fa-comments text-white text-xs"></i>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Chat with LightPromptBot</div>
            <div className="text-xs text-gray-500">2 hours ago</div>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-white text-xs"></i>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Completed meditation</div>
            <div className="text-xs text-gray-500">This morning</div>
          </div>
        </div>
      </div>
    );
  };

  const renderChartWidget = (widget: Widget) => {
    const insights = [
      "💡 Your energy levels peak on Tuesday and Wednesday",
      "🌙 You sleep best when you meditate before bed",
      "🏃‍♂️ Morning workouts boost your mood by 40%",
      "📱 Screen time affects your stress levels"
    ];
    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-center">AI Insights</div>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded border border-blue-100">
          <div className="text-sm text-gray-700 mb-2">
            {randomInsight}
          </div>
          <div className="text-xs text-gray-500">
            Based on your wellness patterns
          </div>
        </div>
        <div className="flex justify-center">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.location.href = '/dashboard?view=growth'}
          >
            <i className="fas fa-chart-line mr-1"></i>
            View Details
          </Button>
        </div>
      </div>
    );
  };

  const renderQuickActionWidget = (widget: Widget) => {
    if (widget.content?.action === 'checkin') {
      return (
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-3">How are you feeling today?</div>
            <div className="flex justify-center space-x-2">
              {['😊', '😐', '😔'].map((emoji, i) => (
                <Button key={i} variant="ghost" size="sm" className="text-xl hover:bg-blue-50">
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
            size="sm"
            onClick={() => window.location.href = '/dashboard?view=checkin'}
          >
            <i className="fas fa-heart mr-2"></i>
            Complete Check-in
          </Button>
        </div>
      );
    }

    if (widget.content?.action === 'chat') {
      return (
        <div className="space-y-3">
          <div className="text-sm text-gray-600 text-center">
            Start a conversation with your AI companion
          </div>
          <Button 
            className="w-full" 
            size="sm" 
            variant="outline"
            onClick={() => window.location.href = '/chat'}
          >
            <i className="fas fa-comments mr-2"></i>
            Open Chat
          </Button>
        </div>
      );
    }

    return <div className="text-gray-500 text-center">Quick action</div>;
  };

  const renderQuotesWidget = (widget: Widget) => {
    const quotes = [
      { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
      { text: "Wellness is the complete integration of body, mind, and spirit.", author: "Greg Anderson" },
      { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
      { text: "Your mind is a powerful thing. When you fill it with positive thoughts, your life will start to change.", author: "Unknown" }
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return (
      <div className="space-y-3">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-100">
          <div className="text-sm text-gray-700 mb-2 italic">
            "{randomQuote.text}"
          </div>
          <div className="text-xs text-gray-500 text-right">
            — {randomQuote.author}
          </div>
        </div>
        <div className="text-center">
          <Button size="sm" variant="ghost" onClick={() => window.location.reload()}>
            <i className="fas fa-refresh mr-1"></i>
            New Quote
          </Button>
        </div>
      </div>
    );
  };

  const renderWeatherWidget = (widget: Widget) => {
    return (
      <div className="space-y-3">
        <div className="text-center">
          <div className="text-2xl mb-1">🌤️</div>
          <div className="text-lg font-semibold">72°F</div>
          <div className="text-xs text-gray-600">Partly Cloudy</div>
        </div>
        <div className="bg-cyan-50 p-2 rounded text-center">
          <div className="text-xs text-cyan-700">
            Perfect weather for a mindful walk! 🚶‍♀️
          </div>
        </div>
      </div>
    );
  };

  const renderCalendarWidget = (widget: Widget) => {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-center">Today's Schedule</div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 bg-indigo-50 rounded">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium">Morning Meditation</div>
              <div className="text-xs text-gray-500">8:00 AM</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium">Wellness Check-in</div>
              <div className="text-xs text-gray-500">6:00 PM</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBookStoreWidget = (widget: Widget) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded shadow-lg flex items-center justify-center">
              <i className="fas fa-eye text-white text-xl"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">✓</span>
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="font-bold text-lg text-gray-900">LightPrompt:ed</h3>
          <p className="text-sm text-gray-600">The foundational guide to soul-tech wellness</p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold text-emerald-600">$11</span>
            <span className="text-sm text-gray-500 line-through">$19</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            onClick={() => window.open('https://lightprompt.gumroad.com/l/xrpvr', '_blank')}
          >
            <i className="fas fa-shopping-cart mr-1"></i>
            Buy Now
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.location.href = '/dashboard?view=about'}
          >
            <i className="fas fa-info-circle mr-1"></i>
            Learn More
          </Button>
        </div>

        <div className="text-xs text-center text-gray-500 bg-emerald-50 p-2 rounded">
          💫 <strong>Foundation first:</strong> Start with the book to understand LightPrompt, then explore the tools that call to you.
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Widget Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">Dashboard Widgets</h3>
          <Badge variant="outline" className="text-xs">
            {enabledWidgets.length} active
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <WidgetLibrary onAddWidget={addWidget} currentWidgets={widgets} />
          <Button
            size="sm"
            variant={isEditMode ? "default" : "outline"}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <i className={`fas ${isEditMode ? 'fa-check' : 'fa-edit'} mr-2`}></i>
            {isEditMode ? 'Done' : 'Customize'}
          </Button>
          {isEditMode && (
            <Button size="sm" variant="ghost" onClick={resetLayout}>
              <i className="fas fa-undo mr-2"></i>
              Reset
            </Button>
          )}
        </div>
      </div>

      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center text-blue-800">
            <i className="fas fa-info-circle mr-2"></i>
            <span className="text-sm">
              Drag widgets to reorder them. Click the × to hide widgets.
            </span>
          </div>
        </div>
      )}

      {/* Drag and Drop Container */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-widgets">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
                ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}
                transition-colors duration-200
              `}
            >
              {enabledWidgets.map((widget, index) => renderWidget(widget, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Disabled Widgets */}
      {isEditMode && widgets.some(w => !w.enabled) && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-3">Hidden Widgets</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {widgets.filter(w => !w.enabled).map(widget => (
              <Card key={widget.id} className="opacity-50 border-dashed hover:opacity-75 transition-opacity">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getWidgetIcon(widget.type)}
                      <span className="text-sm font-medium">{widget.title}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleWidget(widget.id)}
                      className="h-6 w-6 p-0 hover:bg-green-100"
                    >
                      <i className="fas fa-plus text-green-500 text-xs"></i>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}