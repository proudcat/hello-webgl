import Demo from '../common/demo'
import frag from '../shaders/v_color.frag'
import Matrix4 from '../common/matrix4.js'
import vert from '../shaders/directional-light-diffuse-ambient.vert'
import { Vector3 } from '../common/vector'

export class DirectionalLightDiffuseAmbientAnimation extends Demo {

  constructor(name) {
    super(name, { vert, frag })

    let gl = this.ctx

    this.initVertexBuffer()

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    this.mvpMatrix = new Matrix4()
    this.mvpMatrix.setPerspective(30, this.$canvas.width/this.$canvas.height, 1, 100)
    this.mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)

    this.u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')

    let u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor')
    let u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection')

    this.u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')

    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0)
    let lightDirection = new Vector3([0.5, 3.0, 4.0])
    lightDirection.normalize()
    gl.uniform3fv(u_LightDirection, lightDirection.elements)

    let u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight')
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2)

    this.angle = 0.0
    this.lastNow = Date.now()
    this.modelMatrix = new Matrix4()

    // this.normalMatrix = new Matrix4()

    this.update()
  }

  update() {
    let gl = this.ctx
    let now = Date.now()
    let elapsed = now - this.lastNow
    this.lastNow = now
    this.angle = (this.angle + 30.0 * elapsed) / 1000.0
    this.angle %= 360

    this.modelMatrix.setRotate(this.angle, 0, 1, 0)
    this.mvpMatrix.multiply(this.modelMatrix)
    gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements)

    // this.normalMatrix.setInverseOf(this.modelMatrix)
    // this.normalMatrix.transpose()
    // gl.uniformMatrix4fv(this.u_NormalMatrix,false,this.normalMatrix.elements)

    this.render()

    requestAnimationFrame(() =>this.update())
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
    var vertices = new Float32Array([   // Vertex coordinates
      1.0,   1.0,  1.0, -1.0,  1.0,  1.0, -1.0, -1.0,  1.0,  1.0, -1.0 , 1.0,  // v0-v1-v2-v3 front
      1.0,   1.0,  1.0,  1.0, -1.0,  1.0,  1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  // v0-v3-v4-v5 right
      1.0,   1.0,  1.0,  1.0,  1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  // v0-v5-v6-v1 up
      -1.0,  1.0,  1.0, -1.0,  1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,  1.0,  // v1-v6-v7-v2 left
      -1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,  // v7-v4-v3-v2 down
      1.0,  -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0   // v4-v7-v6-v5 back
    ])

    var colors = new Float32Array([     // Colors
      // 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
      // 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
      // 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
      // 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
      // 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
      // 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0   // v4-v7-v6-v5 back

      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v1-v2-v3 front
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v3-v4-v5 right
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v5-v6-v1 up
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v1-v6-v7-v2 left
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v7-v4-v3-v2 down
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0      // v4-v7-v6-v5 back
    ])

    var indices = new Uint8Array([
      // Indices of the vertices
      0,  1,  2,  0,  2,  3,    // front
      4,  5,  6,  4,  6,  7,    // right
      8,  9,  10, 8,  10, 11,   // up
      12, 13, 14, 12, 14, 15,   // left
      16, 17, 18, 16, 18, 19,   // down
      20, 21, 22, 20, 22, 23    // back
    ])

    let normals = new Float32Array([    // Normal
      0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  // v0-v1-v2-v3 front
      1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  // v0-v3-v4-v5 right
      0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  // v0-v5-v6-v1 up
      -1.0, 0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0,  // v1-v6-v7-v2 left
      0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  // v7-v4-v3-v2 down
      0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0   // v4-v7-v6-v5 back
    ])

    //顶点个数
    this.count = indices.length

    let indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    this.initArrayBuffer('a_Position', vertices, 3)
    this.initArrayBuffer('a_Color', colors, 3)
    this.initArrayBuffer('a_Normal', normals, 3)

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
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_BYTE, 0)
  }

}