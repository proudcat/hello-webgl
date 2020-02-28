
import * as dat from 'dat.gui'
import * as ch02 from './ch02'
import * as ch03 from './ch03'

const gui = new dat.GUI()

//所有章节
let chapters = {
  ch02, ch03
}

//当前章节
let current = {
  chapter:''
}

/**
 * 显示哪个章节
 * @param {String} index 
 */
function show(chapter='ch03'){

  if(current.chapter == chapter){
    return
  }else{
    let $root = document.querySelector('#container')
    while ($root.hasChildNodes()) {
      $root.removeChild($root.lastChild)
    }
  }
  
  for (let [name, Demo] of Object.entries(chapters[chapter])) {
    new Demo(name)
  }
  current.chapter = chapter
}

function setup(){

  gui.add(current, 'chapter').listen()

  for (const chapter in chapters) {
    gui.add({select: () => show(chapter)},'select').name(chapter)
  }

  show()
}

window.onload = setup