import { Demo,initShader } from '../common/demo'
import vert from '../shaders/origin.vs'
import frag from '../shaders/red.fs'

export class DrawPoint extends Demo{
  constructor(name) {
    super(name)
        
    if(!initShader(this.ctx,vert,frag)){
      console.log('failed to initialize shaders')
      return
    }
    
    this.render()
  }

  render() {
    
    let gl = this.ctx

    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.POINTS, 0, 1)
  }
}
