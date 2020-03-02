import Demo from '../common/demo'
import frag from '../shaders/v_color.fs'
import Matrix4 from '../common/matrix4.js'
import vert from '../shaders/a_pos_av_color_u_mvp.vs'

export class ColoredCube extends Demo {

  constructor(name) {
    super( name, { vert, frag } )

    let gl = this.ctx

    this.initVertexBuffer()

    gl.clearColor( 0.0, 0.0, 0.0, 1.0 )
    gl.enable( gl.DEPTH_TEST )

    let mvpMatrix = new Matrix4()
    mvpMatrix.setPerspective( 30, 1, 1, 100 )
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)

    let u_MvpMatrix = gl.getUniformLocation( gl.program, 'u_MvpMatrix' )
    gl.uniformMatrix4fv( u_MvpMatrix, false, mvpMatrix.elements )
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
    var vertices = new Float32Array( [   // Vertex coordinates
      1.0,   1.0,  1.0, -1.0,  1.0,  1.0, -1.0, -1.0,  1.0,  1.0, -1.0 , 1.0,  // v0-v1-v2-v3 front
      1.0,   1.0,  1.0,  1.0, -1.0,  1.0,  1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  // v0-v3-v4-v5 right
      1.0,   1.0,  1.0,  1.0,  1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  // v0-v5-v6-v1 up
      -1.0,  1.0,  1.0, -1.0,  1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,  1.0,  // v1-v6-v7-v2 left
      -1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,  // v7-v4-v3-v2 down
      1.0,  -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0   // v4-v7-v6-v5 back
    ] )

    var colors = new Float32Array( [     // Colors
      0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
      0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
      1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
      1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
      0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0   // v4-v7-v6-v5 back
    ] )

    var indices = new Uint8Array( [       // Indices of the vertices
      0,  1,  2,  0,  2,  3,    // front
      4,  5,  6,  4,  6,  7,    // right
      8,  9,  10, 8,  10, 11,    // up
      12, 13, 14, 12, 14, 15,    // left
      16, 17, 18, 16, 18, 19,    // down
      20, 21, 22, 20, 22, 23     // back
    ] )
    //顶点个数
    this.count = indices.length

    let indexBuffer = gl.createBuffer()
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer )
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW )

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW )
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position)

    let colorBuffer = gl.createBuffer()
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer )
    gl.bufferData( gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW )
    let a_Color = gl.getAttribLocation( gl.program, 'a_Color' )
    gl.vertexAttribPointer( a_Color, 3, gl.FLOAT, false, 0, 0 )
    gl.enableVertexAttribArray( a_Color )
  }

  render () {
    let gl = this.ctx
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_BYTE, 0)
  }

}