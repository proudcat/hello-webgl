import Demo from '../common/demo'
import Matrix4 from '../common/matrix4.js'
import * as KeyCode from 'keycode-js'

let vert =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n'

// Fragment shader program
let frag =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n'


export class LookAtTriangleWithKeys extends Demo {

  constructor(name) {
    super(name, { vert, frag })
    this.desc = '←→: 旋转查看alpha混合效果'

    let gl = this.ctx

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    let verticesColors = new Float32Array([
    // Vertex coordinates and color(RGBA)
      0.0,  0.5,  -0.4,  0.4,  1.0,  0.4,  0.4, // The back green one
      -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,  0.4,
      0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,  0.4,

      0.5,  0.4,  -0.2,  1.0,  0.4,  0.4,  0.4, // The middle yerrow one
      -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,  0.4,
      0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,  0.4,

      0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  0.4,  // The front blue one
      -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,  0.4,
      0.5, -0.5,   0.0,  1.0,  0.4,  0.4,  0.4
    ])

    this.count = 9

    // Create a buffer object
    let vertexColorbuffer = gl.createBuffer()

    // Write the vertex information and enable it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

    let FSIZE = verticesColors.BYTES_PER_ELEMENT

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 7, 0)
    gl.enableVertexAttribArray(a_Position)

    let a_Color = gl.getAttribLocation(gl.program, 'a_Color')
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, FSIZE * 7, FSIZE * 3)
    gl.enableVertexAttribArray(a_Color)

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null)


    this.u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
    let u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix')

    // Create the view projection matrix
    this.viewMatrix = new Matrix4()
    document.addEventListener('keydown', ev => this.keydown(ev))

    // Create Projection matrix and set to u_ProjMatrix
    let projMatrix = new Matrix4()
    projMatrix.setOrtho(-1, 1, -1, 1, 0, 2)
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements)

    this.eyeX = 0.20
    this.eyeY = 0.25
    this.eyeZ = 0.25

    document.addEventListener('keydown', ev => this.keydown(ev))

    this.render()
  }

  keydown(ev) {

    if (!this.enabled) {
      return
    }

    if (ev.keyCode == KeyCode.KEY_RIGHT) { // The right arrow key was pressed
      this.eyeX += 0.01
    } else
    if (ev.keyCode == KeyCode.KEY_LEFT) { // The left arrow key was pressed
      this.eyeX -= 0.01
    } else {
      return
    }

    this.render()
  }

  render() {
    let gl = this.ctx
    this.viewMatrix.setLookAt(this.eyeX, this.eyeY, this.eyeZ, 0, 0, 0, 0, 1, 0)

    // Pass the view projection matrix
    gl.uniformMatrix4fv(this.u_ViewMatrix, false, this.viewMatrix.elements)

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, this.count)
  }

}