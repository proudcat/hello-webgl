attribute vec4 a_Position;
uniform mat4 u_RotateMatrix;
void main(){
  gl_Position=u_RotateMatrix*a_Position;
}