# Build Issues - Claude Code Source Snapshot

**Date:** 2026-05-11
**Status:** Build Failed

---

## Summary

This source snapshot (mirrored from Claude Code npm package source map exposure on 2026-03-31) cannot be successfully built due to fundamental structural issues with the snapshot itself.

**Error Count:** 2,545 TypeScript errors

---

## Root Cause

This is a **compiled output snapshot** (from Bun bundler) that was recovered via source maps, NOT the original TypeScript source code. The `.ts` files in this repo are actually the output of compilation with `.js` extensions, mapped back to `.ts` through source maps.

**Key Problem:** The imports use `.js` extensions (e.g., `from './types/message.js'`) but these reference files that either:
1. Don't exist (the original `.ts` was compiled away)
2. Are themselves snapshots of internal modules that reference other non-existent modules

---

## Missing Modules (Critical)

These internal modules are referenced but don't exist:

| Missing Module | Referenced By |
|----------------|---------------|
| `./types/message.js` | QueryEngine.ts, Tool.ts, bridge/*, buddy/*, cli/print.ts |
| `./types/tools.js` | Tool.ts |
| `./types/utils.js` | Tool.ts |
| `./constants/querySource.js` | Tool.ts |
| `./services/compact/snipCompact.js` | QueryEngine.ts |
| `./services/compact/snipProjection.js` | QueryEngine.ts |
| `./entrypoints/sdk/controlTypes.js` | bridge/*, cli/print.ts, cli/remoteIO.ts |
| `./entrypoints/sdk/coreTypes.js` | bridge/bridgeMessaging.ts |
| `./assistant/index.js` | bridge/initReplBridge.ts |
| `./services/oauth/types.js` | cli/handlers/auth.ts |
| `./proactive/index.js` | cli/print.ts |
| `./transports/Transport.js` | cli/remoteIO.ts |

---

## Export Mismatches

The `src/entrypoints/agentSdkTypes.ts` file has structural issues:

- Declares `SDKMessage` locally but exports it as `SDKControlRequest`
- Missing exports: `PermissionMode`, `SDKCompactBoundaryMessage`, `SDKPermissionDenial`, `SDKStatus`, `SDKUserMessageReplay`, `HookEvent`, `ModelUsage`, `SDKResultSuccess`, `HookInput`, `HookJSONOutput`, `PermissionUpdate`

---

## Missing npm Packages

| Package | Used In |
|---------|---------|
| `chalk` | bridge/bridgeUI.ts |
| `qrcode` | bridge/bridgeUI.ts |
| `figures` | buddy/CompanionSprite.tsx, cli/handlers/plugins.ts |
| `p-map` | cli/handlers/mcp.tsx |
| `react/compiler-runtime` | buddy/CompanionSprite.tsx, buddy/useBuddyNotification.tsx, cli/handlers/util.tsx |

---

## Bun-Specific Issues

### 1. `bun:bundle` Feature Flags
The code uses `import { feature } from 'bun:bundle'` for feature flags (PROACTIVE, KAIROS, BRIDGE_MODE, DAEMON, VOICE_MODE, AGENT_TRIGGERS, MONITOR_TOOL). This is a Bun-specific module that doesn't exist in Node.js.

**Workaround Created:** `src/bun.ts` shim that returns hardcoded feature flags.

### 2. `Bun` Global Object
Used in `buddy/companion.ts` for file operations. Requires Bun types.

**Error:** `Cannot find name 'Bun'`

### 3. `MACRO` Constant
Referenced in bridge modules but never defined:
- `bridge/bridgeEnabled.ts` (lines 168-169)
- `bridge/bridgeMain.ts` (lines 2349, 2899)
- `bridge/bridgeUI.ts` (line 302)
- `bridge/replBridge.ts` (line 322)
- `bridge/envLessBridgeConfig.ts` (lines 149-150)

### 4. Top-Level Await
ES modules may use top-level await which requires `--bun` runtime.

---

## Missing Type Definitions

| Type | Source |
|------|--------|
| `@opentelemetry/api` | bootstrap/state.ts |
| `@opentelemetry/api-logs` | bootstrap/state.ts |
| `@opentelemetry/sdk-logs` | bootstrap/state.ts |
| `@opentelemetry/sdk-metrics` | bootstrap/state.ts |
| `@opentelemetry/sdk-trace-base` | bootstrap/state.ts |
| `@anthropic-ai/claude-agent-sdk` | cli/print.ts |

---

## TypeScript Target Issues

- `Array.findLast()` and `Array.findLastIndex()` require `lib: ["ES2023"]` or later (set in tsconfig.json)

---

## Build Commands Attempted

```bash
# Installed Bun
curl -fsSL https://bun.sh/install | bash

# Installed dependencies
~/.bun/bin/bun install

# Type checking
~/.bun/bin/bun tsc --noEmit
# Result: 2545 errors
```

---

## What Would Be Needed to Fix

1. **Complete missing source files** - The original `.ts` files for all internal modules need to be recovered from the original R2 bucket that was exposed via source maps
2. **Reconstruct `entrypoints/sdk/`** - These contain SDK type definitions that are heavily referenced
3. **Fix import paths** - Either by converting imports to `.ts` or by creating stub modules
4. **Install all npm dependencies** - chalk, qrcode, figures, p-map, @opentelemetry/* packages
5. **Create shims for Bun-specific APIs** - `bun:bundle`, `Bun` global, `MACRO` constant

---

## Alternative

For running Claude Code functionality, use the official npm package:

```bash
npm install -g @anthropic-ai/claude-code
claude
```

---

## Files Created During Attempt

- `package.json` - Basic package configuration with dependencies
- `tsconfig.json` - TypeScript configuration (strict mode disabled for tolerance)
- `src/bun.ts` - Shim for `bun:bundle` feature flags
- `src/bun.d.ts` - Type declarations for `bun:bundle`