import { Pizza, Plus, Minus, X, AlertCircle } from 'lucide-react';

export default function ParticipantCard({ 
  participant, 
  position, 
  isLeader, 
  onUpdateCount, 
  onTogglePenalty, 
  onRemove 
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 transform transition hover:scale-105 ${
        isLeader && participant.count > 0 ? 'ring-4 ring-yellow-400' : ''
      } ${participant.leftPieces ? 'ring-2 ring-red-400' : ''}`}
    >
      {/* Remove button */}
      <button
        onClick={() => onRemove(participant.id)}
        className="float-right text-gray-400 hover:text-red-500 transition"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Name and Position */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">{participant.name}</h3>
        {participant.count > 0 && (
          <span className="text-sm text-gray-500">#{position}</span>
        )}
      </div>

      {/* Pizza Count Display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-orange-500 mb-2">
          {participant.count}
        </div>
        <div className="text-gray-600">fatias</div>
        
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
          onClick={() => onTogglePenalty(participant.id)}
          className={`flex items-center gap-2 mx-auto px-4 py-2 rounded-lg transition ${
            participant.leftPieces 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          {participant.leftPieces ? 'Deixou pedaços! 😤' : 'Marcar penalidade'}
        </button>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => onUpdateCount(participant.id, -1)}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition transform hover:scale-110 shadow-md"
          disabled={participant.count === 0}
        >
          <Minus className="w-6 h-6" />
        </button>
        <button
          onClick={() => onUpdateCount(participant.id, 1)}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition transform hover:scale-110 shadow-md"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}