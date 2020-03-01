import Demo from '../common/demo'
import vert from '../shaders/a_pos.vs'
import frag from '../shaders/u_width_u_height.fs'

export class HelloTriangleFragCoord extends Demo{

  constructor(name){
    super(name,{vert,frag})

    let gl = this.ctx

    let vertices = new Float32Array([
      0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])

    //定点个数
    this.count = 3

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position)

    let u_Width = gl.getUniformLocation(gl.program, 'u_Width')
    let u_Height = gl.getUniformLocation(gl.program, 'u_Height')

    gl.uniform1f(u_Width, gl.drawingBufferWidth)
    gl.uniform1f(u_Height, gl.drawingBufferHeight)

    this.render()

  }
  render() {
    let gl = this.ctx

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, this.count)
    // gl.drawArrays(gl.LINES, 0, this.count)
    // gl.drawArrays(gl.LINE_STRIP, 0, this.count)
    // gl.drawArrays(gl.LINE_LOOP, 0, this.count)
  }

}