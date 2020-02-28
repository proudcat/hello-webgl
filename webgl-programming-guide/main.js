import * as dat from 'dat.gui'
import * as ch02 from './ch02'
import * as ch03 from './ch03'
import * as ch04 from './ch04'

const gui = new dat.GUI()

//所有章节
let chapters = {
  ch02, ch03, ch04
}

//上一个显示的章节
let last = {
  chapter:''
}

//当前所有的demo
let demoList = []

/**
 * 显示哪个章节
 * @param {String} index 
 */
function show(chapter='ch04'){

  if(last.chapter == chapter){
    return
  }else{
    demoList.forEach(demo => demo.destroy())
    demoList=[]
  }
  
  for (let [name, Demo] of Object.entries(chapters[chapter])) {
    let demo = new Demo(name)
    demoList.push(demo)
  }

  last.chapter = chapter
}

function setup(){

  gui.close()
  gui.add(last, 'chapter').listen()

  for (const chapter in chapters) {
    gui.add({select: () => show(chapter)},'select').name(chapter)
  }

  show()
}

window.onload = setup