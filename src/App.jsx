import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, BookOpen, Info } from 'lucide-react';
import LotusChordDiagram from './components/LotusChordDiagram';
import VersePanel from './components/VersePanel';

function App() {
  const [selectedChord, setSelectedChord] = useState(null);
  const [isVersePanelOpen, setIsVersePanelOpen] = useState(false);

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            position: 'relative',
            top: '0',
            left: '0',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            marginTop: '2.5rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '700px',
              minWidth: '320px',
              height: 'auto',
              minHeight: '500px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LotusChordDiagram
              onChordClick={handleChordClick}
              selectedChord={selectedChord}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
        {(isVersePanelOpen && selectedChord && selectedChord.connection && selectedChord.connection.hymns && selectedChord.connection.hymns.length > 0) && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'left',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              position: 'relative',
              padding: '2rem',
              marginLeft: '1.5rem',
              background: 'rgba(255, 255, 220, 0.85)',
              borderRadius: '24px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              width: '37%',
              minWidth: '320px',
              minHeight: '600px',
              maxHeight: '80vh',
              overflow: 'auto',
              textAlign: 'left',
              marginTop: '2.5rem',
            }}
          >
            <VersePanel
              isOpen={true}
              onClose={handleCloseVersePanel}
              selectedData={selectedChord}
            />
          </div>
        )}
      </div>

      {/* VersePanel and Diagram only; Chatbot removed for clean deployment */}
    </div>
  );
}

export default App;
