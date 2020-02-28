attribute vec4 a_Position;
uniform mat4 u_TransMatrix;
void main(){
  gl_Position=u_TransMatrix*a_Position;
}