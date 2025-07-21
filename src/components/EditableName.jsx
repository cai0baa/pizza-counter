import { useState, useRef, useEffect } from 'react';
import { Edit3, Check, X, AlertCircle } from 'lucide-react';
import { validateParticipantName, containsEmoji, getEmojiCount } from '../utils/validation';
import { pizzaHaptics } from '../utils/hapticFeedback';

export default function EditableName({ 
  name, 
  onSave, 
  existingNames = [],
  className = '',
  nameClassName = 'text-2xl font-bold text-gray-800'
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const [showValidation, setShowValidation] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setIsEditing(true);
    setEditValue(name);
    setShowValidation(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue(name);
    setShowValidation(false);
  };

  const saveEdit = async () => {
    const validation = validateParticipantName(editValue);
    const isDuplicate = existingNames.some(existingName => 
      existingName !== name && existingName.toLowerCase() === editValue.trim().toLowerCase()
    );

    setShowValidation(true);

    if (validation.isValid && !isDuplicate) {
      const result = await onSave(validation.sanitized);
      if (result?.success !== false) {
        pizzaHaptics.success();
        setIsEditing(false);
        setShowValidation(false);
      } else {
        pizzaHaptics.error();
      }
    } else {
      pizzaHaptics.validationError();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const validation = validateParticipantName(editValue);
  const isDuplicate = existingNames.some(existingName => 
    existingName !== name && existingName.toLowerCase() === editValue.trim().toLowerCase()
  );
  const hasEmojiSupport = containsEmoji(editValue);
  const emojiCount = getEmojiCount(editValue);
  const showErrors = showValidation && (!validation.isValid || isDuplicate);
  const errorMessage = isDuplicate ? 'Nome já existe' : validation.errors[0];

  if (isEditing) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none transition text-center ${
              showErrors 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-blue-500 focus:border-blue-600'
            }`}
            maxLength={30}
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          />
          
          <button
            onClick={saveEdit}
            disabled={!editValue.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white p-2 rounded-lg transition"
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <Check className="w-4 h-4" />
          </button>
          
          <button
            onClick={cancelEditing}
            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition"
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Validation feedback */}
        {showErrors && (
          <div className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        {/* Emoji feedback */}
        {hasEmojiSupport && !showErrors && (
          <div className="text-sm text-green-600">
            🎉 {emojiCount} emoji{emojiCount > 1 ? 's' : ''} detectado{emojiCount > 1 ? 's' : ''}!
          </div>
        )}
        
        {/* Character counter */}
        <div className="text-xs text-gray-500 text-center">
          {editValue.length}/30 caracteres
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-2 ${className}`}>
      <h3 className={nameClassName}>{name}</h3>
      <button
        onClick={startEditing}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all p-1 rounded"
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent'
        }}
        title="Editar nome"
      >
        <Edit3 className="w-4 h-4" />
      </button>
    </div>
  );
}