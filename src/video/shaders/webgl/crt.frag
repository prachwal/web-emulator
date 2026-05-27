#version 300 es
precision highp float;

in vec2 vTexCoord;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uOutputSize;
uniform float uCurvature;
uniform float uScanlineStrength;
uniform float uMaskStrength;
uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
uniform float uVignette;
uniform float uChromaticAberration;
uniform float uNoiseStrength;
uniform float uInterlace;
uniform float uTime;

// --- helpers ---

vec2 applyCurvature(vec2 uv, float amount) {
  vec2 centered = uv - 0.5;
  float dist = dot(centered, centered);
  return uv + centered * dist * amount;
}

float scanline(vec2 uv, float strength) {
  float s = sin(uv.y * uResolution.y * 3.14159);
  return 1.0 - strength * abs(s);
}

float rgbMask(vec2 uv, float strength) {
  vec2 grid = uv * uOutputSize;
  float m = sin(grid.x * 3.14159 * 0.5);
  return 1.0 - strength * (1.0 - abs(m));
}

float vignette(vec2 uv, float amount) {
  vec2 centered = uv - 0.5;
  float dist = length(centered);
  return 1.0 - smoothstep(0.2, 0.8, dist) * amount;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// --- main ---

void main() {
  vec2 uv = vTexCoord;

  // curvature
  if (uCurvature > 0.0) {
    uv = applyCurvature(uv, uCurvature);
  }
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    fragColor = vec4(0.0);
    return;
  }

  // chromatic aberration
  vec4 color;
  if (uChromaticAberration > 0.0) {
    float ca = uChromaticAberration * 0.01;
    float r = texture(uTexture, uv + vec2(ca, 0.0)).r;
    float g = texture(uTexture, uv).g;
    float b = texture(uTexture, uv - vec2(ca, 0.0)).b;
    color = vec4(r, g, b, 1.0);
  } else {
    color = texture(uTexture, uv);
  }

  // brightness / contrast
  color.rgb *= uBrightness;
  color.rgb = mix(vec3(0.5), color.rgb, uContrast);

  // saturation
  float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(lum), color.rgb, uSaturation);

  // scanlines
  color.rgb *= scanline(uv, uScanlineStrength);

  // RGB mask
  color.rgb *= rgbMask(uv, uMaskStrength);

  // interlace
  if (uInterlace > 0.0) {
    float line = fract(uv.y * uResolution.y * 0.5);
    float interlaceAmount = smoothstep(0.0, 0.5, abs(line - 0.25)) * uInterlace;
    color.rgb *= 1.0 - interlaceAmount * 0.3;
  }

  // noise
  if (uNoiseStrength > 0.0) {
    float n = hash(uv + uTime * 0.01);
    color.rgb += (n - 0.5) * uNoiseStrength * 0.1;
  }

  // vignette
  color.rgb *= vignette(uv, uVignette);

  fragColor = vec4(color.rgb, 1.0);
}
