import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import type { MatchChat, ReflectionPrompt, VibeMatch } from '@shared/schema';

interface SecureMatchChatProps {
  match: VibeMatch;
  currentUserId: string;
  onBack: () => void;
}

interface ChatMessage extends MatchChat {
  isOwn: boolean;
  partnerName: string;
}

export function SecureMatchChat({ match, currentUserId, onBack }: SecureMatchChatProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [showReflectionPrompts, setShowReflectionPrompts] = useState(false);

  const partnerId = match.userId1 === currentUserId ? match.userId2 : match.userId1;

  // Get chat messages
  const { data: messages, isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/match-chat', match.id],
    queryFn: async () => {
      const response = await fetch(`/api/match-chat/${match.id}?userId=${currentUserId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    refetchInterval: 3000, // Real-time-ish updates
  });

  // Get available reflection prompts
  const { data: reflectionPrompts } = useQuery<ReflectionPrompt[]>({
    queryKey: ['/api/reflection-prompts'],
    queryFn: async () => {
      const response = await fetch('/api/reflection-prompts');
      if (!response.ok) throw new Error('Failed to fetch prompts');
      return response.json();
    },
  });

  // Send message mutation with AI moderation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, type = 'text', promptId }: { 
      content: string; 
      type?: string; 
      promptId?: string; 
    }) => {
      const response = await fetch('/api/match-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: match.id,
          senderId: currentUserId,
          receiverId: partnerId,
          message: content,
          messageType: type,
          reflectionPromptId: promptId,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/match-chat'] });
      setMessage('');
      if (data.resonanceContribution > 0) {
        toast({
          title: "Resonance Created! ✨",
          description: "Your meaningful exchange contributed to your soul connection.",
        });
      }
      if (data.aiModerationScore < 80) {
        toast({
          title: "Message flagged for review",
          description: "Our AI detected potential issues. Please keep conversations respectful and wellness-focused.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Message not sent",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Report/safety mutation
  const reportMutation = useMutation({
    mutationFn: async ({ chatId, reason }: { chatId: string; reason: string }) => {
      const response = await fetch('/api/chat-safety-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          userId: currentUserId,
          actionType: 'report',
          reason,
        }),
      });
      if (!response.ok) throw new Error('Failed to submit report');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe. We'll review this immediately.",
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({ content: message.trim() });
  };

  const handleSendReflectionPrompt = (prompt: ReflectionPrompt) => {
    sendMessageMutation.mutate({ 
      content: prompt.prompt, 
      type: 'reflection_prompt',
      promptId: prompt.id 
    });
    setShowReflectionPrompts(false);
  };

  const handleReport = (chatId: string) => {
    const reason = prompt('Please describe why you\'re reporting this message (inappropriate content, harassment, etc.):');
    if (reason) {
      reportMutation.mutate({ chatId, reason });
    }
  };

  if (messagesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading your soul connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button onClick={onBack} variant="ghost" size="sm">
              <i className="fas fa-arrow-left mr-2"></i>
              Back
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white"></i>
            </div>
            <div>
              <h3 className="font-semibold">Anonymous Soul</h3>
              <p className="text-sm text-gray-600">
                Resonance: {match.resonanceCount || 0}/3 • Safe space for growth
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <i className="fas fa-shield-alt mr-1"></i>
              AI Protected
            </Badge>
            {(match.resonanceCount || 0) >= 3 && (
              <Badge className="bg-teal-100 text-teal-700">
                <i className="fas fa-gem mr-1"></i>
                Prism Ready
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <Alert className="m-4 bg-green-50 border-green-200">
        <i className="fas fa-shield-check text-green-600"></i>
        <AlertDescription className="text-green-800">
          <strong>Safe Space:</strong> All conversations are AI-monitored for safety. Keep exchanges wellness-focused and respectful. 
          Report any inappropriate behavior immediately.
        </AlertDescription>
      </Alert>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.length ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.isOwn
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.messageType === 'reflection_prompt' && (
                  <div className="text-xs opacity-75 mb-1">
                    <i className="fas fa-lightbulb mr-1"></i>
                    Reflection Prompt
                  </div>
                )}
                
                <p className="text-sm">{msg.message}</p>
                
                <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                  <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  <div className="flex items-center space-x-1">
                    {(msg.resonanceContribution || 0) > 0 && (
                      <i className="fas fa-star text-yellow-400" title="Contributed to resonance"></i>
                    )}
                    {(msg.aiModerationScore || 100) < 90 && (
                      <i className="fas fa-flag text-orange-400" title="Flagged for review"></i>
                    )}
                    {!msg.isOwn && (
                      <button
                        onClick={() => handleReport(msg.id)}
                        className="hover:text-red-400 transition-colors"
                        title="Report message"
                      >
                        <i className="fas fa-exclamation-triangle text-xs"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-comments text-4xl text-gray-300 mb-4"></i>
            <h4 className="text-lg font-medium text-gray-700 mb-2">Start your soul connection</h4>
            <p className="text-gray-600 mb-4">
              Share your authentic self and build resonance through meaningful conversation
            </p>
            <Button
              onClick={() => setShowReflectionPrompts(true)}
              className="bg-gradient-to-r from-teal-600 to-cyan-600"
            >
              <i className="fas fa-lightbulb mr-2"></i>
              Start with a Reflection Prompt
            </Button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reflection Prompts Modal */}
      {showReflectionPrompts && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-96 overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Reflection Prompts</span>
                <Button
                  onClick={() => setShowReflectionPrompts(false)}
                  variant="ghost"
                  size="sm"
                >
                  <i className="fas fa-times"></i>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reflectionPrompts?.map((prompt) => (
                <div
                  key={prompt.id}
                  onClick={() => handleSendReflectionPrompt(prompt)}
                  className="p-3 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg cursor-pointer hover:from-teal-100 hover:to-cyan-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {prompt.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {prompt.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{prompt.prompt}</p>
                  {prompt.description && (
                    <p className="text-xs text-gray-600 mt-1">{prompt.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your authentic thoughts and feelings..."
              className="resize-none"
              rows={2}
              maxLength={1000}
              disabled={sendMessageMutation.isPending}
            />
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{message.length}/1000 characters</span>
              <span className="flex items-center">
                <i className="fas fa-robot mr-1"></i>
                AI safety monitoring active
              </span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button
              type="submit"
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="bg-gradient-to-r from-teal-600 to-cyan-600"
            >
              {sendMessageMutation.isPending ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </Button>
            
            <Button
              type="button"
              onClick={() => setShowReflectionPrompts(true)}
              variant="outline"
              size="sm"
              title="Send reflection prompt"
            >
              <i className="fas fa-lightbulb"></i>
            </Button>
          </div>
        </form>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          Building authentic connections through wellness-focused conversation
        </div>
      </div>
    </div>
  );
}