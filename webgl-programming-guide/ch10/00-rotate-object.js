import vert from '../shaders/tex_mvp.vert'
import frag from '../shaders/u_sampler_v_texcoord.frag'
import Demo from '../common/demo'
import Matrix4 from '../common/matrix4'

export class RotateObject extends Demo {
  constructor(name) {
    super(name, { vert, frag })

    this.desc = '鼠标拖拽旋转物体'

    this.setup()
  }

  async setup() {

    let gl = this.ctx

    this.initVertexBuffer()

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    this.u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
    this.u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')

    this.viewProjMatrix = new Matrix4()
    this.viewProjMatrix.setPerspective(30.0, this.$canvas.width / this.$canvas.height, 1.0, 100.0)
    this.viewProjMatrix.lookAt(3.0, 3.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)

    this.currentAngle = [0.0, 0.0]
    this.mvpMatrix = new Matrix4()

    this.initEventHandlers()
    await this.initTexture()

    this.update()
  }

  update() {
    this.render()
    requestAnimationFrame(() => this.update())
  }

  initEventHandlers() {
    let dragging = false         // Dragging or not
    let lastX = -1, lastY = -1   // Last position of the mouse

    this.$canvas.onmousedown = ev => {   // Mouse is pressed
      let x = ev.clientX, y = ev.clientY

      let rect = ev.target.getBoundingClientRect()
      if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        lastX = x; lastY = y
        dragging = true
      }
    }

    this.$canvas.onmouseup = ev => {
      dragging = false
    }

    this.$canvas.onmousemove = ev => { // Mouse is moved
      let x = ev.clientX, y = ev.clientY
      if (dragging) {
        let factor = 200 / this.$canvas.height // The rotation ratio
        let dx = factor * (x - lastX)
        let dy = factor * (y - lastY)
        // Limit x-axis rotation angle to -90 to 90 degrees
        this.currentAngle[0] = Math.max(Math.min(this.currentAngle[0] + dy, 90.0), -90.0)
        this.currentAngle[1] = this.currentAngle[1] + dx
      }
      lastX = x
      lastY = y
    }
  }

  async initTexture() {
    let gl = this.ctx

    let texture = gl.createTexture()
    let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler')

    let image = await this.loadImage('../images/sky.jpg')

    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)

    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0)

    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler, 0)

  }

  initVertexBuffer() {

    let gl = this.ctx
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    let vertices = new Float32Array([   // Vertex coordinates
      1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,    // v0-v1-v2-v3 front
      1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,    // v0-v3-v4-v5 right
      1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,    // v1-v6-v7-v2 left
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,    // v7-v4-v3-v2 down
      1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0     // v4-v7-v6-v5 back
    ])

    let texCoords = new Float32Array([   // Texture coordinates
      1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,    // v0-v1-v2-v3 front
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,    // v0-v3-v4-v5 right
      1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,    // v0-v5-v6-v1 up
      1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,    // v1-v6-v7-v2 left
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,    // v7-v4-v3-v2 down
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0     // v4-v7-v6-v5 back
    ])

    // Indices of the vertices
    let indices = new Uint8Array([
      0, 1, 2, 0, 2, 3,    // front
      4, 5, 6, 4, 6, 7,    // right
      8, 9, 10, 8, 10, 11,    // up
      12, 13, 14, 12, 14, 15,    // left
      16, 17, 18, 16, 18, 19,    // down
      20, 21, 22, 20, 22, 23     // back
    ])

    //顶点个数
    this.count = indices.length

    // Create a buffer object
    let indexBuffer = gl.createBuffer()

    this.initArrayBuffer('a_Position', vertices, 3)
    this.initArrayBuffer('a_TexCoord', texCoords, 2)

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  }

  initArrayBuffer(attribute, data, num) {
    let gl = this.ctx
    let buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    let location = gl.getAttribLocation(gl.program, attribute)
    gl.vertexAttribPointer(location, num, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(location)
  }

  render() {
    let gl = this.ctx
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    this.mvpMatrix.set(this.viewProjMatrix)
    this.mvpMatrix.rotate(this.currentAngle[0], 1.0, 0.0, 0.0) // Rotation around x-axis
    this.mvpMatrix.rotate(this.currentAngle[1], 0.0, 1.0, 0.0) // Rotation around y-axis
    gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements)

    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_BYTE, 0)   // Draw the cube
  }

}