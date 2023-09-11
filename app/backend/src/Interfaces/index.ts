export type NewEntity<T> = Omit<T, 'id'>;

export type ID = number;

export type Identificable = { id: ID };
