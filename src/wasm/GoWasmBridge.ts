export class GoWasmBridge {
  private go: any = null;
  private instance: WebAssembly.Instance | null = null;
  private loaded: boolean = false;

  async load(path: string = '/wasm/emulator.wasm'): Promise<void> {
    if (this.loaded) return;

    const wasmExecUrl = '/wasm/wasm_exec.js';
    try {
      await import(/* @vite-ignore */ wasmExecUrl);
    } catch {
      // wasm_exec.js may not exist if Go core not built
      throw new Error('wasm_exec.js not found. Build WASM first: npm run wasm:build');
    }

    this.go = new (globalThis as any).Go();

    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load WASM: ${response.statusText}`);
    }

    const result = await WebAssembly.instantiateStreaming(response, this.go.importObject);
    this.instance = result.instance;
    this.go.run(this.instance);
    this.loaded = true;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  call(name: string, ...args: unknown[]): unknown {
    if (!this.loaded || !this.instance) {
      throw new Error('WASM not loaded');
    }
    const fn = (this.instance.exports as Record<string, unknown>)[name];
    if (typeof fn !== 'function') {
      throw new Error(`WASM export not found: ${name}`);
    }
    return (fn as (...args: unknown[]) => unknown)(...args);
  }

  getMemory(): WebAssembly.Memory | null {
    return this.instance?.exports.memory as WebAssembly.Memory ?? null;
  }

  dispose(): void {
    this.instance = null;
    this.go = null;
    this.loaded = false;
  }
}
