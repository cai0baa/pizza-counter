import { useCallback, useMemo, useState, useEffect } from 'react';
import { validateParticipantName, validatePizzaCount, checkForDuplicateName } from '../utils/validation';
import { useParticipantsStorage } from './useLocalStorage';

export default function useParticipants() {
  const [participants, setParticipants] = useParticipantsStorage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [delayedSortedParticipants, setDelayedSortedParticipants] = useState([]);
  const [frozenLayout, setFrozenLayout] = useState([]);

  const addParticipant = useCallback((name) => {
    const validation = validateParticipantName(name);
    const duplicateCheck = checkForDuplicateName(name, participants);
    
    if (validation.isValid && !duplicateCheck.isDuplicate) {
      setParticipants(prev => [
        ...prev,
        { id: Date.now(), name: validation.sanitized, count: 0, leftPieces: false }
      ]);
      setIsUpdating(false);
      setDelayedSortedParticipants([]);
      setFrozenLayout([]);
      return { success: true };
    }
    
    return { 
      success: false, 
      errors: [...validation.errors, ...(duplicateCheck.error ? [duplicateCheck.error] : [])]
    };
  }, [participants, setParticipants]);

  const removeParticipant = useCallback((id) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
    setIsUpdating(false);
    setDelayedSortedParticipants([]);
    setFrozenLayout([]);
  }, [setParticipants]);

  const updateCount = useCallback((id, delta) => {
    // Freeze current layout on first update if not already frozen
    if (!isUpdating && delayedSortedParticipants.length > 0) {
      setFrozenLayout([...delayedSortedParticipants]);
    }
    setIsUpdating(true);
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        const newCount = p.count + delta;
        const validation = validatePizzaCount(newCount);
        return { ...p, count: validation.sanitized };
      }
      return p;
    }));
  }, [setParticipants, isUpdating, delayedSortedParticipants]);

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

  const resetCounters = useCallback(() => {
    setParticipants(prev => prev.map(p => ({ ...p, count: 0, leftPieces: false })));
    setIsUpdating(false);
    setDelayedSortedParticipants([]);
    setFrozenLayout([]);
  }, [setParticipants]);

  const resetEverything = useCallback(() => {
    setParticipants([]);
    setIsUpdating(false);
    setDelayedSortedParticipants([]);
    setFrozenLayout([]);
  }, [setParticipants]);

  // Memoize expensive calculations for mobile performance
  const leader = useMemo(() => {
    if (participants.length === 0) return null;
    return participants.reduce((prev, current) => 
      prev.count > current.count ? prev : current
    );
  }, [participants]);

  // Immediate sorted participants for position calculation
  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => b.count - a.count);
  }, [participants]);

  // Delayed sorting with debounce to prevent jumping during rapid clicks
  useEffect(() => {
    if (isUpdating) {
      const timer = setTimeout(() => {
        const newSorted = [...participants].sort((a, b) => b.count - a.count);
        setDelayedSortedParticipants(newSorted);
        setFrozenLayout([]);
        setIsUpdating(false);
      }, 1500); // 1.5 second delay

      return () => clearTimeout(timer);
    } else if (!isUpdating && participants.length > 0) {
      // Update immediately when not actively updating
      setDelayedSortedParticipants([...participants].sort((a, b) => b.count - a.count));
    }
  }, [participants, isUpdating]);

  // Initialize delayed sorted participants when participants change
  useEffect(() => {
    if (delayedSortedParticipants.length === 0 && participants.length > 0) {
      setDelayedSortedParticipants([...participants].sort((a, b) => b.count - a.count));
    }
  }, [participants, delayedSortedParticipants.length]);

  // Reset delayed sorted when participants is empty
  useEffect(() => {
    if (participants.length === 0) {
      setDelayedSortedParticipants([]);
      setFrozenLayout([]);
      setIsUpdating(false);
    }
  }, [participants.length]);

  return {
    participants,
    addParticipant,
    removeParticipant,
    updateCount,
    togglePenalty,
    editParticipantName,
    resetCounters,
    resetEverything,
    leader,
    sortedParticipants,
    delayedSortedParticipants,
    frozenLayout,
    isUpdating
  };
}