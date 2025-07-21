import { useState } from 'react';

export default function useParticipants() {
  const [participants, setParticipants] = useState([
    { id: 1, name: 'João', count: 0, leftPieces: false },
    { id: 2, name: 'Maria', count: 0, leftPieces: false }
  ]);

  const addParticipant = (name) => {
    if (name.trim()) {
      setParticipants(prev => [
        ...prev,
        { id: Date.now(), name: name.trim(), count: 0, leftPieces: false }
      ]);
      return true;
    }
    return false;
  };

  const removeParticipant = (id) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const updateCount = (id, delta) => {
    setParticipants(prev => prev.map(p => 
      p.id === id ? { ...p, count: Math.max(0, p.count + delta) } : p
    ));
  };

  const togglePenalty = (id) => {
    setParticipants(prev => prev.map(p => 
      p.id === id ? { ...p, leftPieces: !p.leftPieces } : p
    ));
  };

  const getLeader = () => {
    if (participants.length === 0) return null;
    return participants.reduce((prev, current) => 
      prev.count > current.count ? prev : current
    );
  };

  const getSortedParticipants = () => {
    return [...participants].sort((a, b) => b.count - a.count);
  };

  return {
    participants,
    addParticipant,
    removeParticipant,
    updateCount,
    togglePenalty,
    getLeader,
    getSortedParticipants
  };
}