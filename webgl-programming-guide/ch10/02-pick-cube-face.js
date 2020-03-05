import Demo from '../common/demo'
import Matrix4 from '../common/matrix4'

let vert =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute float a_Face;\n' +   // Surface number (Cannot use int for attribute variable)
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform int u_PickedFace;\n' + // Surface number of selected face
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  int face = int(a_Face);\n' + // Convert to int
  '  vec3 color = (face == u_PickedFace) ? vec3(1.0) : a_Color.rgb;\n' +
  '  if(u_PickedFace == 0) {\n' + // In case of 0, insert the face number into alpha
  '    v_Color = vec4(color, a_Face/255.0);\n' +
  '  } else {\n' +
  '    v_Color = vec4(color, a_Color.a);\n' +
  '  }\n' +
  '}\n'

// Fragment shader program
let frag =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n'


const ANGLE_STEP = 20.0 // Rotation angle (degrees/second)

export class PickCubeFace extends Demo {
  constructor(name) {
    super(name, { vert, frag })

    this.desc = '鼠标选中立方体的一个面'

    this.setup()
  }

  async setup() {

    let gl = this.ctx

    this.initVertexBuffer()

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    this.u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
    this.u_PickedFace = gl.getUniformLocation(gl.program, 'u_PickedFace')

    this.viewProjMatrix = new Matrix4()
    this.viewProjMatrix.setPerspective(30.0, this.$canvas.width / this.$canvas.height, 1.0, 100.0)
    this.viewProjMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)

    gl.uniform1i(this.u_PickedFace, -1)

    this.mvpMatrix = new Matrix4() // Model view projection matrix

    this.currentAngle = 0
    this.lastTime = Date.now()

    this.$canvas.onmousedown = (ev) => {   // Mouse is pressed
      let x = ev.clientX, y = ev.clientY
      let rect = ev.target.getBoundingClientRect()
      if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        // If Clicked position is inside the <canvas>, update the selected surface
        let x_in_canvas = x - rect.left, y_in_canvas = rect.bottom - y
        let face = this.checkFace(x_in_canvas, y_in_canvas)
        gl.uniform1i(this.u_PickedFace, face) // Pass the surface number to u_PickedFace
        this.render()
      }
    }

    this.update()
  }

  update() {
    let now = Date.now()
    let elapsed = now - this.lastTime
    this.lastTime = now

    // Update the current rotation angle (adjusted by the elapsed time)
    let newAngle = this.currentAngle + ANGLE_STEP * elapsed / 1000.0

    this.currentAngle = newAngle % 360

    this.render()
    requestAnimationFrame(() => this.update())
  }

  checkFace(x, y) {
    let gl = this.ctx
    let pixels = new Uint8Array(4) // Array for storing the pixel value
    gl.uniform1i(this.u_PickedFace, 0)  // Draw by writing surface number into alpha value
    this.render()    // Read the pixel value of the clicked position. pixels[3] is the surface number
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

    return pixels[3]
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

    let colors = new Float32Array([   // Colors
      0.32, 0.18, 0.56, 0.32, 0.18, 0.56, 0.32, 0.18, 0.56, 0.32, 0.18, 0.56, // v0-v1-v2-v3 front
      0.5, 0.41, 0.69, 0.5, 0.41, 0.69, 0.5, 0.41, 0.69, 0.5, 0.41, 0.69,  // v0-v3-v4-v5 right
      0.78, 0.69, 0.84, 0.78, 0.69, 0.84, 0.78, 0.69, 0.84, 0.78, 0.69, 0.84, // v0-v5-v6-v1 up
      0.0, 0.32, 0.61, 0.0, 0.32, 0.61, 0.0, 0.32, 0.61, 0.0, 0.32, 0.61,  // v1-v6-v7-v2 left
      0.27, 0.58, 0.82, 0.27, 0.58, 0.82, 0.27, 0.58, 0.82, 0.27, 0.58, 0.82, // v7-v4-v3-v2 down
      0.73, 0.82, 0.93, 0.73, 0.82, 0.93, 0.73, 0.82, 0.93, 0.73, 0.82, 0.93 // v4-v7-v6-v5 back
    ])

    let faces = new Uint8Array([   // Faces
      1, 1, 1, 1,     // v0-v1-v2-v3 front
      2, 2, 2, 2,     // v0-v3-v4-v5 right
      3, 3, 3, 3,     // v0-v5-v6-v1 up
      4, 4, 4, 4,     // v1-v6-v7-v2 left
      5, 5, 5, 5,     // v7-v4-v3-v2 down
      6, 6, 6, 6     // v4-v7-v6-v5 back
    ])

    let indices = new Uint8Array([   // Indices of the vertices
      0, 1, 2, 0, 2, 3,    // front
      4, 5, 6, 4, 6, 7,    // right
      8, 9, 10, 8, 10, 11,    // up
      12, 13, 14, 12, 14, 15,    // left
      16, 17, 18, 16, 18, 19,    // down
      20, 21, 22, 20, 22, 23     // back
    ])

    this.count = indices.length

    // Create a buffer object
    let indexBuffer = gl.createBuffer()

    this.initArrayBuffer('a_Position', vertices, 3)
    this.initArrayBuffer('a_Color', colors, 3)
    this.initArrayBuffer('a_Face', faces, 1, gl.UNSIGNED_BYTE)

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  }

  initArrayBuffer(attribute, data, num, type) {
    let gl = this.ctx
    type = type || gl.FLOAT
    let buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    let location = gl.getAttribLocation(gl.program, attribute)
    gl.vertexAttribPointer(location, num, type, false, 0, 0)
    gl.enableVertexAttribArray(location)
  }

  render() {
    let gl = this.ctx

    this.mvpMatrix.set(this.viewProjMatrix)
    this.mvpMatrix.rotate(this.currentAngle, 1.0, 0.0, 0.0) // Rotate appropriately
    this.mvpMatrix.rotate(this.currentAngle, 0.0, 1.0, 0.0)
    this.mvpMatrix.rotate(this.currentAngle, 0.0, 0.0, 1.0)
    gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)     // Clear buffers
    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_BYTE, 0)
  }

}