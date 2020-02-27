import { Demo,load,initShader } from './demo'

export class Uniform extends Demo{

  constructor(name){
    super(name)
    this.g_points = [] // The array for the position of a mouse press
    this.g_colors = [] // The array to store the color of a point

    load([
      {name:'vert',url:'shaders/a_pos.vs'},
      {name:'frag',url:'shaders/u_color.fs'}
    ])
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
    let len = this.g_points.length
    for (let i = 0;i < len;i++) {
      let xy = this.g_points[i]
      let rgba = this.g_colors[i]
      gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0)
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3])
      gl.drawArrays(gl.POINTS, 0, 1)
    }
  }

  click(ev) {
    let x = ev.clientX // x coordinate of a mouse pointer
    let y = ev.clientY // y coordinate of a mouse pointer
    let rect = ev.target.getBoundingClientRect()

    x = ((x - rect.left) - this.$canvas.width / 2) / (this.$canvas.width / 2)
    y = (this.$canvas.height / 2 - (y - rect.top)) / (this.$canvas.height / 2)

    // Store the coordinates to g_points array
    this.g_points.push([x, y])
    // Store the coordinates to g_points array
    if (x >= 0.0 && y >= 0.0) { // First quadrant
      this.g_colors.push([1.0, 0.0, 0.0, 1.0]) // Red
    } else if (x < 0.0 && y < 0.0) { // Third quadrant
      this.g_colors.push([0.0, 1.0, 0.0, 1.0]) // Green
    } else { // Others
      this.g_colors.push([1.0, 1.0, 1.0, 1.0]) // White
    }
  }
}
    