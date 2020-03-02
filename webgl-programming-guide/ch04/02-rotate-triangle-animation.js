import Demo from '../common/demo'
import Matrix4 from '../common/matrix4.js'
import frag from '../shaders/red.frag'
import vert from '../shaders/a_pos_u_model.vert'


const ANGLE_STEP = 45.0


export class RotateTriangleAnimation extends Demo{

  constructor(name){
    super(name,{vert,frag})

    let gl = this.ctx

    let vertices = new Float32Array([
      0.0, 0.3, -0.3, -0.3, 0.3, -0.3
    ])

    //顶点个数
    this.count = 3
    this.currentAngle = 0.0
    this.lastTime = Date.now()

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position)

    this.modelMatrix = new Matrix4()
    this.u_RotateMatrix = gl.getUniformLocation(gl.program, 'u_RotateMatrix')

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    this.update()
  }

  animate() {
    let now = Date.now()
    let elapsed = now - this.lastTime
    this.lastTime = now

    // Update the current rotation angle (adjusted by the elapsed time)
    let newAngle = this.currentAngle + ANGLE_STEP * elapsed / 1000.0

    this.currentAngle = newAngle %360
  }

  update(){
    this.animate()
    this.render()
    requestAnimationFrame(()=>this.update())
  }

  render() {
    let gl = this.ctx

    this.modelMatrix.setRotate(this.currentAngle, 0, 0, 1)
    this.modelMatrix.translate(0.35, 0, 0)

    gl.uniformMatrix4fv(this.u_RotateMatrix, false, this.modelMatrix.elements)

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, this.count)
  }

}