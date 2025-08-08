import { useState, useEffect, useRef } from 'react';
import { User, Message, ChatSession } from '@shared/schema';
import { Bot } from '@/lib/bots';
import { VoiceRecorder } from './VoiceRecorder';
import { ParticleSystem } from './ParticleSystem';
import { useSentiment } from '@/hooks/useSentiment';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  user: User | null;
  activeBot: Bot;
  currentSession: ChatSession | null;
  onSessionCreate: (botId: string) => Promise<ChatSession>;
  isAdmin?: boolean;
}

export function ChatInterface({ 
  user, 
  activeBot, 
  currentSession,
  onSessionCreate,
  isAdmin = false 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSentiment, setCurrentSentiment] = useState<'positive' | 'negative' | 'neutral'>('neutral');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { analyzeSentiment } = useSentiment();
  const { toast } = useToast();

  // Load messages when session changes
  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
    } else {
      setMessages([]);
    }
  }, [currentSession]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  const loadMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/messages`);
      if (response.ok) {
        const sessionMessages = await response.json();
        setMessages(sessionMessages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    // Check token limits (bypass for admin mode)
    if (!isAdmin && user.tokensUsed >= user.tokenLimit) {
      toast({
        title: "Token limit reached",
        description: isAdmin ? "Admin mode: Unlimited tokens" : "You've reached your daily message limit. Upgrade for more tokens.",
        variant: "destructive",
      });
      return;
    }

    let session = currentSession;
    
    // Create session if none exists
    if (!session) {
      try {
        session = await onSessionCreate(activeBot.id);
      } catch (error) {
        toast({
          title: "Failed to create session",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    setIsTyping(true);
    setInputText('');
    
    try {
      // Analyze sentiment and update particles
      const sentiment = await analyzeSentiment(content);
      setCurrentSentiment(sentiment.sentiment);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          sessionId: session.id,
          botId: activeBot.id,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Reload messages to get the updated conversation
      await loadMessages(session.id);
      
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      sendMessage(inputText.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    if (text.trim()) {
      sendMessage(text.trim());
    }
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const playTTS = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  return (
    <>
      <ParticleSystem sentiment={currentSentiment} intensity={isLoading ? 2 : 1} />
      
      <div className="flex-1 flex flex-col min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="p-6 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <i className={`${activeBot.icon} text-white text-lg`}></i>
              </div>
              <div>
                <h2 className="text-gray-800 text-xl font-semibold">{activeBot.name}</h2>
                <p className="text-gray-600">{activeBot.tagline}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <VoiceRecorder 
                onTranscription={handleVoiceTranscription}
                disabled={isLoading || !user}
              />
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                <i className="fas fa-ellipsis-h"></i>
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-white" style={{ maxHeight: 'calc(100vh - 240px)' }}>
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="flex justify-center mb-8">
                <div className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-200 max-w-md animate-fade-in">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <i className={`${activeBot.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-gray-800 text-lg font-semibold mb-2">Welcome to {activeBot.name}</h3>
                  <p className="text-gray-600 text-sm">{activeBot.description}</p>
                </div>
              </div>
            )}

            {/* Message List */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {message.role === 'assistant' ? (
                  <div className="flex space-x-3 max-w-3xl">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <i className={`${activeBot.icon} text-white text-sm`}></i>
                    </div>
                    <div className="chat-bubble bg-gray-50 border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-bl-md">
                      <p>{message.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{formatTime(message.createdAt)}</span>
                          {message.sentiment && message.sentiment !== 'neutral' && (
                            <span className={`px-2 py-1 rounded-full ${
                              message.sentiment === 'positive' 
                                ? 'bg-teal-100 text-teal-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {message.sentiment}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => playTTS(message.content)}
                          className="text-gray-500 hover:text-gray-700 p-1"
                        >
                          <i className="fas fa-volume-up text-sm"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="chat-bubble bg-teal-500 text-white p-4 rounded-2xl rounded-br-md">
                    <p>{message.content}</p>
                    <div className="flex items-center justify-end mt-2 space-x-2 text-xs text-white/80">
                      <span>{formatTime(message.createdAt)}</span>
                      <i className="fas fa-check-double text-white/80"></i>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <i className={`${activeBot.icon} text-white text-sm`}></i>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/95 backdrop-blur-lg border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="w-full p-4 pr-24 rounded-2xl bg-white border border-gray-300 text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[60px] max-h-32"
                  disabled={isLoading || !user}
                />
                
                <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                  <Button
                    type="submit"
                    disabled={!inputText.trim() || isLoading || !user}
                    className="w-10 h-10 rounded-xl bg-teal-500 hover:bg-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-paper-plane text-white"></i>
                  </Button>
                </div>
              </div>
            </form>

            {/* Quick Actions and Usage */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                {/* GeoPrompt-specific actions */}
                {activeBot.id === 'geoprompt' ? (
                  <>
                    <span className="text-gray-400 text-sm italic">check in</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-700 transition-all duration-300 text-sm border border-gray-200 hover:border-green-200"
                      onClick={() => sendMessage("I want to do a location-based reflection check-in")}
                      disabled={isLoading || !user}
                    >
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      Start GeoPrompt
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-teal-50 text-gray-600 hover:text-teal-700 transition-all duration-300 text-sm border border-gray-200 hover:border-teal-200"
                      onClick={() => sendMessage("Let's do a daily check-in")}
                      disabled={isLoading || !user}
                    >
                      <i className="fas fa-lightbulb mr-2"></i>
                      Daily Check-in
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-teal-50 text-gray-600 hover:text-teal-700 transition-all duration-300 text-sm border border-gray-200 hover:border-teal-200"
                      onClick={() => sendMessage("Help me reflect on my current mood")}
                      disabled={isLoading || !user}
                    >
                      <i className="fas fa-heart mr-2"></i>
                      Mood Reflection
                    </Button>
                  </>
                )}
              </div>
              
              {user && (
                <div className="flex items-center space-x-3 text-gray-500 text-sm">
                  <span>{user.tokensUsed}</span>
                  <span>/</span>
                  <span>{user.tokenLimit}</span>
                  <span>today</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
