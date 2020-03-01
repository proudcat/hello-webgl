import Demo from '../common/demo'
import vert from '../shaders/a_pos_size_v_color.vs'
import frag from '../shaders/v_color.fs'

export class InterleavingPosColor extends Demo{

  constructor(name){
    super(name,{vert,frag})

    let gl = this.ctx

    //顶点个数
    this.count = 3

    let vertices = new Float32Array([
      // Vertex coordinates and color
      0.0,  0.5,  1.0,  0.0,  0.0,
      -0.5, -0.5, 0.0,  1.0,  0.0,
      0.5,  -0.5, 0.0,  0.0,  1.0
    ])

    const FSIZE = vertices.BYTES_PER_ELEMENT

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0)
    gl.enableVertexAttribArray(a_Position)

    let a_Color = gl.getAttribLocation(gl.program, 'a_Color')
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE*2)
    gl.enableVertexAttribArray(a_Color)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    this.render()
  }
  render() {
    let gl = this.ctx

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.POINTS, 0, this.count)
    // gl.drawArrays(gl.TRIANGLES, 0, this.count)
  }

}
