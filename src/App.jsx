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

      {/* Flex row containing diagram and verse panel with responsive layout */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
        flexWrap: 'wrap', // allow wrapping on small screens
        gap: '2rem' // gap helps prevent overlap
      }}>
        <div style={{
          flex: '1 1 500px',    // grow and shrink as needed, min width 500px
          minWidth: '350px',
          maxWidth: '900px',
          marginBottom: '2rem'
        }}>
          <LotusChordDiagram
            onChordClick={handleChordClick}
            selectedChord={selectedChord}
          />
        </div>
        {(isVersePanelOpen && selectedChord?.connection?.hymns?.length > 0) && (
          <div style={{
            flex: '1 1 350px', // dynamically grows/shrinks
            minWidth: '300px',
            maxWidth: '540px',
            padding: '2rem',
            background: 'rgba(255, 255, 220, 0.85)',
            borderRadius: '24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            marginBottom: '2rem',
            overflow: 'auto',
            textAlign: 'left',
            fontSize: '1.1rem' // scale down a bit for mobile
          }}>
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
