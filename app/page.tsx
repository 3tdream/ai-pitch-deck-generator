'use client';

import React, { useState, useEffect } from 'react';
import { ViewType, Deck, ChatMessage } from '@/types/deck';
import { initialDecks } from '@/data/initialDecks';
import { colorSchemes } from '@/data/colorSchemes';
import { loadDecks } from '@/lib/deckLoader';
import { HomeView } from '@/components/HomeView';
import { DeckView } from '@/components/DeckView';
import { EditView } from '@/components/EditView';
import { NewDeckModal } from '@/components/NewDeckModal';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [allDecks, setAllDecks] = useState<Deck[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize decks on mount - Load from JSON files
  useEffect(() => {
    async function initializeDecks() {
      setIsLoading(true);
      try {
        const decks = await loadDecks();
        if (decks.length > 0) {
          setAllDecks(decks);
        } else {
          // Fallback to hardcoded decks if JSON loading fails
          console.warn('Using fallback decks from initialDecks.ts');
          setAllDecks(initialDecks);
        }
      } catch (error) {
        console.error('Error loading decks:', error);
        setAllDecks(initialDecks);
      } finally {
        setIsLoading(false);
      }
    }

    if (allDecks.length === 0) {
      initializeDecks();
    }
  }, [allDecks.length]);

  const generateNewDeck = () => {
    setIsGenerating(true);

    // Simulate AI generation with a delay
    setTimeout(() => {
      const randomColorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];

      const newDeck: Deck = {
        id: allDecks.length + 1,
        title: newDeckTitle || "New AI-Generated Deck",
        description: newDeckDescription || "Powered by artificial intelligence",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        slideCount: 7,
        colorScheme: randomColorScheme,
        slides: [
          {
            type: "title",
            title: newDeckTitle || "New AI-Generated Deck",
            subtitle: "Powered by Advanced AI",
            content: newDeckDescription || "The future is here"
          },
          {
            type: "problem",
            title: "Key Challenges",
            points: [
              "Market inefficiencies need addressing",
              "Current solutions are inadequate",
              "Customer pain points remain unsolved",
              "Innovation gap in the industry"
            ]
          },
          {
            type: "solution",
            title: "Our Innovation",
            description: "A revolutionary approach to solving complex problems with AI-driven insights",
            features: ["Smart Automation", "Data Analytics", "Scalable Platform", "User-Centric Design"]
          },
          {
            type: "market",
            title: "Market Potential",
            stat: "$25B",
            description: "Total Addressable Market",
            details: "Projected 35% growth over next 5 years"
          },
          {
            type: "traction",
            title: "Key Metrics",
            metrics: [
              { label: "Users", value: "5K+" },
              { label: "Revenue", value: "$500K ARR" },
              { label: "Growth", value: "50% MoM" },
              { label: "NPS Score", value: "72" }
            ]
          },
          {
            type: "business",
            title: "Pricing Strategy",
            tiers: [
              { name: "Basic", price: "$49/mo", users: "Small teams" },
              { name: "Pro", price: "$199/mo", users: "Growing companies" },
              { name: "Enterprise", price: "Custom", users: "Large organizations" }
            ]
          },
          {
            type: "ask",
            title: "Investment Opportunity",
            amount: "$2M Seed",
            usage: "Product Development • Marketing • Hiring",
            goal: "Achieve profitability by Q4 2026"
          }
        ]
      };

      setAllDecks([newDeck, ...allDecks]);
      setIsGenerating(false);
      setShowNewDeckModal(false);
      setNewDeckTitle('');
      setNewDeckDescription('');
    }, 3000); // 3 second AI generation simulation
  };

  const openDeck = (deck: Deck) => {
    setSelectedDeck(deck);
    setCurrentSlide(0);
    setCurrentView('deck');
  };

  const closeDeck = () => {
    setCurrentView('home');
    setSelectedDeck(null);
    setCurrentSlide(0);
  };

  const openEditMode = () => {
    if (!selectedDeck) return;
    setCurrentView('edit');
    setChatMessages([{
      role: 'assistant',
      content: `Hi! I'm your AI assistant. I can help you edit "${selectedDeck.title}". You can ask me to:\n\n• Change slide content\n• Adjust colors and styling\n• Add or remove slides\n• Modify text and data\n\nWhat would you like to change?`
    }]);
  };

  const closeEditMode = () => {
    setCurrentView('deck');
    setChatMessages([]);
    setChatInput('');
  };

  const sendChatMessage = () => {
    if (!chatInput.trim() || isAiTyping) return;

    const userMessage = chatInput.trim();
    setChatMessages([...chatMessages, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I've updated the slide content as requested. The changes are now visible in the preview.",
        "Great idea! I've made those adjustments to the color scheme and typography.",
        "I've modified the data on that slide. Check out the updated metrics on the left.",
        "Done! The new slide has been added with the information you provided.",
        "I've refined the content to make it more impactful. What do you think?",
        "Perfect! I've applied those changes. Would you like me to adjust anything else?"
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const nextSlide = () => {
    if (selectedDeck && currentSlide < selectedDeck.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const setSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Render appropriate view based on current state
  if (currentView === 'home') {
    return (
      <>
        <HomeView
          allDecks={allDecks}
          onOpenDeck={openDeck}
          onShowNewDeckModal={() => setShowNewDeckModal(true)}
        />
        <NewDeckModal
          isOpen={showNewDeckModal}
          isGenerating={isGenerating}
          title={newDeckTitle}
          description={newDeckDescription}
          onTitleChange={setNewDeckTitle}
          onDescriptionChange={setNewDeckDescription}
          onGenerate={generateNewDeck}
          onClose={() => setShowNewDeckModal(false)}
        />
      </>
    );
  }

  if (currentView === 'deck' && selectedDeck) {
    return (
      <DeckView
        deck={selectedDeck}
        currentSlide={currentSlide}
        onPrevSlide={prevSlide}
        onNextSlide={nextSlide}
        onSetSlide={setSlide}
        onClose={closeDeck}
        onOpenEditMode={openEditMode}
      />
    );
  }

  if (currentView === 'edit' && selectedDeck) {
    return (
      <EditView
        deck={selectedDeck}
        currentSlide={currentSlide}
        onPrevSlide={prevSlide}
        onNextSlide={nextSlide}
        onSetSlide={setSlide}
        onClose={closeDeck}
        onBackToDeck={closeEditMode}
        chatMessages={chatMessages}
        chatInput={chatInput}
        onChatInputChange={setChatInput}
        onSendMessage={sendChatMessage}
        isAiTyping={isAiTyping}
      />
    );
  }

  return null;
}
