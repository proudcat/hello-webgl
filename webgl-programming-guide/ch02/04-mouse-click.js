import Demo from '../common/demo'
import vert from '../shaders/a_pos.vs'
import frag from '../shaders/red.fs'

export class MouseClick extends Demo{

  constructor(name){
    super(name,{vert,frag})
    this.points = [] 

    this.$canvas.onmousedown =  ev => {
      this.click(ev)
      this.render()
    }
  }
  render() {
    
    let gl = this.ctx

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    let len = this.points.length
    for (let i = 0;i < len;i += 2) {
      gl.vertexAttrib3f(a_Position, this.points[i], this.points[i + 1], 0.0)
      gl.drawArrays(gl.POINTS, 0, 1)
    }
  }

  click(ev) {
    let x = ev.clientX 
    let y = ev.clientY 
    let rect = ev.target.getBoundingClientRect()

    x = ((x - rect.left) - this.$canvas.width / 2) / (this.$canvas.width / 2)
    y = (this.$canvas.height / 2 - (y - rect.top)) / (this.$canvas.height / 2)

    this.points.push(x)
    this.points.push(y)
  }
}
