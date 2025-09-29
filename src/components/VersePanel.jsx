import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, MessageCircle, BookOpen } from 'lucide-react';
import { hymns } from '../data/hymns';

const VersePanel = ({ isOpen, onClose, selectedData }) => {
  const [currentHymn, setCurrentHymn] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  // Remove auto-select of first hymn

  const handlePlayPause = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleHymnSelect = (hymnId) => {
    setCurrentHymn(hymns[hymnId]);
    setIsPlaying(false);
  };

  if (!isOpen || !selectedData) return null;

  const { mandala, deity, connection } = selectedData;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
        style={{ fontFamily: "'Noto Serif', serif" }}
      >
        {/* Absolute Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/30 hover:bg-lotus-gold/80 text-lotus-gold rounded-full shadow transition-colors z-10"
          aria-label="Close Verse Panel"
        >
          <X size={24} />
        </button>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-lotus-gold to-lotus-goldDark p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
        <h2 className="text-xl font-bold" style={{ textDecoration: 'underline' }}>{deity.name}</h2>
        <p className="text-sm opacity-90" style={{ textDecoration: 'underline' }}>{mandala.name}</p>
            </div>
          </div>

          <div className="bg-white/20 rounded-lg p-3">
            <p className="text-sm font-medium">{connection.count} hymns</p>
            <p className="text-xs opacity-90">{deity.description}</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-grow">
          {/* Hymn Navigation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center" style={{ textDecoration: 'underline' }}>              Available Hymns
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '1rem', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '1rem' }}>
                {connection.hymns.map((hymnId) => (
                  <button
                    key={hymnId}
                    onClick={() => handleHymnSelect(hymnId)}
                    className={`transition-colors flex items-center justify-center tracking-wide ${
                      currentHymn && hymns[hymnId] === currentHymn
                        ? 'bg-lotus-gold text-white border-lotus-goldDark scale-105'
                        : 'bg-white hover:bg-lotus-gold/20 text-lotus-gold'
                    }`}
                    style={{
                      padding: '1rem 1.75rem',
                      borderRadius: '1rem',
                      fontSize: '1.15rem',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: '2px solid #e8b42a',
                      minWidth: '110px',
                      maxWidth: '170px',
                      width: 'auto',
                    }}
                  >
                    {hymnId}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Hymn Details */}
          {currentHymn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Sanskrit */}
              <div className="bg-gradient-to-r from-lotus-purple/10 to-lotus-pink/10 rounded-lg p-4">
                <h4 className="font-semibold text-lotus-indigo mb-2" style={{ textDecoration: 'underline' }}>Sanskrit</h4>
                <p className="text-lg leading-relaxed text-gray-800 font-serif">
                  {currentHymn.sanskrit}
                </p>
              </div>

              {/* Transliteration */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-lotus-indigo mb-2" style={{ textDecoration: 'underline' }}>Transliteration</h4>
                <p className="text-sm leading-relaxed text-gray-700 italic">
                  {currentHymn.transliteration}
                </p>
              </div>

              {/* Translation */}
              <div className="bg-gradient-to-r from-lotus-gold/10 to-lotus-saffron/10 rounded-lg p-4">
                <h4 className="font-semibold text-lotus-indigo mb-2" style={{ textDecoration: 'underline' }}>Translation</h4>
                <p className="text-sm leading-relaxed text-gray-800">
                  {currentHymn.translation}
                </p>
              </div>

              {/* Meaning */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-lotus-indigo mb-2" style={{ textDecoration: 'underline' }}>Meaning</h4>
                <p className="text-sm leading-relaxed text-gray-700">
                  {currentHymn.meaning}
                </p>
              </div>

              {/* Audio Player */}
              <div className="bg-gradient-to-r from-lotus-purple/20 to-lotus-pink/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handlePlayPause}
                      className="p-3 bg-lotus-gold hover:bg-lotus-goldDark text-white rounded-full transition-colors"
                      aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <div>
                      <p className="font-medium text-gray-800">Chant Audio</p>
                      <p className="text-xs text-gray-600">Traditional Vedic recitation</p>
                    </div>
                  </div>
                  <Volume2 size={20} className="text-lotus-purple" />
                </div>

                <audio
                  ref={setAudioRef}
                  src={currentHymn.audio}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>
            </motion.div>
          )}

          {/* Chatbot Integration */}
          <div className="bg-gradient-to-r from-lotus-purple/10 to-lotus-pink/10 rounded-lg p-4">
            <h4 className="font-semibold text-lotus-indigo mb-2 flex items-center">
              <MessageCircle size={16} className="mr-2" />
              Ask About This Hymn
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Curious about the symbolism or meaning? Ask our AI guide.
            </p>
            <button className="w-full bg-lotus-purple hover:bg-lotus-purple/80 text-white py-2 px-4 rounded-lg transition-colors text-sm">
              Open Chatbot
            </button>
          </div>

          {/* Deity Themes */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-lotus-indigo mb-2">Themes</h4>
            <div className="flex flex-wrap gap-2">
              {deity.themes.map((theme, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-lotus-gold/20 text-lotus-indigo rounded-full text-xs"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VersePanel;

