import Demo from '../common/demo'
import frag from '../shaders/v_color.fs'
import Matrix4 from '../common/matrix4.js'
import vert from '../shaders/a_pos_av_color_u_view.vs'

/**
 * 并没有发现深度冲突的情况，有待于再研究。
 */
export class ZFighting extends Demo {

  constructor(name) {
    super(name, { vert, frag })

    let gl = this.ctx

    let vertices = new Float32Array([
      0.0,   2.5, -5.0, 0.4, 1.0, 0.4, // The green triangle
      -2.5, -2.5, -5.0, 0.4, 1.0, 0.4,
      2.5,  -2.5, -5.0, 1.0, 0.4, 0.4,

      0.0,   3.0, -5.0, 1.0, 0.4, 0.4, // The yellow triagle
      -3.0, -3.0, -5.0, 1.0, 1.0, 0.4,
      3.0,  -3.0, -5.0, 1.0, 1.0, 0.4
    ])

    //顶点个数
    this.count = 6

    let viewMatrix = new Matrix4()
    viewMatrix.setPerspective(30, this.$canvas.width / this.$canvas.height, 1, 100)
    viewMatrix.lookAt(3.06, 2.5, 10.0, 0, 0, -2, 0, 1, 0)

    let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
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

    gl.enable(gl.DEPTH_TEST)
    // gl.enable(gl.POLYGON_OFFSET_FILL)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    this.render()
  }

  render() {
    let gl = this.ctx

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, this.count)

    // gl.drawArrays( gl.TRIANGLES, 0, this.count/2 )
    // gl.polygonOffset(1.0, 1.0)
    // gl.drawArrays( gl.TRIANGLES, this.count / 2, this.count / 2)
  }

}