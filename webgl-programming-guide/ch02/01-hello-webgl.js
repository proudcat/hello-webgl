import Demo from '../common/demo'

export class HelloWebGL extends Demo{

  constructor(name){
    super(name)
    this.render()
  }

  render() {
    let gl = this.ctx
    gl.clearColor(1, 1, 0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }
}