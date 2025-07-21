import { memo, useState } from 'react';
import { UserPlus, Share2, RotateCcw, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import AddParticipantForm from './AddParticipantForm';

function ActionButtons({ 
  showAddForm, 
  participants, 
  newName,
  onShowAddForm, 
  onNameChange,
  onAddParticipant,
  onCancelAdd,
  onExportWhatsApp,
  onResetCounters,
  onResetEverything
}) {
  const hasParticipantsWithCount = participants.length > 0 && participants.some(p => p.count > 0);
  const [showResetOptions, setShowResetOptions] = useState(false);

  return (
    <div className="mb-8 flex justify-center gap-4 flex-wrap">
      {!showAddForm ? (
        <>
          <button
            onClick={onShowAddForm}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transform transition hover:scale-105 shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            Adicionar Participante
          </button>
          {hasParticipantsWithCount && (
            <button
              onClick={onExportWhatsApp}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transform transition hover:scale-105 shadow-lg"
            >
              <Share2 className="w-5 h-5" />
              Exportar pro WhatsApp
            </button>
          )}
          {participants.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowResetOptions(!showResetOptions)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transform transition hover:scale-105 shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
                {showResetOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showResetOptions && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[200px]">
                  <button
                    onClick={() => {
                      onResetCounters();
                      setShowResetOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-orange-600"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Resetar Contadores
                  </button>
                  <button
                    onClick={() => {
                      onResetEverything();
                      setShowResetOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Resetar Tudo
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <AddParticipantForm
          newName={newName}
          onNameChange={onNameChange}
          onAdd={onAddParticipant}
          onCancel={onCancelAdd}
          existingParticipants={participants}
        />
      )}
    </div>
  );
}

// Memoize to prevent re-renders when participants data hasn't changed
export default memo(ActionButtons);