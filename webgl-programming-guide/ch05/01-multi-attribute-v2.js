import Demo from '../common/demo'
import vert from '../shaders/a_pos_a_size.vs'
import frag from '../shaders/red.fs'

export class MultiAttributeV2 extends Demo{

  constructor(name){
    super(name,{vert,frag})

    let gl = this.ctx
     
    //顶点个数
    this.count = 3

    let vertices = new Float32Array([
      //顶点坐标和点的尺寸
      0.0,  0.5,  10.0, //第一个点
      -0.5, -0.5, 20.0, //第二个点
      0.5,  -0.5, 30.0, //第三个点
    ])

    const FSIZE = vertices.BYTES_PER_ELEMENT
    
    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * this.count, 0)
    gl.enableVertexAttribArray(a_Position)

    let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * this.count, FSIZE*2)
    gl.enableVertexAttribArray(a_PointSize)
  
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    this.render()
  }
  render() {
    let gl = this.ctx
    
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.POINTS, 0, this.count)
  }

}
    