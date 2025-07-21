import { memo, useState } from 'react';
import { Pizza, Plus, Minus, X, AlertCircle, Edit2 } from 'lucide-react';
import { VALIDATION_RULES } from '../utils/validation';
import { pizzaHaptics } from '../utils/hapticFeedback';
import { usePizzaSwipeGestures } from '../hooks/useSwipeGestures';

function ParticipantCard({ 
  participant, 
  position, 
  isLeader, 
  onUpdateCount, 
  onTogglePenalty, 
  onRemove,
  onEditName 
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(participant.name);
  // Swipe gesture handlers
  const handleIncrement = () => {
    if (participant.count >= VALIDATION_RULES.PIZZA_COUNT.MAX) {
      pizzaHaptics.maxReached();
      return;
    }
    const newCount = participant.count + 1;
    pizzaHaptics.milestone(newCount);
    onUpdateCount(participant.id, 1);
  };

  const handleDecrement = () => {
    if (participant.count <= VALIDATION_RULES.PIZZA_COUNT.MIN) {
      return;
    }
    pizzaHaptics.sliceRemoved();
    onUpdateCount(participant.id, -1);
  };

  const { touchRef, isSwiping } = usePizzaSwipeGestures({
    onIncrement: handleIncrement,
    onDecrement: handleDecrement,
    enabled: true
  });

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (editedName.trim() && editedName.trim() !== participant.name) {
      onEditName(participant.id, editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditedName(participant.name);
    setIsEditingName(false);
  };
  return (
    <div
      ref={touchRef}
      className={`bg-white rounded-xl shadow-lg p-6 will-change-transform transition-transform select-none ${
        isLeader && participant.count > 0 ? 'ring-4 ring-yellow-400' : ''
      } ${participant.leftPieces ? 'ring-2 ring-red-400' : ''} ${
        isSwiping ? 'ring-2 ring-blue-400' : ''
      }`}
      style={{
        // Optimize for mobile performance
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {/* Remove button */}
      <button
        onClick={() => {
          pizzaHaptics.participantRemoved();
          onRemove(participant.id);
        }}
        className="float-right text-gray-400 hover:text-red-500 transition"
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Name and Position */}
      <div className="text-center mb-4">
        {isEditingName ? (
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-2xl font-bold text-gray-800 text-center bg-transparent border-b-2 border-orange-500 outline-none"
              style={{ width: `${Math.max(editedName.length, 8)}ch` }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleNameSave();
                if (e.key === 'Escape') handleNameCancel();
              }}
              autoFocus
            />
            <button
              onClick={handleNameSave}
              className="text-green-500 hover:text-green-600"
            >
              ✓
            </button>
            <button
              onClick={handleNameCancel}
              className="text-red-500 hover:text-red-600"
            >
              ✗
            </button>
          </div>
        ) : (
          <div className="relative flex justify-center">
            <h3 className="text-2xl font-bold text-gray-800">{participant.name}</h3>
            <button
              onClick={handleNameEdit}
              className="absolute right-0 top-0 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
        {participant.count > 0 && (
          <span className="text-sm text-gray-500">#{position}</span>
        )}
      </div>

      {/* Pizza Count Display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-orange-500 mb-2 text-center">
          {participant.count}
        </div>
        <div className="text-gray-600 text-center">fatias</div>
        
        {/* Swipe hint */}
        {!isSwiping && participant.count === 0 && (
          <div className="text-xs text-gray-400 mt-2 animate-pulse text-center">
            👆 Toque ou deslize para contar
          </div>
        )}
        
        {isSwiping && (
          <div className="text-xs text-blue-500 mt-2 font-medium text-center">
            🔄 Deslizando...
          </div>
        )}
        
        {/* Pizza Icons */}
        <div className="flex justify-center flex-wrap gap-1 mt-3 min-h-[40px]">
          {[...Array(Math.min(participant.count, 10))].map((_, i) => (
            <Pizza key={i} className="w-8 h-8 text-orange-400" />
          ))}
          {participant.count > 10 && (
            <span className="text-orange-400 font-bold text-xl">+{participant.count - 10}</span>
          )}
        </div>
      </div>

      {/* Penalty Button */}
      <div className="text-center mb-4">
        <button
          onClick={() => {
            pizzaHaptics.penaltyToggled();
            onTogglePenalty(participant.id);
          }}
          className={`flex items-center gap-2 mx-auto px-4 py-2 rounded-lg transition ${
            participant.leftPieces 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          style={{
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <AlertCircle className="w-4 h-4" />
          {participant.leftPieces ? 'Deixou pedaços! 😤' : 'Marcar penalidade'}
        </button>
      </div>

      {/* Control Buttons - Optimized for mobile touch */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            pizzaHaptics.sliceRemoved();
            onUpdateCount(participant.id, -1);
          }}
          className="bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:bg-gray-400 text-white p-4 rounded-full transition-colors shadow-lg disabled:cursor-not-allowed select-none"
          disabled={participant.count <= VALIDATION_RULES.PIZZA_COUNT.MIN}
          style={{
            // Better touch targets for mobile (44px minimum)
            minWidth: '48px',
            minHeight: '48px',
            touchAction: 'manipulation', // Disable zoom on double-tap
            WebkitTapHighlightColor: 'transparent' // Remove tap highlight
          }}
        >
          <Minus className="w-6 h-6" />
        </button>
        <button
          onClick={() => {
            const newCount = participant.count + 1;
            if (newCount >= VALIDATION_RULES.PIZZA_COUNT.MAX) {
              pizzaHaptics.maxReached();
            } else {
              pizzaHaptics.milestone(newCount);
            }
            onUpdateCount(participant.id, 1);
          }}
          className="bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-gray-400 text-white p-4 rounded-full transition-colors shadow-lg disabled:cursor-not-allowed select-none"
          disabled={participant.count >= VALIDATION_RULES.PIZZA_COUNT.MAX}
          style={{
            // Better touch targets for mobile (44px minimum)
            minWidth: '48px',
            minHeight: '48px',
            touchAction: 'manipulation', // Disable zoom on double-tap
            WebkitTapHighlightColor: 'transparent' // Remove tap highlight
          }}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
      
      {/* Max reached indicator */}
      {participant.count >= VALIDATION_RULES.PIZZA_COUNT.MAX && (
        <div className="text-center mt-2 text-xs text-orange-600 font-medium text-center">
          🎆 MÁXIMO ATINGIDO! 🎆
        </div>
      )}
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-render when participant data, position, or leader status actually changes
export default memo(ParticipantCard, (prevProps, nextProps) => {
  return (
    prevProps.participant.id === nextProps.participant.id &&
    prevProps.participant.name === nextProps.participant.name &&
    prevProps.participant.count === nextProps.participant.count &&
    prevProps.participant.leftPieces === nextProps.participant.leftPieces &&
    prevProps.position === nextProps.position &&
    prevProps.isLeader === nextProps.isLeader
  );
});