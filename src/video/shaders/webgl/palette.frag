#version 300 es
precision highp float;

in vec2 vTexCoord;
out vec4 fragColor;

uniform sampler2D uIndexTexture;
uniform sampler2D uPalette;

void main() {
  float index = texture(uIndexTexture, vTexCoord).r;
  fragColor = texture(uPalette, vec2(index, 0.5));
}
