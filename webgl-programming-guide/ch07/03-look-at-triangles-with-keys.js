import Demo from '../common/demo'
import frag from '../shaders/v_color.frag'
import Matrix4 from '../common/matrix4.js'
import vert from '../shaders/a_pos_av_color_u_view.vert'

export class LookAtTriangleWithKeys extends Demo {

  constructor(name) {
    super(name, { vert, frag })

    let gl = this.ctx

    let vertices = new Float32Array([
      // Vertex coordinates and color(RGBA)
      0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // The back green one
      -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
      0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

      0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow one
      -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
      0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

      0.0, 0.5, 0.0, 0.4, 0.4, 1.0,  // The front blue one
      -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
      0.5, -0.5, 0.0, 1.0, 0.4, 0.4
    ])

    //顶点个数
    this.count = 9

    this.eye_x = 0.20
    this.eye_y = 0.25
    this.eye_z = 0.25

    this.viewMatrix = new Matrix4()

    this.u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')

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

    document.addEventListener('keydown', ev => this.keydown(ev))

    this.render()
  }

  keydown(ev) {

    if (!this.enabled) {
      return
    }

    switch (ev.keyCode) {
    case 37: //left arrow
      this.eye_x -= 0.01
      break
    case 39: //right arrow
      this.eye_x += 0.01
      break
    case 38://up arrow
      this.eye_y += 0.01
      break
    case 40: //down arrow
      this.eye_y -= 0.01
      break
    default:
      return
    }

    this.render()
  }

  render() {
    let gl = this.ctx
    this.viewMatrix.setLookAt(this.eye_x, this.eye_y, this.eye_y, 0, 0, 0, 0, 1, 0)
    gl.uniformMatrix4fv(this.u_ViewMatrix, false, this.viewMatrix.elements)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, this.count)
  }

}