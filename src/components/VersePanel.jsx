import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, MessageCircle, BookOpen } from 'lucide-react';
import { hymns } from '../data/hymns';

const VersePanel = ({ isOpen, onClose, selectedData }) => {
  const [currentHymn, setCurrentHymn] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  useEffect(() => {
    if (selectedData?.connection?.hymns) {
      const firstHymn = selectedData.connection.hymns[0];
      setCurrentHymn(hymns[firstHymn] || null);
    }
  }, [selectedData]);

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
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-lotus-gold to-lotus-goldDark p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{deity.symbol}</span>
              <div>
                <h2 className="text-xl font-bold">{deity.name}</h2>
                <p className="text-sm opacity-90">{mandala.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="bg-white/20 rounded-lg p-3">
            <p className="text-sm font-medium">{connection.count} hymns</p>
            <p className="text-xs opacity-90">{deity.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Hymn Navigation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <BookOpen size={16} className="mr-2" />
              Available Hymns
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {connection.hymns.map((hymnId, index) => (
                <button
                  key={hymnId}
                  onClick={() => handleHymnSelect(hymnId)}
                  className={`p-2 rounded text-sm transition-colors ${
                    currentHymn && hymns[hymnId] === currentHymn
                      ? 'bg-lotus-gold text-white'
                      : 'bg-white hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {hymnId}
                </button>
              ))}
            </div>
          </div>

          {/* Current Hymn */}
          {currentHymn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Sanskrit Text */}
              <div className="bg-gradient-to-r from-lotus-purple/10 to-lotus-pink/10 rounded-lg p-4">
                <h4 className="font-semibold text-lotus-indigo mb-2">Sanskrit</h4>
                <p className="text-lg leading-relaxed text-gray-800 font-serif">
                  {currentHymn.sanskrit}
                </p>
              </div>

              {/* Transliteration */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-lotus-indigo mb-2">Transliteration</h4>
                <p className="text-sm leading-relaxed text-gray-700 italic">
                  {currentHymn.transliteration}
                </p>
              </div>

              {/* Translation */}
              <div className="bg-gradient-to-r from-lotus-gold/10 to-lotus-saffron/10 rounded-lg p-4">
                <h4 className="font-semibold text-lotus-indigo mb-2">Translation</h4>
                <p className="text-sm leading-relaxed text-gray-800">
                  {currentHymn.translation}
                </p>
              </div>

              {/* Meaning */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-lotus-indigo mb-2">Meaning</h4>
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
                
                {/* Hidden audio element */}
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
