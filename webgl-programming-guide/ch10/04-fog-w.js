import Demo from '../common/demo'
import Matrix4 from '../common/matrix4'
import {Vector4} from '../common/vector'
import * as KeyCode from 'keycode-js'

let vert =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'varying float v_Dist;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  // Use the negative z value of each vertex in view coordinate system
  '  v_Dist = gl_Position.w;\n' +
  '}\n'

// Fragment shader program
let frag =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform vec3 u_FogColor;\n' + // Color of Fog
  'uniform vec2 u_FogDist;\n' +  // Distance of Fog (starting point, end point)
  'varying vec4 v_Color;\n' +
  'varying float v_Dist;\n' +
  'void main() {\n' +
  // Calculation of fog factor (factor becomes smaller as it goes further away from eye point)
  '  float fogFactor = (u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x);\n' +
  // Stronger fog as it gets further: u_FogColor * (1 - fogFactor) + v_Color * fogFactor
  '  vec3 color = mix(u_FogColor, vec3(v_Color), clamp(fogFactor, 0.0, 1.0));\n' +
  '  gl_FragColor = vec4(color, v_Color.a);\n' +
  '}\n'


export class FogW extends Demo {
  constructor(name) {
    super(name, { vert, frag })

    this.desc = '↑↓: 增加/减小 雾的距离(gl_Position.w)'

    this.setup()
  }

  setup() {

    let gl = this.ctx

    this.initVertexBuffer()

    // Color of Fog
    let fogColor = new Float32Array([0.137, 0.231, 0.423])
    // Distance of fog [where fog starts, where fog completely covers object]
    this.fogDist = new Float32Array([55, 80])
    // Position of eye point (world coordinates)
    let eye = new Float32Array([25, 65, 35, 1.0])

    // Get the storage locations of uniform variables
    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
    let u_FogColor = gl.getUniformLocation(gl.program, 'u_FogColor')
    this.u_FogDist = gl.getUniformLocation(gl.program, 'u_FogDist')

    // Pass fog color, distances, and eye point to uniform variable
    gl.uniform3fv(u_FogColor, fogColor) // Colors

    // Set clear color and enable hidden surface removal
    gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0) // Color of Fog
    gl.enable(gl.DEPTH_TEST)

    // Pass the model matrix to u_ModelMatrix
    let modelMatrix = new Matrix4()
    modelMatrix.setScale(10, 10, 10)

    // Pass the model view projection matrix to u_MvpMatrix
    let mvpMatrix = new Matrix4()
    mvpMatrix.setPerspective(30, this.$canvas.width / this.$canvas.height, 1, 1000)
    mvpMatrix.lookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0)
    mvpMatrix.multiply(modelMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
    document.addEventListener('keydown', ev => this.keydown(ev))

    this.render()

    let modelViewMatrix = new Matrix4()
    modelViewMatrix.setLookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0)
    modelViewMatrix.multiply(modelMatrix)
    modelViewMatrix.multiplyVector4(new Vector4([1, 1, 1, 1]))
    mvpMatrix.multiplyVector4(new Vector4([1, 1, 1, 1]))
    modelViewMatrix.multiplyVector4(new Vector4([-1, 1, 1, 1]))
    mvpMatrix.multiplyVector4(new Vector4([-1, 1, 1, 1]))
  }

  keydown(ev) {

    if (!this.enabled) {
      return
    }

    switch (ev.keyCode) {
    case KeyCode.KEY_UP: // Up arrow key -> Increase the maximum distance of fog
      this.fogDist[1] += 1
      break
    case KeyCode.KEY_DOWN: // Down arrow key -> Decrease the maximum distance of fog
      if (this.fogDist[1] > this.fogDist[0]) {
        this.fogDist[1] -= 1
      }
      break
    default: return
    }

    this.render()
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
      1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1,    // v0-v1-v2-v3 front
      1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1,    // v0-v3-v4-v5 right
      1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1,    // v0-v5-v6-v1 up
      -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1,    // v1-v6-v7-v2 left
      -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,    // v7-v4-v3-v2 down
      1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1     // v4-v7-v6-v5 back
    ])

    let colors = new Float32Array([     // Colors
      0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,  // v0-v1-v2-v3 front
      0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,  // v0-v3-v4-v5 right
      1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,  // v0-v5-v6-v1 up
      1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
      0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0   // v4-v7-v6-v5 back
    ])

    let indices = new Uint8Array([       // Indices of the vertices
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

    // Write the vertex property to buffers (coordinates and normals)
    this.initArrayBuffer('a_Position', vertices, 3)
    this.initArrayBuffer('a_Color', colors, 3)

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

    gl.uniform2fv(this.u_FogDist, this.fogDist)   // Starting point and end point

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_BYTE, 0)

  }

}