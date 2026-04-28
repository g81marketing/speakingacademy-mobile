// ⚠️ DEPRECATED — Blocks foram renomeados para Missions na v2.
// Use: src/controllers/missionController.js + src/services/missionService.js
module.exports = {};

// ── GET /blocks ────────────────────────────────────────────────────────────────
// Lista blocos com filtros opcionais: ?level=beginner&type=word&focus=work
exports.getBlocks = async (req, res) => {
  try {
    const { level, type, focus, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (level) filter.level = level;
    if (type)  filter.type  = type;
    if (focus) filter.focus = { $regex: focus, $options: 'i' };

    const total  = await Block.countDocuments(filter);
    const blocks = await Block.find(filter)
      .sort({ blockId: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ total, page: Number(page), blocks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /blocks/:id ────────────────────────────────────────────────────────────
// Retorna um bloco específico pelo blockId (número)
exports.getBlockById = async (req, res) => {
  try {
    const block = await Block.findOne({ blockId: Number(req.params.id) });
    if (!block) return res.status(404).json({ error: 'Bloco não encontrado.' });
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /blocks/next ───────────────────────────────────────────────────────────
// Retorna o próximo bloco para o usuário autenticado (baseado em currentBlock)
exports.getNextBlock = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const block = await Block.findOne({ blockId: user.currentBlock });
    if (!block) return res.status(404).json({ error: 'Nenhum bloco disponível.' });

    res.json(block);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
