import { useState, useEffect } from 'react';
import { User } from '@shared/schema';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UsageWarningProps {
  user: User;
  onDismiss?: () => void;
}

export function UsageWarning({ user, onDismiss }: UsageWarningProps) {
  const [dismissed, setDismissed] = useState(false);
  
  const usagePercentage = (user.tokensUsed / user.tokenLimit) * 100;
  const remainingTokens = user.tokenLimit - user.tokensUsed;
  
  // Reset dismissed state when tokens are reset
  useEffect(() => {
    if (usagePercentage < 80) {
      setDismissed(false);
    }
  }, [usagePercentage]);

  // Don't show if dismissed or usage is below warning threshold
  if (dismissed || usagePercentage < 80) {
    return null;
  }

  const getWarningConfig = () => {
    if (usagePercentage >= 100) {
      return {
        level: 'critical',
        title: 'Daily Limit Reached',
        message: 'You\'ve used all your daily tokens. Your limit will reset tomorrow.',
        color: 'bg-red-50 border-red-200 text-red-800',
        icon: 'fas fa-exclamation-triangle text-red-500'
      };
    } else if (usagePercentage >= 90) {
      return {
        level: 'high',
        title: 'Almost at Daily Limit',
        message: `Only ${remainingTokens} tokens remaining today. Consider upgrading for more daily usage.`,
        color: 'bg-orange-50 border-orange-200 text-orange-800',
        icon: 'fas fa-exclamation-circle text-orange-500'
      };
    } else {
      return {
        level: 'medium',
        title: 'Approaching Daily Limit',
        message: `${remainingTokens} tokens remaining today. You're at ${Math.round(usagePercentage)}% of your daily limit.`,
        color: 'bg-amber-50 border-amber-200 text-amber-800',
        icon: 'fas fa-info-circle text-amber-500'
      };
    }
  };

  const config = getWarningConfig();

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-auto px-4">
      <Alert className={`${config.color} shadow-lg animate-in slide-in-from-top-2 duration-300`}>
        <div className="flex items-start space-x-3">
          <i className={`${config.icon} mt-0.5 flex-shrink-0`}></i>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm">{config.title}</h4>
              <Badge variant="outline" className="text-xs">
                {user.tokensUsed}/{user.tokenLimit}
              </Badge>
            </div>
            <AlertDescription className="text-sm">
              {config.message}
            </AlertDescription>
            
            {/* Usage Progress Bar */}
            <div className="mt-3 mb-2">
              <div className="w-full bg-white/50 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    usagePercentage >= 100 ? 'bg-red-500' :
                    usagePercentage >= 90 ? 'bg-orange-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1 opacity-70">
                <span>0</span>
                <span>{Math.round(usagePercentage)}%</span>
                <span>{user.tokenLimit}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-current/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-xs h-7 px-2"
              >
                Dismiss
              </Button>
              
              {usagePercentage >= 90 && (
                <Button
                  size="sm"
                  className="text-xs h-7 px-3 bg-white/20 hover:bg-white/30 border border-current/30"
                  onClick={() => {
                    // Could link to upgrade page in the future
                    window.open('mailto:support@lightprompt.com?subject=Upgrade%20Request', '_blank');
                  }}
                >
                  <i className="fas fa-crown mr-1"></i>
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
}