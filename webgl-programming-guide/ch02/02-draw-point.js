import { Demo,load,initShader } from '../common/demo'

export class DrawPoint extends Demo{
  constructor(name) {
    super(name)

    load([{name:'vert',url:'shaders/origin.vs'},{name:'frag',url:'shaders/red.fs'}])
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

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.POINTS, 0, 1)
  }
}
