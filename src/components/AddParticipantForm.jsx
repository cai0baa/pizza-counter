import { useState } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import useValidation from '../hooks/useValidation';
import { containsEmoji, getEmojiCount } from '../utils/validation';

export default function AddParticipantForm({ 
  newName, 
  onNameChange, 
  onAdd, 
  onCancel,
  existingParticipants = []
}) {
  const { validateName } = useValidation();
  const [showValidation, setShowValidation] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const handleAdd = () => {
    const validation = validateName(newName, existingParticipants);
    setShowValidation(true);
    
    if (validation.isValid) {
      onAdd(validation.sanitized);
      setShowValidation(false);
    }
  };

  const handleNameChange = (value) => {
    onNameChange(value);
    if (showValidation) {
      // Re-validate on change if we're already showing validation
      validateName(value, existingParticipants);
    }
  };

  const currentValidation = validateName(newName, existingParticipants);
  const hasEmojiSupport = containsEmoji(newName);
  const emojiCount = getEmojiCount(newName);
  const showErrors = showValidation && !currentValidation.isValid;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-2">
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <input
            type="text"
            value={newName}
            onChange={(e) => handleNameChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nome do participante (emojis permitidos! 🍕)"
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition ${
              showErrors 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-green-500'
            }`}
            maxLength={30}
            autoFocus
          />
          
          {/* Validation feedback */}
          {showErrors && (
            <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              <span>{currentValidation.errors[0]}</span>
            </div>
          )}
          
          {/* Fun emoji feedback */}
          {hasEmojiSupport && !showErrors && (
            <div className="mt-1 text-sm text-green-600">
              🎉 {emojiCount} emoji{emojiCount > 1 ? 's' : ''} detectado{emojiCount > 1 ? 's' : ''}!
            </div>
          )}
          
          {/* Character counter */}
          <div className="mt-1 text-xs text-gray-500">
            {newName.length}/30 caracteres
          </div>
        </div>
        
        <button
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white p-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}