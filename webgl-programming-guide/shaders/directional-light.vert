attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;
uniform vec3 u_LightDirection;

varying vec4 v_Color;
varying float v_Dot;

void main() {
  gl_Position = u_MvpMatrix * a_Position;
  v_Color = a_Color;
  vec4 normal = u_NormalMatrix * a_Normal;
  v_Dot = max(dot(normalize(normal.xyz), u_LightDirection), 0.0);
}