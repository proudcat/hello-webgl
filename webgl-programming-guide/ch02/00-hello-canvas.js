import Demo from '../common/demo'

export class HelloCanvas extends Demo{

  constructor(name){
    super(name,null,'2d')
    this.render()
  }

  render() {
    this.ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'
    this.ctx.fillRect(20, 10, 80, 80)
  }
}