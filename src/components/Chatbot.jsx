import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const Chatbot = ({ isOpen, onClose, context }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([{
        id: 1,
        type: 'bot',
        text: `🕉️ Namaste! I'm your guide to the Rig Veda. ${context ? `I see you're exploring ${context.deity?.name} in ${context.mandala?.name}. How can I help you understand these sacred hymns?` : 'How can I help you explore the divine hymns today?'}`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, context]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue, context);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput, context) => {
    const input = userInput.toLowerCase();
    
    // Context-aware responses
    if (context?.deity && context?.mandala) {
      if (input.includes('why') || input.includes('meaning')) {
        return {
          id: Date.now() + 1,
          type: 'bot',
          text: `${context.deity.name} in ${context.mandala.name} represents the divine aspect of ${context.deity.themes.join(', ').toLowerCase()}. The hymns here invoke ${context.deity.name}'s power to bring ${context.deity.description.toLowerCase()}.`,
          timestamp: new Date()
        };
      }
      
      if (input.includes('symbol') || input.includes('symbolism')) {
        return {
          id: Date.now() + 1,
          type: 'bot',
          text: `The symbol ${context.deity.symbol} represents ${context.deity.name}'s essence. In Vedic tradition, this symbolizes the divine energy that connects the material and spiritual realms.`,
          timestamp: new Date()
        };
      }
    }

    // General responses
    if (input.includes('agni')) {
      return {
        id: Date.now() + 1,
        type: 'bot',
        text: "🔥 Agni is the divine fire, the messenger between gods and humans. He's invoked first in most rituals as the sacred fire that carries offerings to the gods. Agni represents wisdom, purification, and the transformative power of fire.",
        timestamp: new Date()
      };
    }

    if (input.includes('indra')) {
      return {
        id: Date.now() + 1,
        type: 'bot',
        text: "⚡ Indra is the king of gods, wielder of the thunderbolt. He's the warrior god who defeats demons and brings rain. Indra represents strength, courage, and the power to overcome obstacles.",
        timestamp: new Date()
      };
    }

    if (input.includes('soma')) {
      return {
        id: Date.now() + 1,
        type: 'bot',
        text: "🌿 Soma is both a sacred plant and the divine drink of immortality. The hymns describe Soma as the elixir that gives strength to gods and humans alike, representing divine inspiration and spiritual ecstasy.",
        timestamp: new Date()
      };
    }

    if (input.includes('mandala')) {
      return {
        id: Date.now() + 1,
        type: 'bot',
        text: "The Mandalas are the ten books of the Rig Veda, each containing hymns by different families of sages. They represent different aspects of cosmic order and divine knowledge, like petals of a lotus unfolding.",
        timestamp: new Date()
      };
    }

    if (input.includes('rig veda') || input.includes('veda')) {
      return {
        id: Date.now() + 1,
        type: 'bot',
        text: "The Rig Veda is the oldest sacred text of Hinduism, containing over 1,000 hymns to various deities. It's considered the foundation of Vedic knowledge, exploring the relationship between humans, nature, and the divine.",
        timestamp: new Date()
      };
    }

    if (input.includes('lotus') || input.includes('symbolism')) {
      return {
        id: Date.now() + 1,
        type: 'bot',
        text: "🪷 The lotus symbolizes spiritual enlightenment and divine beauty. Like this visualization, the Rig Veda unfolds like a lotus - each Mandala a petal revealing deeper layers of cosmic wisdom and divine connection.",
        timestamp: new Date()
      };
    }

    // Default response
    return {
      id: Date.now() + 1,
      type: 'bot',
      text: "I'd be happy to help you explore the Rig Veda! You can ask about specific deities like Agni or Indra, learn about the Mandalas, or ask about the symbolism and meaning of the hymns. What would you like to know?",
      timestamp: new Date()
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end justify-end p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-t-2xl shadow-2xl w-full max-w-md h-96 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-lotus-purple to-lotus-pink p-4 rounded-t-2xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Rig Veda Guide</h3>
                  <p className="text-xs opacity-90">Your AI companion</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-lotus-gold' : 'bg-lotus-purple'}`}>
                    {message.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-lotus-gold text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-2">
                  <div className="p-2 rounded-full bg-lotus-purple">
                    <Bot size={14} />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the Rig Veda..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lotus-purple focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-2 bg-lotus-purple hover:bg-lotus-purple/80 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Chatbot;
