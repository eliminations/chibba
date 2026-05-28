"use client";

/**
 * Minimal external store for global scroll state, fed by Lenis.
 * Components subscribe via useScrollState() to react to scroll velocity
 * without triggering React re-renders on every frame.
 */

export interface ScrollState {
  scroll: number;
  velocity: number;
  progress: number;
  direction: 1 | -1 | 0;
}

let state: ScrollState = { scroll: 0, velocity: 0, progress: 0, direction: 0 };
const listeners = new Set<() => void>();

export const scrollStore = {
  get(): ScrollState {
    return state;
  },
  set(next: Partial<ScrollState>) {
    state = { ...state, ...next };
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
