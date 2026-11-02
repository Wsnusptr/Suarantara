'use client'

import { useSyncExternalStore } from 'react'

let isContactOpen = false
const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

export const contactModalStore = {
  open: () => {
    isContactOpen = true
    emitChange()
  },
  close: () => {
    isContactOpen = false
    emitChange()
  },
  toggle: () => {
    isContactOpen = !isContactOpen
    emitChange()
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot: () => isContactOpen,
}

export function useContactModal() {
  const isOpen = useSyncExternalStore(
    contactModalStore.subscribe,
    contactModalStore.getSnapshot,
    () => false
  )

  return {
    isOpen,
    openContact: contactModalStore.open,
    closeContact: contactModalStore.close,
    toggleContact: contactModalStore.toggle,
  }
}
