export interface Cursor {
  next?: string | null;
  previous?: string | null;
}

export function createCursor({ next, previous }: Cursor): Required<Cursor> {
  return { next: next || null, previous: previous || null };
}
