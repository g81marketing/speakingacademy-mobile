// ⚠️ DEPRECATED — Gamification (XP, streak, achievements) agora é processado
// automaticamente dentro de src/services/progressService.js a cada POST /progress.
module.exports = {};

// ── POST /gamification/xp ──────────────────────────────────────────────────────
// Adiciona XP manualmente ao usuário (ex: bônus por conquista)
exports.addXp = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ error: 'Quantidade de XP inválida.' });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { xp: amount } },
      { new: true }
    ).select('-password');

    res.json({ xp: user.xp, added: amount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /gamification/streak ───────────────────────────────────────────────────
// Retorna streak atual e data do último treino
exports.getStreak = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('streak lastTrainedDate');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const today     = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Verificar se o streak ainda está ativo
    const streakActive =
      user.lastTrainedDate === today || user.lastTrainedDate === yesterday;

    res.json({
      streak:         user.streak,
      lastTrainedDate: user.lastTrainedDate,
      streakActive,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /gamification/streak/update ──────────────────────────────────────────
// Atualiza manualmente o streak (usado ao iniciar uma sessão de treino)
exports.updateStreak = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const today     = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (user.lastTrainedDate === today) {
      // Já registrado hoje — sem alteração
      return res.json({ streak: user.streak, message: 'Streak já atualizado hoje.' });
    }

    let newStreak = user.lastTrainedDate === yesterday ? user.streak + 1 : 1;

    const updated = await User.findByIdAndUpdate(
      req.userId,
      { streak: newStreak, lastTrainedDate: today },
      { new: true }
    ).select('streak lastTrainedDate');

    res.json({ streak: updated.streak, lastTrainedDate: updated.lastTrainedDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /gamification/achievements ────────────────────────────────────────────
// Lista as conquistas do usuário
exports.getAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('achievements xp streak completedBlocks');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    // Definição de todas as conquistas possíveis
    const allAchievements = [
      { id: 'first_block',   label: 'Primeiro Bloco',   description: 'Complete seu primeiro bloco.',        earned: user.completedBlocks.length >= 1 },
      { id: 'blocks_10',     label: '10 Blocos',         description: 'Complete 10 blocos.',                 earned: user.completedBlocks.length >= 10 },
      { id: 'blocks_50',     label: '50 Blocos',         description: 'Complete 50 blocos.',                 earned: user.completedBlocks.length >= 50 },
      { id: 'blocks_100',    label: 'Mestre',            description: 'Complete todos os 100 blocos.',       earned: user.completedBlocks.length >= 100 },
      { id: 'streak_7',      label: 'Semana Perfeita',   description: '7 dias seguidos de treino.',          earned: user.achievements.includes('streak_7') },
      { id: 'streak_30',     label: 'Mês Perfeito',      description: '30 dias seguidos de treino.',         earned: user.achievements.includes('streak_30') },
      { id: 'xp_500',        label: '500 XP',            description: 'Acumule 500 XP.',                     earned: user.xp >= 500 },
      { id: 'xp_2000',       label: '2000 XP',           description: 'Acumule 2000 XP.',                    earned: user.xp >= 2000 },
      { id: 'perfect_score', label: 'Perfeito!',         description: 'Alcance 100% em um bloco.',           earned: user.achievements.includes('perfect_score') },
    ];

    res.json({ achievements: allAchievements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
