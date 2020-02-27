
// import { Loader } from 'resource-loader'
// import * as dat from 'dat.gui'
import * as examples from './js'

// import {Spector,EmbeddedFrontend} from 'spectorjs'
    
// const gui = new dat.GUI()
// gui.useLocalStorage = false

// class Render{
//   constructor(){

//     // this.canvas = document.querySelector('#stage')
//     // this.context = this.canvas.getContext('webgl')
//     // this.spector = new Spector()

//     // this.spector.onCapture.add(result => {
//     //   let resultView = new EmbeddedFrontend.ResultView()
//     //   resultView.display()
//     //   resultView.addCapture(result)
//     // })
   
//     // if (!this.context) {
//     //   console.log('Failed to get the rendering context for WebGL')
//     //   return
//     // }
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

  // gui.add({name:'webgl examples'},'name')
  // gui.add({capture:()=>render.capture()},'capture')

  for (let [name, Demo] of Object.entries(examples)) {
    new Demo(name)
  }

}

window.onload = setup