let updateMode = false;

export function setGoldenUpdateMode(mode: boolean): void {
  updateMode = mode;
}

/** Hash a Uint8Array to a hex string using FNV-1a (deterministic, no deps) */
export function hashBuffer(buf: Uint8Array): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < buf.length; i++) {
    h ^= buf[i];
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

const goldenStore = new Map<string, string>();

export function setGolden(name: string, hash: string): void {
  goldenStore.set(name, hash);
}

/** Expect a result hash against a stored golden. Updates golden if env allows. */
export function expectGolden(name: string, actualHash: string): void {
  if (updateMode) {
    goldenStore.set(name, actualHash);
    return;
  }
  const expected = goldenStore.get(name);
  if (expected === undefined) {
    // First run: store and pass
    goldenStore.set(name, actualHash);
    return;
  }
  if (actualHash !== expected) {
    throw new Error(
      `Golden mismatch: "${name}"\n  Expected: ${expected}\n  Actual:   ${actualHash}\n` +
      `Set UPDATE_GOLDEN=1 to update snapshots.`,
    );
  }
}

/** Reset all stored golden values (for test isolation). */
export function resetGoldens(): void {
  goldenStore.clear();
}
