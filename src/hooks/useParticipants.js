import { useCallback, useMemo } from 'react';
import { validateParticipantName, validatePizzaCount, checkForDuplicateName } from '../utils/validation';
import { useParticipantsStorage } from './useLocalStorage';

export default function useParticipants() {
  const [participants, setParticipants] = useParticipantsStorage();

  const addParticipant = useCallback((name) => {
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
  }, [participants, setParticipants]);

  const removeParticipant = useCallback((id) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  }, [setParticipants]);

  const updateCount = useCallback((id, delta) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        const newCount = p.count + delta;
        const validation = validatePizzaCount(newCount);
        return { ...p, count: validation.sanitized };
      }
      return p;
    }));
  }, [setParticipants]);

  const togglePenalty = useCallback((id) => {
    setParticipants(prev => prev.map(p => 
      p.id === id ? { ...p, leftPieces: !p.leftPieces } : p
    ));
  }, [setParticipants]);

  const editParticipantName = useCallback((id, newName) => {
    const validation = validateParticipantName(newName);
    const duplicateCheck = checkForDuplicateName(newName, participants.filter(p => p.id !== id));
    
    if (validation.isValid && !duplicateCheck.isDuplicate) {
      setParticipants(prev => prev.map(p => 
        p.id === id ? { ...p, name: validation.sanitized } : p
      ));
      return { success: true };
    }
    
    return { 
      success: false, 
      errors: [...validation.errors, ...(duplicateCheck.error ? [duplicateCheck.error] : [])]
    };
  }, [participants, setParticipants]);

  // Memoize expensive calculations for mobile performance
  const leader = useMemo(() => {
    if (participants.length === 0) return null;
    return participants.reduce((prev, current) => 
      prev.count > current.count ? prev : current
    );
  }, [participants]);

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => b.count - a.count);
  }, [participants]);

  return {
    participants,
    addParticipant,
    removeParticipant,
    updateCount,
    togglePenalty,
    editParticipantName,
    leader,
    sortedParticipants
  };
}