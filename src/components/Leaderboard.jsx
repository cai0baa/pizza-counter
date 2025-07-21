import { Trophy } from 'lucide-react';

export default function Leaderboard({ leader }) {
  if (!leader || leader.count === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 mb-6 text-center animate-bounce">
      <div className="flex justify-center items-center gap-2">
        <Trophy className="w-8 h-8 text-yellow-600" />
        <span className="text-2xl font-bold text-yellow-800">
          {leader.name} está liderando com {leader.count} fatias!
        </span>
        <Trophy className="w-8 h-8 text-yellow-600" />
      </div>
    </div>
  );
}