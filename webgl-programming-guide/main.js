
import * as dat from 'dat.gui'
import * as ch02 from './ch02'

const gui = new dat.GUI()

//所以章节
let chapters = {
  ch02
}

//当前章节
let current

/**
 * 显示哪个章节
 * @param {String} index 
 */
function show(index){

  if(current == index){
    return
  }else{
    let $root = document.querySelector('#container')
    while ($root.hasChildNodes()) {
      $root.removeChild($root.lastChild)
    }
  }

  for (let [name, Demo] of Object.entries(chapters[index])) {
    new Demo(name)
  }
  current = index
}

function setup(){

  for (const key in chapters) {
    gui.add({chapter: () => {
      show(key)
    }},'chapter').name(key)
  }

  show('ch02')
}

window.onload = setup