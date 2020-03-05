import * as dat from 'dat.gui'
import * as ch02 from './ch02'
import * as ch03 from './ch03'
import * as ch04 from './ch04'
import * as ch05 from './ch05'
import * as ch07 from './ch07'
import * as ch08 from './ch08'
import * as ch09 from './ch09'
import * as ch10 from './ch10'

const gui = new dat.GUI()

//所有章节
let chapters = {
  ch02, ch03, ch04, ch05, ch07, ch08, ch09, ch10
}

//当前章节
let current = {
  chapter: ''
}

//当前所有的demo
let demoList = []

/**
 * 显示哪个章节
 * @param {String} chapter index of the chapter
 * @returns {void}
 */
function show(chapter = 'ch10') {

  if (current.chapter == chapter) {
    return
  }

  demoList.forEach(demo => demo.destroy())
  demoList = []

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