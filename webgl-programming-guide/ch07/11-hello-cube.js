import Demo from '../common/demo'
import frag from '../shaders/v_color.fs'
import Matrix4 from '../common/matrix4.js'
import vert from '../shaders/a_pos_av_color_u_mvp.vs'

export class HelloCube extends Demo {

  constructor(name) {
    super(name, { vert, frag })

    let gl = this.ctx

    this.initVertexBuffer()

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    let mvpMatrix = new Matrix4()
    mvpMatrix.setPerspective(30, 1, 1, 100)
    // mvpMatrix.setOrtho(-2, 2, -2, 2, 1, 100)
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)

    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
    this.render()
  }

  initVertexBuffer() {

    let gl = this.ctx

    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    var vertices = new Float32Array([
      // Vertex coordinates and color
      1.0,   1.0,  1.0, 1.0, 1.0, 1.0,  // v0 White
      -1.0,  1.0,  1.0, 1.0, 0.0, 1.0,  // v1 Magenta
      -1.0, -1.0,  1.0, 1.0, 0.0, 0.0,  // v2 Red
      1.0,  -1.0,  1.0, 1.0, 1.0, 0.0,  // v3 Yellow
      1.0,  -1.0, -1.0, 0.0, 1.0, 0.0,  // v4 Green
      1.0,   1.0, -1.0, 0.0, 1.0, 1.0,  // v5 Cyan
      -1.0,  1.0, -1.0, 0.0, 0.0, 1.0,  // v6 Blue
      -1.0, -1.0, -1.0, 0.0, 0.0, 0.0   // v7 Black
    ])

    // Indices of the vertices
    var indices = new Uint8Array([
      0, 1, 2, 0, 2, 3,    // front
      0, 3, 4, 0, 4, 5,    // right
      0, 5, 6, 0, 6, 1,    // up
      1, 6, 7, 1, 7, 2,    // left
      7, 4, 3, 7, 3, 2,    // down
      4, 7, 6, 4, 6, 5     // back
    ])
    //顶点个数
    this.count = indices.length

    let vertexBuffer = gl.createBuffer()
    let indexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    let FSIZE = vertices.BYTES_PER_ELEMENT

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)
    gl.enableVertexAttribArray(a_Position)

    let a_Color = gl.getAttribLocation(gl.program, 'a_Color')
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
    gl.enableVertexAttribArray(a_Color)

    if (!indexBuffer) {
      console.log('failed to create index buffer')
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  }

  render() {
    let gl = this.ctx
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_BYTE, 0)
  }

}