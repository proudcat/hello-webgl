
import * as examples from './js'

// import {Spector,EmbeddedFrontend} from 'spectorjs'

// class Render{
//   constructor(){

//     // this.spector = new Spector()

//     // this.spector.onCapture.add(result => {
//     //   let resultView = new EmbeddedFrontend.ResultView()
//     //   resultView.display()
//     //   resultView.addCapture(result)
//     // })
//   }

//   capture(){
//     if (this.name){
//       this.spector.captureCanvas(this.canvas)
//     }
//   }

//   render(name){
//     this.name = name
//     // if(this.raf){
//     //   window.cancelAnimationFrame(this.raf)
//     // }
//     let example = new examples[name](this.context,this.canvas)
//     example.render()
//     // this.raf = window.requestAnimationFrame(()=>this.render(name))
//   }
// }

function setup(){
  for (let [name, Demo] of Object.entries(examples)) {
    new Demo(name)
  }
}

window.onload = setup