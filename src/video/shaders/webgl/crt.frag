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
uniform float uVignette;
uniform float uTime;

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

void main() {
  vec2 uv = vTexCoord;
  if (uCurvature > 0.0) {
    uv = applyCurvature(uv, uCurvature);
  }

  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    fragColor = vec4(0.0);
    return;
  }

  vec4 color = texture(uTexture, uv);

  color.rgb *= uBrightness;
  color.rgb = mix(vec3(0.5), color.rgb, uContrast);

  float s = scanline(uv, uScanlineStrength);
  color.rgb *= s;

  float m = rgbMask(uv, uMaskStrength);
  color.rgb *= m;

  float v = vignette(uv, uVignette);
  color.rgb *= v;

  fragColor = vec4(color.rgb, 1.0);
}
