import { Demo,load,initShader } from './demo'

export class Attribute extends Demo{
  constructor(name){
    super(name)

    load([{name:'vert',url:'shaders/a_pos.vs'},{name:'frag',url:'shaders/red.fs'}])
      .then(res =>{
        
        if(!initShader(this.ctx,res.vert.data,res.frag.data)){
          console.log('failed to initialize shaders')
          return
        }

        this.render()
        
      })
      .catch(err=>{
        console.log('load shader failed',err)
      })
  }

  render() {
    let gl = this.ctx
    // Get the storage location of a_Position
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position')
      return
    }

    // Pass vertex position to attribute variable
    let pos = new Float32Array([-0.5, 0.0, 0.0, 1.0])
    gl.vertexAttrib4fv(a_Position, pos)
    // gl.vertexAttrib4f(a_Position, 0.5, 0.0, 0.0,1.0);
    // gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0);
    // gl.vertexAttrib2f(a_Position, 0.5, 0.0);
    // gl.vertexAttrib1f(a_Position, 0.5);

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.POINTS, 0, 1)
  }
}
