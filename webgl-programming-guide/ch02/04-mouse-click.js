import { Demo,load,initShader } from '../common/demo'

export class MouseClick extends Demo{

  constructor(name){
    super(name)
    this.g_points = [] 

    load([
      {name:'vert',url:'shaders/a_pos.vs'},
      {name:'frag',url:'shaders/red.fs'}
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

    let len = this.g_points.length
    for (let i = 0;i < len;i += 2) {
      gl.vertexAttrib3f(a_Position, this.g_points[i], this.g_points[i + 1], 0.0)
      gl.drawArrays(gl.POINTS, 0, 1)
    }
  }

  click(ev) {
    let x = ev.clientX 
    let y = ev.clientY 
    let rect = ev.target.getBoundingClientRect()

    x = ((x - rect.left) - this.$canvas.width / 2) / (this.$canvas.width / 2)
    y = (this.$canvas.height / 2 - (y - rect.top)) / (this.$canvas.height / 2)

    this.g_points.push(x)
    this.g_points.push(y)
  }
}
