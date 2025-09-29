import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, MessageCircle, BookOpen } from 'lucide-react';
import { fetchHymnsByDeityMandala } from '../data/hymns';

const VersePanel = ({ isOpen, onClose, selectedData }) => {
  const [currentHymn, setCurrentHymn] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);
  const [hymns, setHymns] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setHymns([]);
    setCurrentHymn(null);
    setIsPlaying(false);
  }, [isOpen, selectedData]);

  const fetchAndShowAllHymns = async () => {
    if (!selectedData) return;
    const { deity, mandala } = selectedData;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHymnsByDeityMandala(deity.key || deity.name.toLowerCase(), mandala.key || mandala.name);
      setHymns(data);
    } catch (err) {
      setError('Failed to load hymns');
    } finally {
      setLoading(false);
    }
  };

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

  // Convert hymnId (e.g. 9.1.2) to API format (e.g. 0900102)
  const hymnIdToApiId = (hymnId) => {
    const parts = hymnId.split('.');
    if (parts.length !== 3) return hymnId;
    return parts[0].padStart(2, '0') + parts[1].padStart(3, '0') + parts[2].padStart(2, '0');
  };

  const handleHymnSelect = async (hymnId) => {
    setLoading(true);
    setError(null);
    setCurrentHymn(null);
    try {
      // Step 1: Ask backend to fetch and save JSON (use full URL)
      const saveRes = await fetch(`http://localhost:3001/fetch-hymn/${hymnId}`, { method: 'POST' });
      if (!saveRes.ok) throw new Error('Backend failed to save JSON');

      // Step 2: Wait 5 seconds before fetching JSON from public/hymn_json
      await new Promise(res => setTimeout(res, 5000));
      const jsonRes = await fetch(`/hymn_json/${hymnId}.json`);
      if (!jsonRes.ok) throw new Error('Saved JSON not found');
      const data = await jsonRes.json();
      setCurrentHymn(data);
    } catch (err) {
      setError('Failed to load hymn JSON');
    } finally {
      setLoading(false);
    }
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
                {loading && <div className="text-gray-500">Loading...</div>}
                {error && <div className="text-red-500">{error}</div>}
                {/* Debug output for fetched hymns */}
                {!loading && !error && (
                  <pre style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.5rem' }}>
                    Hymns fetched: {JSON.stringify(Object.keys(hymns))}
                  </pre>
                )}
                {!loading && !error && connection.hymns.map((hymnId) => (
                  <button
                    key={hymnId}
                    onClick={() => handleHymnSelect(hymnId)}
                    className="transition-colors flex items-center justify-center tracking-wide bg-white hover:bg-lotus-gold/20 text-lotus-gold"
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

          {/* All Hymns Details */}
          {!loading && !error && Array.isArray(hymns) && hymns.length > 0 && (
            <div className="space-y-8">
              {hymns.map((hymn, idx) => (
                <motion.div
                  key={hymn.hymnId || hymn.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Sanskrit */}
                  <div className="bg-gradient-to-r from-lotus-purple/10 to-lotus-pink/10 rounded-lg p-4">
                    <h4 className="font-semibold text-lotus-indigo mb-2" style={{ textDecoration: 'underline' }}>Sanskrit</h4>
                    <p className="text-lg leading-relaxed text-gray-800 font-serif">
                      {hymn.sanskrit}
                    </p>
                  </div>

                  {/* Transliteration */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-lotus-indigo mb-2" style={{ textDecoration: 'underline' }}>Transliteration</h4>
                    <p className="text-sm leading-relaxed text-gray-700 italic">
                      {hymn.transliteration}
                    </p>
                  </div>

                  {/* Translation */}
                  <div className="bg-gradient-to-r from-lotus-gold/10 to-lotus-saffron/10 rounded-lg p-4">
                    <h4 className="font-semibold text-lotus-indigo mb-2" style={{ textDecoration: 'underline' }}>Translation</h4>
                    <p className="text-sm leading-relaxed text-gray-800">
                      {hymn.translation}
                    </p>
                  </div>

                  {/* Meaning */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-lotus-indigo mb-2" style={{ textDecoration: 'underline' }}>Meaning</h4>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {hymn.meaning}
                    </p>
                  </div>

                  {/* Audio Player */}
                  {hymn.audio && (
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
                        src={hymn.audio}
                        onEnded={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Current Hymn JSON */}
          {loading && <div className="text-gray-500">Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {currentHymn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {['version_eichler', 'translation_griffith', 'translation_renou', 'translation_geldner', 'translation_elizarenkova'].map(id => {
                const obj = currentHymn.versions?.find(v => v.id === id);
                if (!obj) return null;
                return (
                  <div key={id} className="bg-gradient-to-r from-lotus-purple/10 to-lotus-pink/10 rounded-lg p-4" style={{ maxHeight: '60vh', overflow: 'auto', fontSize: '1.15rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
                    <h4 className="font-semibold text-lotus-indigo mb-2" style={{ textDecoration: 'underline', fontSize: '1.25em' }}>{obj.source || id}</h4>
                    <div style={{ fontSize: '1.1em' }}><strong>Language:</strong> {obj.language}</div>
                    <div style={{ fontSize: '1.1em' }}><strong>Form:</strong> <pre style={{ margin: 0, fontSize: '1.1em' }}>{JSON.stringify(obj.form, null, 2)}</pre></div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VersePanel;

