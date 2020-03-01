import Demo from '../common/demo'
import vert from '../shaders/a_pos_size.vs'
import frag from '../shaders/u_color.fs'

export class Uniform extends Demo{

  constructor(name){
    super(name,{vert,frag})
    this.points = []
    this.colors = []

    this.$canvas.onmousedown = ev => {
      this.click(ev)
      this.render()
    }
  }
  render() {
    let gl = this.ctx
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    gl.clear(gl.COLOR_BUFFER_BIT)
    let len = this.points.length
    for (let i = 0;i < len;i++) {
      let xy = this.points[i]
      let rgba = this.colors[i]
      gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0)
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])
      gl.drawArrays(gl.POINTS, 0, 1)
    }
  }

  click(ev) {
    let x = ev.clientX
    let y = ev.clientY
    let rect = ev.target.getBoundingClientRect()

    x = (x - rect.left - this.$canvas.width / 2) / (this.$canvas.width / 2)
    y = (this.$canvas.height / 2 - (y - rect.top)) / (this.$canvas.height / 2)

    this.points.push([x, y])

    if (x >= 0.0 && y >= 0.0) { // First quadrant
      this.colors.push([1.0, 0.0, 0.0, 1.0]) // Red
    } else if (x < 0.0 && y < 0.0) { // Third quadrant
      this.colors.push([0.0, 1.0, 0.0, 1.0]) // Green
    } else { // Others
      this.colors.push([1.0, 1.0, 1.0, 1.0]) // White
    }
  }
}
