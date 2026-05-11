// Bun bundle feature flags shim for non-Bun environments
// This provides a compatible implementation when Bun's bundle system is unavailable

// Feature flags that would be set at build time by Bun
const FEATURE_FLAGS: Record<string, boolean> = {
  PROACTIVE: true,
  KAIROS: false,
  BRIDGE_MODE: false,
  DAEMON: false,
  VOICE_MODE: false,
  AGENT_TRIGGERS: true,
  MONITOR_TOOL: true,
}

export function feature(name: string): boolean {
  return FEATURE_FLAGS[name] ?? false
}
