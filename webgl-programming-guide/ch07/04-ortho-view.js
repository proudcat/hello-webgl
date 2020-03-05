import Demo from '../common/demo'
import frag from '../shaders/v_color.frag'
import Matrix4 from '../common/matrix4.js'
import vert from '../shaders/a_pos_av_color_u_proj.vert'

export class OthoView extends Demo {

  constructor(name) {
    super(name, { vert, frag })

    let gl = this.ctx

    let vertices = new Float32Array([
      // Vertex coordinates and color(RGBA)
      0.0, 0.8, -0.4, 1.0, 0.0, 0.0,
      -0.8, -0.8, -0.4, 1.0, 0.0, 0.0,
      0.8, -0.8, -0.4, 1.0, 0.0, 0.0,

      0.5, 0.5, -0.2, 0.0, 1.0, 0.0,
      -0.5, 0.5, -0.2, 0.0, 1.0, 0.0,
      0.0, -0.6, -0.2, 0.0, 1.0, 0.0,

      0.0, 0.4, 0.0, 0.4, 0.4, 1.0,
      -0.4, -0.4, 0.0, 0.4, 0.4, 1.0,
      0.4, -0.4, 0.0, 1.0, 0.4, 0.4
    ])

    //顶点个数
    this.count = 9

    this.near = 0.0
    this.far = 0.5

    this.viewMatrix = new Matrix4()

    this.u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix')

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
      this.near -= 0.01
      break
    case 39://right arrow
      this.near += 0.01
      break
    case 38: //up arrow
      this.far += 0.01
      break
    case 40: //down arrow
      this.far -= 0.01
      break
    default:
      return
    }

    console.log(`near:${this.near},far:${this.far}`)

    this.render()
  }

  render() {
    let gl = this.ctx

    //可尝试修改视口大小改变看到的效果
    this.viewMatrix.setOrtho(-1, 1, -1, 1, this.near, this.far)
    // this.viewMatrix.setOrtho(-0.5, 0.5, -0.5, 0.5, this.near, this.far)
    // this.viewMatrix.setOrtho(-0.3, 0.3, -1, 1, this.near, this.far)


    gl.uniformMatrix4fv(this.u_ProjMatrix, false, this.viewMatrix.elements)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, this.count)
  }

}