export type SetterOrValue<V> = ((prev: V) => V) | V;
