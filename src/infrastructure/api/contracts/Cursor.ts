function createCursor({ next, previous }) {
  return { next: next || null, previous: previous || null };
}

module.exports = { createCursor };
