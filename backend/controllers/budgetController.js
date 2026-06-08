const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

exports.getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { user: req.user.id };
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    const budgets = await Budget.find(filter);

    // Attach actual spending
    const enriched = await Promise.all(budgets.map(async (b) => {
      const start = new Date(b.year, b.month - 1, 1);
      const end = new Date(b.year, b.month, 0);
      const txs = await Transaction.find({
        user: req.user.id,
        category: b.category,
        type: 'expense',
        date: { $gte: start, $lte: end }
      });
      const spent = txs.reduce((sum, t) => sum + t.amount, 0);
      return { ...b.toObject(), spent };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBudget = async (req, res) => {
  try {
    const budget = await Budget.create({ user: req.user.id, ...req.body });
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: 'Not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};