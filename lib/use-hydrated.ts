"use client";
import { useSyncExternalStore } from "react";
const subscribe = () => () => {};
const client = () => true;
const server = () => false;
// Keep SSR controls visible but non-interactive until their handlers exist.
export function useHydrated() {
  return useSyncExternalStore(subscribe, client, server);
}
