export class WasmMemoryView {
  private memory: WebAssembly.Memory;

  constructor(memory: WebAssembly.Memory) {
    this.memory = memory;
  }

  getUint8(ptr: number, len: number): Uint8Array {
    return new Uint8Array(this.memory.buffer, ptr, len);
  }

  getUint32(ptr: number): number {
    const view = new DataView(this.memory.buffer);
    return view.getUint32(ptr, true);
  }

  setUint8(ptr: number, value: number): void {
    const view = new Uint8Array(this.memory.buffer);
    view[ptr] = value;
  }

  setUint8Array(ptr: number, data: Uint8Array): void {
    const view = new Uint8Array(this.memory.buffer);
    view.set(data, ptr);
  }

  getByteLength(): number {
    return this.memory.buffer.byteLength;
  }

  grow(pages: number): void {
    this.memory.grow(pages);
  }
}
