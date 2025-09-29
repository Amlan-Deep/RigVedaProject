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
    <div className="min-h-screen" style={{ backgroundColor: '#ecd6b0', marginTop: '0', height: '120vh', overflow: 'hidden' }}>
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginTop: '0',
          marginBottom: '0',
          marginRight: '0',
          letterSpacing: '0.05em',
          color: '#7c4700',
          textShadow: '0 2px 8px #f6d88a',
          textAlign: 'center',
          width: '100%',
          textDecoration: 'underline',
          fontFamily: `'Tiro Devanagari Sanskrit', 'Noto Serif', serif`
        }}
      >
        Rig Veda Chakra
      </h1>

      {/* Flex row containing diagram and verse panel */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
  <div style={{ position: 'relative', top: '-150px', left: '-250px', width: '75%' }}>
          <LotusChordDiagram
            onChordClick={handleChordClick}
            selectedChord={selectedChord}
          />
        </div>
        {(isVersePanelOpen && selectedChord && selectedChord.connection && selectedChord.connection.hymns && selectedChord.connection.hymns.length > 0) && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'left', fontSize: '1.5rem', fontWeight: 'bold', position: 'relative', padding: '2rem', top: '120px', left: '-150px', marginLeft: '1.5rem', background: 'rgba(255, 255, 220, 0.85)', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '37%', minWidth: '320px', minHeight: '600px', maxHeight: '80vh', overflow: 'auto', textAlign: 'left' }}>
            <VersePanel
              isOpen={true}
              onClose={handleCloseVersePanel}
              selectedData={selectedChord}
            />
          </div>
        )}
      </div>

      {/* Chatbot remains independently rendered */}
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={handleCloseChatbot}
        context={selectedChord}
      />
    </div>
  );
}

export default App;
