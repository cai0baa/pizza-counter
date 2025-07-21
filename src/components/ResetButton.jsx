import { memo, useState } from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { pizzaHaptics } from '../utils/hapticFeedback';

function ResetButton({ 
  onResetCounts, 
  onClearAll, 
  participantCount, 
  hasActiveCompetition,
  className = '' 
}) {
  const [showOptions, setShowOptions] = useState(false);

  const handleResetCounts = () => {
    pizzaHaptics.importantAction();
    onResetCounts();
    setShowOptions(false);
  };

  const handleClearAll = () => {
    pizzaHaptics.importantAction();
    onClearAll();
    setShowOptions(false);
  };

  // Don't show if no participants
  if (participantCount === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {!showOptions ? (
        <button
          onClick={() => setShowOptions(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transform transition hover:scale-105 shadow-lg"
          style={{
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <RotateCcw className="w-5 h-5" />
          Reiniciar
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl border-2 border-orange-200 p-4 space-y-3 min-w-[200px]">
          <div className="text-center">
            <h3 className="font-bold text-gray-800 mb-1">Reiniciar Competição</h3>
            <p className="text-xs text-gray-600">Escolha uma opção:</p>
          </div>
          
          <div className="space-y-2">
            {hasActiveCompetition && (
              <button
                onClick={handleResetCounts}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition"
                style={{
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <RotateCcw className="w-4 h-4" />
                <div className="text-left">
                  <div>Zerar Contadores</div>
                  <div className="text-xs opacity-90">Manter participantes</div>
                </div>
              </button>
            )}
            
            <button
              onClick={handleClearAll}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition"
              style={{
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <Trash2 className="w-4 h-4" />
              <div className="text-left">
                <div>Limpar Tudo</div>
                <div className="text-xs opacity-90">Remover todos</div>
              </div>
            </button>
          </div>
          
          <button
            onClick={() => setShowOptions(false)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition text-sm"
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(ResetButton);