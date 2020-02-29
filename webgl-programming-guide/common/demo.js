// import {Spector,EmbeddedFrontend} from 'spectorjs'
import {initShader} from './webgl-util'

export default class Demo{
  constructor(name,shaders,context='webgl'){
    this.name = name

    let $container = document.querySelector('#container')

    this.$root = document.createElement('div')
    this.$root.className='demo'

    let $button = document.createElement('button')
    $button.textContent=name
    $button.onclick = ()=>{
      console.log('click',this.name)
      // let spector = new Spector()

      // spector.onCapture.add(result => {
      //   let resultView = new EmbeddedFrontend.ResultView()
      //   resultView.display()
      //   resultView.addCapture(result)
      // })
      // window.requestAnimationFrame(()=>this.render())
   
      // spector.captureCanvas(this.$canvas)
      this.render()
    }
    
    let $canvas = document.createElement('canvas')
    $canvas.id = name
    $canvas.textContent='你的浏览器不支持 WebGL.'
    $canvas.addEventListener('webglcontextcreationerror', event => {
      console.log('WebGL Error:',event.statusMessage)
    }, false)

    this.$root.appendChild($button)
    this.$root.appendChild($canvas)
    $container.appendChild(this.$root)
    
    this.$canvas = $canvas
    this.ctx = this.$canvas.getContext(context)
    
    this.resize($canvas.clientWidth,$canvas.clientHeight)

    if(shaders){
      if(!initShader(this.ctx,shaders.vert,shaders.frag)){
        console.error('failed to initialize shaders')
        return
      }
    }
  }

  loadImage(url){
    let promise = new Promise((resovle,reject)=>{
      let image = new Image()
      image.onload=()=>{
        resovle(image)
      }
      image.onerror=()=>{
        reject()
      }
      image.src = url
    })
    return promise
  }

  /**
   * 调整canvas大小
   * @param {*} width 
   * @param {*} height 
   */
  resize(width,height){
    this.$canvas.style.width=`${width}px`
    this.$canvas.style.height=`${height}px`
    this.$canvas.width = width
    this.$canvas.height = height
    if(this.ctx instanceof WebGLRenderingContext){
      this.ctx.viewport(0,0,width,height)
    }  
  }

  /**
   * 调用WebGL渲染
   */
  render(){
    throw '没有实现render方法'
  }

  /**
   * 销毁资源
   */
  destroy(){
    if(this.ctx instanceof WebGLRenderingContext){
      this.ctx.getExtension('WEBGL_lose_context').loseContext()
    } 
    let $container = document.querySelector('#container')
    $container.removeChild(this.$root)
  }

}