import { memo } from 'react';
import { UserPlus, Share2 } from 'lucide-react';
import AddParticipantForm from './AddParticipantForm';

function ActionButtons({ 
  showAddForm, 
  participants, 
  newName,
  onShowAddForm, 
  onNameChange,
  onAddParticipant,
  onCancelAdd,
  onExportWhatsApp 
}) {
  const hasParticipantsWithCount = participants.length > 0 && participants.some(p => p.count > 0);

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