import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, BookOpen, Info } from 'lucide-react';
import LotusChordDiagram from './components/LotusChordDiagram';
import VersePanel from './components/VersePanel';
import Chatbot from './components/Chatbot';

function App() {
  const [selectedChord, setSelectedChord] = useState(null);
  const [isVersePanelOpen, setIsVersePanelOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleChordClick = (data) => {
    setSelectedChord(data);
    if (data.type === 'chord') {
      setIsVersePanelOpen(true);
    }
  };

  const handleCloseVersePanel = () => {
    setIsVersePanelOpen(false);
    setSelectedChord(null);
  };

  const handleOpenChatbot = () => {
    setIsChatbotOpen(true);
  };

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
  };

  return (
  <div className="min-h-screen flex items-center justify-center">
      <LotusChordDiagram 
        onChordClick={handleChordClick}
        selectedChord={selectedChord}
      />

      {/* Components */}
      <VersePanel
        isOpen={isVersePanelOpen}
        onClose={handleCloseVersePanel}
        selectedData={selectedChord}
      />

      <Chatbot
        isOpen={isChatbotOpen}
        onClose={handleCloseChatbot}
        context={selectedChord}
      />
    </div>
  );
}

export default App;
