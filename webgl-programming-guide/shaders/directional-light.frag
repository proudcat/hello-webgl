precision mediump float;

uniform vec3 u_LightColor;

varying vec4 v_Color;
varying float v_Dot;
void main() {
  gl_FragColor = vec4(u_LightColor * v_Color.xyz * v_Dot, v_Color.a);
}