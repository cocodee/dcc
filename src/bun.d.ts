// Bun bundle feature flags shim
// This module provides a compatible implementation for environments without Bun's bundle system

declare module 'bun:bundle' {
  export function feature(name: string): boolean;
}
