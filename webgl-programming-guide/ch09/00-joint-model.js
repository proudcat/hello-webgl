import Demo from '../common/demo'
import Matrix4 from '../common/matrix4.js'
import frag from '../shaders/v_color.frag'
import vert from '../shaders/joint.vert'

const ANGLE_STEP = 3.0    // The increments of rotation angle (degrees)
const ARM1_LEN = 10

export class JointModel extends Demo{

  constructor(name) {
    super(name, { vert, frag })

    this.desc = '↔️控制底下的机械臂, ↕️控制上面的机械臂'

    let gl = this.ctx

    this.initVertexBuffer()

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    this.u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
    this.u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')

    this.viewProjMatrix = new Matrix4()
    this.viewProjMatrix.setPerspective(50.0, this.$canvas.width / this.$canvas.height, 1.0, 100.0)
    this.viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)

    this.mvpMatrix = new Matrix4()
    this.modelMatrix = new Matrix4()
    this.normalMatrix = new Matrix4()

    this.joint1Angle = 0.0
    this.arm1Angle = -90

    document.addEventListener('keydown', ev => this.keydown(ev))

    this.render()
  }

  keydown(ev) {

    if (!this.enabled) {
      return
    }

    switch (ev.keyCode) {
    case 38: // Up arrow key -> the positive rotation of joint1 around the z-axis
      if (this.joint1Angle < 135.0) {
        this.joint1Angle += ANGLE_STEP
      }
      break
    case 40: // Down arrow key -> the negative rotation of joint1 around the z-axis
      if (this.joint1Angle > -135.0) {
        this.joint1Angle -= ANGLE_STEP
      }
      break
    case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
      this.arm1Angle = (this.arm1Angle + ANGLE_STEP) % 360
      break
    case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
      this.arm1Angle = (this.arm1Angle - ANGLE_STEP) % 360
      break
    default: return // Skip drawing at no effective action
    }

    this.render()
  }

  initVertexBuffer() {

    let gl = this.ctx

    // Vertex coordinates（a cuboid 3.0 in width, 10.0 in height, and 3.0 in length with its origin at the center of its bottom)
    let vertices = new Float32Array([
      1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5, // v0-v1-v2-v3 front
      1.5, 10.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, 1.5, 10.0, -1.5, // v0-v3-v4-v5 right
      1.5, 10.0, 1.5, 1.5, 10.0, -1.5, -1.5, 10.0, -1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
      -1.5, 10.0, 1.5, -1.5, 10.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5, // v1-v6-v7-v2 left
      -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5, // v7-v4-v3-v2 down
      1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 10.0, -1.5, 1.5, 10.0, -1.5  // v4-v7-v6-v5 back
    ])

    // Normal
    let normals = new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up
      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0  // v4-v7-v6-v5 back
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

    this.initArrayBuffer('a_Position', vertices, 3)
    this.initArrayBuffer('a_Normal', normals, 3)

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    let indexBuffer = gl.createBuffer()
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

    // Arm1
    this.modelMatrix.setTranslate(0.0, -12.0, 0.0)
    this.modelMatrix.rotate(this.arm1Angle, 0.0, 1.0, 0.0)    // Rotate around the y-axis
    this.drawBox()

    // Arm2
    this.modelMatrix.translate(0.0, ARM1_LEN, 0.0) // Move to joint1
    this.modelMatrix.rotate(this.joint1Angle, 0.0, 0.0, 1.0)  // Rotate around the z-axis
    this.modelMatrix.scale(1.3, 1.0, 1.3) // Make it a little thicker
    this.drawBox()
  }

  drawBox() {
    let gl = this.ctx

    this.mvpMatrix.set(this.viewProjMatrix)
    this.mvpMatrix.multiply(this.modelMatrix)
    gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements)

    this.normalMatrix.setInverseOf(this.modelMatrix)
    this.normalMatrix.transpose()
    gl.uniformMatrix4fv(this.u_NormalMatrix, false, this.normalMatrix.elements)

    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_BYTE, 0)
  }

}