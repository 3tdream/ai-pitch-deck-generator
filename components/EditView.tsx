import React from 'react';
import { ChevronLeft, Home, Sparkles, Zap } from 'lucide-react';
import { Deck, ChatMessage } from '@/types/deck';
import { SlideRenderer } from './SlideRenderer';

interface EditViewProps {
  deck: Deck;
  currentSlide: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onSetSlide: (index: number) => void;
  onClose: () => void;
  onBackToDeck: () => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSendMessage: () => void;
  isAiTyping: boolean;
}

export function EditView({
  deck,
  currentSlide,
  onPrevSlide,
  onNextSlide,
  onSetSlide,
  onClose,
  onBackToDeck,
  chatMessages,
  chatInput,
  onChatInputChange,
  onSendMessage,
  isAiTyping
}: EditViewProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isAiTyping) {
      onSendMessage();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-5 flex items-center justify-between border-b border-slate-700 backdrop-blur-lg flex-shrink-0">
        <button
          onClick={onBackToDeck}
          className="group flex items-center gap-3 text-white hover:text-purple-400 transition-colors px-4 py-2 rounded-xl hover:bg-white hover:bg-opacity-10"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Presentation</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white font-bold text-lg">AI Edit Mode</span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white hover:bg-opacity-10"
        >
          <Home className="w-5 h-5" />
          <span className="font-semibold">Home</span>
        </button>
      </div>

      {/* Main Content Area - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Slide Preview (2/3) */}
        <div className="w-2/3 p-8 flex flex-col border-r border-slate-700">
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Slide Container */}
            <div className="w-full max-w-4xl">
              <div className="bg-white rounded-2xl shadow-2xl aspect-video overflow-hidden border-2 border-slate-700">
                <SlideRenderer slide={deck.slides[currentSlide]} colorScheme={deck.colorScheme} />
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={onPrevSlide}
                  disabled={currentSlide === 0}
                  className={`flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg transition-all ${
                    currentSlide === 0
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:bg-slate-700'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm font-semibold">Prev</span>
                </button>

                <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                  <span className="text-white font-bold">{currentSlide + 1}</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-gray-400">{deck.slides.length}</span>
                </div>

                <button
                  onClick={onNextSlide}
                  disabled={currentSlide === deck.slides.length - 1}
                  className={`flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg transition-all ${
                    currentSlide === deck.slides.length - 1
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:bg-slate-700'
                  }`}
                >
                  <span className="text-sm font-semibold">Next</span>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>

              {/* Slide Dots */}
              <div className="flex gap-1.5 justify-center mt-4">
                {deck.slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSetSlide(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentSlide
                        ? 'bg-purple-500 w-6'
                        : 'bg-gray-700 w-1.5 hover:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Chat UI (1/3) */}
        <div className="w-1/3 flex flex-col bg-slate-900">
          {/* Chat Header */}
          <div className="p-6 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">AI Assistant</h3>
                <p className="text-gray-400 text-xs">Ready to help edit your deck</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.map((message, idx) => (
              <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-slate-800 text-gray-100 border border-slate-700'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-gray-100 border border-slate-700 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-slate-700 flex-shrink-0">
            <div className="flex gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => onChatInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me to edit something..."
                className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-purple-500 focus:outline-none transition-colors placeholder-gray-500"
                disabled={isAiTyping}
              />
              <button
                onClick={onSendMessage}
                disabled={!chatInput.trim() || isAiTyping}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-3 text-center">
              Try: &quot;Change the title color&quot; or &quot;Make slide 2 more impactful&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
