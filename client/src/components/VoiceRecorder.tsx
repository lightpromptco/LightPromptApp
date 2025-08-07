import { useState } from 'react';
import { useVoice } from '@/hooks/useVoice';
import { Button } from '@/components/ui/button';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onTranscription, disabled }: VoiceRecorderProps) {
  const { 
    isRecording, 
    recordingTime, 
    isTranscribing,
    startRecording, 
    stopRecording, 
    transcribeAudio, 
    formatTime 
  } = useVoice();
  
  const [error, setError] = useState<string>('');

  const handleToggleRecording = async () => {
    try {
      setError('');
      
      if (isRecording) {
        const audioBlob = await stopRecording();
        if (audioBlob.size > 0) {
          const transcription = await transcribeAudio(audioBlob);
          if (transcription.trim()) {
            onTranscription(transcription);
          }
        }
      } else {
        await startRecording();
      }
    } catch (err) {
      console.error('Voice recording error:', err);
      setError('Failed to access microphone');
    }
  };

  return (
    <>
      {/* Voice Recording Indicator */}
      {isRecording && (
        <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-700 font-medium">Recording...</span>
              <span className="text-red-600">{formatTime(recordingTime)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleRecording}
              className="text-red-600 hover:text-red-700"
            >
              <i className="fas fa-stop"></i>
            </Button>
          </div>
          <div className="flex items-center justify-center mt-3 space-x-1">
            {Array(20).fill(0).map((_, i) => (
              <div 
                key={i}
                className="w-1 h-6 bg-red-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Transcribing Indicator */}
      {isTranscribing && (
        <div className="mb-4 p-4 rounded-2xl bg-teal-50 border border-teal-200 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
            <span className="text-teal-700 font-medium">Transcribing audio...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {/* Voice Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleRecording}
        disabled={disabled || isTranscribing}
        className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        }`}
        title={isRecording ? 'Stop recording' : 'Start voice recording'}
      >
        <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
      </Button>
    </>
  );
}
