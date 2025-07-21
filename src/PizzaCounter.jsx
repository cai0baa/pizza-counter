import React, { useState } from 'react';
import { Pizza } from 'lucide-react';
import ParticipantCard from './components/ParticipantCard';
import ActionButtons from './components/ActionButtons';
import Leaderboard from './components/Leaderboard';
import useParticipants from './hooks/useParticipants';

export default function PizzaCounter() {
  const {
    participants,
    addParticipant,
    removeParticipant,
    updateCount,
    togglePenalty,
    getLeader,
    getSortedParticipants
  } = useParticipants();
  
  const [newName, setNewName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddParticipant = (sanitizedName) => {
    const result = addParticipant(sanitizedName || newName);
    if (result.success) {
      setNewName('');
      setShowAddForm(false);
    }
    // If validation fails, AddParticipantForm will show the errors
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewName('');
  };

  const generateWhatsAppMessage = () => {
    const sorted = [...participants].sort((a, b) => b.count - a.count);
    const winner = sorted[0];
    const total = participants.reduce((sum, p) => sum + p.count, 0);
    
    let message = `🍕 *RESULTADOS DA COMPETIÇÃO DE PIZZA* 🍕\n`;
    message += `📅 ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    
    if (winner && winner.count > 0) {
      message += `👑 *${winner.name.toUpperCase()} É O REI DA PIZZA!* 👑\n`;
      message += `🏆 Devorou ${winner.count} fatias! MONSTRO SAGRADO! 🔥\n\n`;
    }
    
    message += `📊 *RANKING DOS COMEDORES:*\n`;
    
    sorted.forEach((p, index) => {
      const position = index + 1;
      let emoji = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '💩';
      
      message += `\n${emoji} *${position}º lugar: ${p.name}*\n`;
      message += `🍕 ${p.count} fatias\n`;
      
      // Frases debochadas baseadas na performance
      if (p.count === 0) {
        message += `_"Veio só pra olhar? Patético! 🤡"_\n`;
      } else if (p.count < 5) {
        message += `_"Comeu igual passarinho! Fraquíssimo! 🐤"_\n`;
      } else if (p.count < 10) {
        message += `_"Esforço medíocre de amador! 😑"_\n`;
      } else if (p.count < 15) {
        message += `_"Até que tentou, mas faltou fome! 💪"_\n`;
      } else if (p.count < 20) {
        message += `_"Guerreiro respeitável! 🗿"_\n`;
      } else {
        message += `_"MÁQUINA DE DESTRUIÇÃO! RESPEITA! 🚀"_\n`;
      }
      
      // Penalidade
      if (p.leftPieces) {
        message += `⚠️ *PENALIDADE: DEIXOU PEDAÇOS!* ⚠️\n`;
        message += `_"Desperdício é crime! Fraco e sem honra! 🗑️"_\n`;
      }
    });
    
    // Estatísticas gerais com zoeira
    message += `\n📈 *ESTATÍSTICAS DA CARNIFICINA:*\n`;
    message += `🍕 Total devorado: ${total} fatias\n`;
    message += `💰 Prejuízo da pizzaria: INCALCULÁVEL\n`;
    message += `😭 Pizzaiolos chorando: SIM\n`;
    
    // Menções desonrosas
    const weakest = sorted[sorted.length - 1];
    if (weakest && weakest.count < 5) {
      message += `\n🏳️ *MENÇÃO DESONROSA:*\n`;
      message += `${weakest.name} deveria ter ficado em casa! 🏠\n`;
    }
    
    const leftPiecesCount = participants.filter(p => p.leftPieces).length;
    if (leftPiecesCount > 0) {
      message += `\n🚨 *ALERTA DE DESPERDÍCIO:*\n`;
      message += `${leftPiecesCount} covarde(s) deixaram pedaços! INADMISSÍVEL! 😤\n`;
    }
    
    message += `\n_Gerado pelo App Contador de Pizza_ 🍕\n`;
    message += `#CompetidorDePizza #ReiDaMassa #GordiceTotal`;
    
    // Copiar para clipboard
    navigator.clipboard.writeText(message);
    
    // Abrir WhatsApp Web
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const leader = getLeader();
  const sortedParticipants = getSortedParticipants();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Pizza className="w-12 h-12 text-orange-500 animate-pulse" />
            <h1 className="text-4xl font-bold text-gray-800">Competição de Pizza</h1>
            <Pizza className="w-12 h-12 text-orange-500 animate-pulse" />
          </div>
          <p className="text-gray-600">Quem será o campeão de hoje? 🍕</p>
        </div>

        <Leaderboard leader={leader} />

        <ActionButtons
          showAddForm={showAddForm}
          participants={participants}
          newName={newName}
          onShowAddForm={() => setShowAddForm(true)}
          onNameChange={setNewName}
          onAddParticipant={handleAddParticipant}
          onCancelAdd={handleCancelAdd}
          onExportWhatsApp={generateWhatsAppMessage}
        />

        {/* Participants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedParticipants.map((participant, index) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              position={index + 1}
              isLeader={index === 0}
              onUpdateCount={updateCount}
              onTogglePenalty={togglePenalty}
              onRemove={removeParticipant}
            />
          ))}
        </div>

        {/* Empty State */}
        {participants.length === 0 && (
          <div className="text-center py-12">
            <Pizza className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Nenhum participante ainda!</p>
            <p className="text-gray-400">Clique em "Adicionar Participante" para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}