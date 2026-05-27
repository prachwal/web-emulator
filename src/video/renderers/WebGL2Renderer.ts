import type { IRenderer, RendererOptions } from './IRenderer';
import type { CrtSettings } from '../../core/types';
import { computeViewport } from '../DisplayGeometry';
import type { DisplayGeometry } from '../DisplayGeometry';
import screenVert from '../shaders/webgl/screen.vert?raw';
import paletteFrag from '../shaders/webgl/palette.frag?raw';
import crtFrag from '../shaders/webgl/crt.frag?raw';

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`Shader compile error: ${gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string): WebGLProgram {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

const FULLSCREEN_QUAD = new Float32Array([
  -1, -1, 0, 0,
  1, -1, 1, 0,
  -1, 1, 0, 1,
  1, 1, 1, 1,
]);

export class WebGL2Renderer implements IRenderer {
  readonly kind = 'webgl2' as const;

  private gl: WebGL2RenderingContext | null = null;
  private canvas: HTMLCanvasElement | OffscreenCanvas | null = null;
  private sourceWidth: number = 0;
  private sourceHeight: number = 0;
  private pixelAspectRatio: number = 1;
  private displayWidth: number = 0;
  private displayHeight: number = 0;
  private dpr: number = 1;

  private paletteProgram: WebGLProgram | null = null;
  private crtProgram: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private indexTexture: WebGLTexture | null = null;
  private paletteTexture: WebGLTexture | null = null;
  private crtFbo: WebGLFramebuffer | null = null;
  private crtTex: WebGLTexture | null = null;
  private quadBuffer: WebGLBuffer | null = null;

  private crt: CrtSettings = {
    enabled: false, curvature: 0, scanlineStrength: 0,
    maskStrength: 0, bloomStrength: 0, bloomRadius: 0,
    brightness: 1, contrast: 1, saturation: 1,
    chromaticAberration: 0, noiseStrength: 0,
    phosphorPersistence: 0, interlace: false, vignette: 0,
  };

  private borderColor: [number, number, number] = [0, 0, 0];
  private integerScale: boolean = false;
  private basePixelAspectRatio: number = 1;
  private zoom: number = 1;

  initialize(options: RendererOptions): void {
    this.canvas = options.canvas;
    this.sourceWidth = options.sourceWidth;
    this.sourceHeight = options.sourceHeight;
    this.pixelAspectRatio = options.pixelAspectRatio;
    this.basePixelAspectRatio = options.pixelAspectRatio;
    this.crt = options.crt;

    const gl = this.canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) throw new Error('WebGL2 not available');
    this.gl = gl;

    this.paletteProgram = createProgram(gl, screenVert, paletteFrag);
    this.crtProgram = createProgram(gl, screenVert, crtFrag);

    this.quadBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_QUAD, gl.STATIC_DRAW);

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    this.indexTexture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.indexTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, this.sourceWidth, this.sourceHeight, 0, gl.RED, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.paletteTexture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.crtTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.crtTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, this.sourceWidth, this.sourceHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.crtFbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.crtFbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.crtTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.viewport(0, 0, this.sourceWidth, this.sourceHeight);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
  }

  resize(displayWidth: number, displayHeight: number, dpr: number): void {
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
    this.dpr = dpr;
    if (this.canvas) {
      this.canvas.width = Math.round(displayWidth * dpr);
      this.canvas.height = Math.round(displayHeight * dpr);
    }
  }

  uploadPalette(palette: Uint8Array): void {
    if (!this.gl) return;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, palette.length / 4, 1, gl.RGBA, gl.UNSIGNED_BYTE, palette);
  }

  uploadFrame(framebuffer: Uint8Array): void {
    if (!this.gl) return;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.indexTexture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.sourceWidth, this.sourceHeight, gl.RED, gl.UNSIGNED_BYTE, framebuffer);
  }

  updateCrt(settings: CrtSettings): void {
    this.crt = settings;
  }

  render(frameNumber: number): void {
    if (!this.gl) return;
    const gl = this.gl;

    const cw = Math.round(this.displayWidth * this.dpr);
    const ch = Math.round(this.displayHeight * this.dpr);
    const geo: DisplayGeometry = {
      sourceWidth: this.sourceWidth,
      sourceHeight: this.sourceHeight,
      pixelAspectRatio: this.pixelAspectRatio,
      integerScale: this.integerScale,
      overscanX: 0,
      overscanY: 0,
      zoom: this.zoom,
    };
    const vp = computeViewport(geo, cw, ch);
    const { viewportWidth: vw, viewportHeight: vh, offsetX: ox, offsetY: oy, logicalWidth, logicalHeight } = vp;

    // Pass 1: palette mapping
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.crt.enabled ? this.crtFbo : null);
    if (!this.crt.enabled) {
      gl.viewport(0, 0, cw, ch);
      gl.clearColor(this.borderColor[0], this.borderColor[1], this.borderColor[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(ox, oy, vw, vh);
    } else {
      gl.viewport(0, 0, this.sourceWidth, this.sourceHeight);
      gl.clearColor(this.borderColor[0], this.borderColor[1], this.borderColor[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.useProgram(this.paletteProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.indexTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture);
    const pp = this.paletteProgram!;
    gl.uniform1i(gl.getUniformLocation(pp, 'uIndexTexture'), 0);
    gl.uniform1i(gl.getUniformLocation(pp, 'uPalette'), 1);
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (this.crt.enabled) {
      // Pass 2: CRT composite
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, cw, ch);
      gl.clearColor(this.borderColor[0], this.borderColor[1], this.borderColor[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(ox, oy, vw, vh);
      const cp = this.crtProgram!;
      gl.useProgram(cp);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.crtTex);
      gl.uniform1i(gl.getUniformLocation(cp, 'uTexture'), 0);
      gl.uniform2f(gl.getUniformLocation(cp, 'uResolution'), this.sourceWidth, this.sourceHeight);
      gl.uniform2f(gl.getUniformLocation(cp, 'uOutputSize'), vw, vh);
      gl.uniform1f(gl.getUniformLocation(cp, 'uCurvature'), this.crt.curvature);
      gl.uniform1f(gl.getUniformLocation(cp, 'uScanlineStrength'), this.crt.scanlineStrength);
      gl.uniform1f(gl.getUniformLocation(cp, 'uMaskStrength'), this.crt.maskStrength);
      gl.uniform1f(gl.getUniformLocation(cp, 'uBrightness'), this.crt.brightness);
      gl.uniform1f(gl.getUniformLocation(cp, 'uContrast'), this.crt.contrast);
      gl.uniform1f(gl.getUniformLocation(cp, 'uVignette'), this.crt.vignette);
      gl.uniform1f(gl.getUniformLocation(cp, 'uTime'), frameNumber);
      gl.bindVertexArray(this.vao);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  setBorderColor(color: [number, number, number]): void {
    this.borderColor = color;
  }

  setScaling(parMultiplier: number, integerScale: boolean): void {
    this.pixelAspectRatio = this.basePixelAspectRatio * parMultiplier;
    this.integerScale = integerScale;
  }

  setZoom(z: number): void {
    this.zoom = z;
  }

  dispose(): void {
    const gl = this.gl;
    if (!gl) return;
    if (this.paletteProgram) gl.deleteProgram(this.paletteProgram);
    if (this.crtProgram) gl.deleteProgram(this.crtProgram);
    if (this.vao) gl.deleteVertexArray(this.vao);
    if (this.quadBuffer) gl.deleteBuffer(this.quadBuffer);
    if (this.indexTexture) gl.deleteTexture(this.indexTexture);
    if (this.paletteTexture) gl.deleteTexture(this.paletteTexture);
    if (this.crtTex) gl.deleteTexture(this.crtTex);
    if (this.crtFbo) gl.deleteFramebuffer(this.crtFbo);
    this.gl = null;
  }
}
