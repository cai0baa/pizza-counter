import { Plus, X } from 'lucide-react';

export default function AddParticipantForm({ 
  newName, 
  onNameChange, 
  onAdd, 
  onCancel 
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAdd();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex gap-2 items-center">
      <input
        type="text"
        value={newName}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Nome do participante"
        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
        autoFocus
      />
      <button
        onClick={onAdd}
        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition"
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
  );
}