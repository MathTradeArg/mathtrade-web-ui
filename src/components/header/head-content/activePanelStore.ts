// Tiny external store (no Provider needed) so the 5 independent
// useHoverPanel() instances (Timeline, Notifications, Help, Account, Cart)
// can agree on which ONE of them is open at a time, without lifting their
// state into a shared React tree.
let activeId: string | null = null;
const listeners = new Set<() => void>();

export function setActivePanel(id: string | null) {
  if (activeId === id) return;
  activeId = id;
  listeners.forEach((listener) => listener());
}

export function getActivePanel() {
  return activeId;
}

export function getServerActivePanel() {
  return null;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
