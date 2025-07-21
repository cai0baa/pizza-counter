import { useState } from 'react';
import { validateParticipantName, validatePizzaCount, checkForDuplicateName } from '../utils/validation';

export default function useParticipants() {
  const [participants, setParticipants] = useState([
    { id: 1, name: 'João', count: 0, leftPieces: false },
    { id: 2, name: 'Maria', count: 0, leftPieces: false }
  ]);

  const addParticipant = (name) => {
    const validation = validateParticipantName(name);
    const duplicateCheck = checkForDuplicateName(name, participants);
    
    if (validation.isValid && !duplicateCheck.isDuplicate) {
      setParticipants(prev => [
        ...prev,
        { id: Date.now(), name: validation.sanitized, count: 0, leftPieces: false }
      ]);
      return { success: true };
    }
    
    return { 
      success: false, 
      errors: [...validation.errors, ...(duplicateCheck.error ? [duplicateCheck.error] : [])]
    };
  };

  const removeParticipant = (id) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const updateCount = (id, delta) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        const newCount = p.count + delta;
        const validation = validatePizzaCount(newCount);
        return { ...p, count: validation.sanitized };
      }
      return p;
    }));
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