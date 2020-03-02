import Demo from '../common/demo'
import frag from '../shaders/v_color.frag'
import Matrix4 from '../common/matrix4.js'
import vert from '../shaders/a_pos_av_color_u_view.vert'

export class LookAtTriangle extends Demo {

  constructor(name) {
    super(name, { vert, frag })

    let gl = this.ctx

    let vertices = new Float32Array([
      // Vertex coordinates and color(RGBA)
      0.0,   0.5, -0.4, 0.4, 1.0, 0.4, // The back green one
      -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
      0.5,  -0.5, -0.4, 1.0, 0.4, 0.4,

      0.5,  0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow one
      -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
      0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

      0.0,  0.5,  0.0, 0.4, 0.4, 1.0,  // The front blue one
      -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
      0.5,  -0.5, 0.0, 1.0, 0.4, 0.4
    ])

    //顶点个数
    this.count = 9

    let viewMatrix = new Matrix4()
    viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0)

    let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
    if (!u_ViewMatrix) {
      console.log('Failed to get the storage locations of u_ViewMatrix')
      return
    }
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    let FSIZE = vertices.BYTES_PER_ELEMENT

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)
    gl.enableVertexAttribArray(a_Position)

    let a_Color = gl.getAttribLocation(gl.program, 'a_Color')
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
    gl.enableVertexAttribArray(a_Color)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    this.render()
  }

  render() {
    let gl = this.ctx

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, this.count)
  }

}