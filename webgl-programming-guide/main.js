import * as dat from 'dat.gui'
import * as ch02 from './ch02'
import * as ch03 from './ch03'
import * as ch04 from './ch04'
import * as ch05 from './ch05'
import * as ch07 from './ch07'

const gui = new dat.GUI()

//所有章节
let chapters = {
  ch02, ch03, ch04, ch05, ch07
}

//当前章节
let current = {
  chapter: ''
}

//当前所有的demo
let demoList = []

/**
 * 显示哪个章节
 * @param {String} index 
 */
function show(chapter = 'ch07') {

  if (current.chapter == chapter) {
    return
  } else {
    demoList.forEach(demo => demo.destroy())
    demoList = []
  }

  // if(!chapter){
  //   chapter = current.chapter
  // }

  for (let [name, Demo] of Object.entries(chapters[chapter])) {
    let demo = new Demo(name)
    demoList.push(demo)
  }

  current.chapter = chapter
}

function setup() {

  gui.close()
  gui.add(current, 'chapter').listen()

  for (const chapter in chapters) {
    gui.add({ select: () => show(chapter) }, 'select').name(chapter)
  }

  show()
}

window.onload = setup