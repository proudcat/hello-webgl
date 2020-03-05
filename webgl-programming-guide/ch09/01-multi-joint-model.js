import Demo from '../common/demo'
import Matrix4 from '../common/matrix4.js'
import frag from '../shaders/v_color.frag'
import vert from '../shaders/joint.vert'
import * as KeyCode from 'keycode-js'

const ANGLE_STEP = 3.0    // The increments of rotation angle (degrees)
const BASE_HEIGHT = 2.0
const ARM1_LEN = 10.0
const ARM2_LEN = 10.0
const PALM_LEN = 2.0

export class MultiJointModel extends Demo{

  constructor(name) {
    super(name, { vert, frag })

    this.desc = '←→: arm1 rotation,↑↓: joint1 rotation, xz: joint2(wrist) rotation, cv: finger rotation'

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

    this.arm1Angle = -90
    this.joint1Angle = 45.0   // The rotation angle of joint1 (degrees)
    this.joint2Angle = 0.0
    this.joint3Angle = 0.0
    this.matrixStack = [] // Array for storing a matrix


    document.addEventListener('keydown', ev => this.keydown(ev))

    this.render()
  }

  keydown(ev) {

    if (!this.enabled) {
      return
    }

    switch (ev.keyCode) {
    case KeyCode.KEY_UP: // Up arrow key -> the positive rotation of joint1 around the z-axis
      if (this.joint1Angle < 135.0) {
        this.joint1Angle += ANGLE_STEP
      }
      break
    case KeyCode.KEY_DOWN: // Down arrow key -> the negative rotation of joint1 around the z-axis
      if (this.joint1Angle > -135.0) {
        this.joint1Angle -= ANGLE_STEP
      }
      break
    case KeyCode.KEY_RIGHT: // Right arrow key -> the positive rotation of arm1 around the y-axis
      this.arm1Angle = (this.arm1Angle + ANGLE_STEP) % 360
      break
    case KeyCode.KEY_LEFT: // Left arrow key -> the negative rotation of arm1 around the y-axis
      this.arm1Angle = (this.arm1Angle - ANGLE_STEP) % 360
      break
    case KeyCode.KEY_Z: // 'ｚ'key -> the positive rotation of joint2
      this.joint2Angle = (this.joint2Angle + ANGLE_STEP) % 360
      break
    case KeyCode.KEY_X: // 'x'key -> the negative rotation of joint2
      this.joint2Angle = (this.joint2Angle - ANGLE_STEP) % 360
      break
    case KeyCode.KEY_V: // 'v'key -> the positive rotation of joint3
      if (this.joint3Angle < 60.0) {
        this.joint3Angle = (this.joint3Angle + ANGLE_STEP) % 360
      }
      break
    case KeyCode.KEY_C: // 'c'key -> the nagative rotation of joint3
      if (this.joint3Angle > -60.0) {
        this.joint3Angle = (this.joint3Angle - ANGLE_STEP) % 360
      }
      break
    default: return // Skip drawing at no effective action
    }

    this.render()
  }

  initVertexBuffer() {

    let gl = this.ctx

    // Coordinates（Cube which length of one side is 1 with the origin on the center of the bottom)
    let vertices = new Float32Array([
      0.5,  1.0,  0.5, -0.5, 1.0,  0.5, -0.5, 0.0,  0.5,  0.5, 0.0,  0.5, // v0-v1-v2-v3 front
      0.5,  1.0,  0.5,  0.5, 0.0,  0.5,  0.5, 0.0, -0.5,  0.5, 1.0, -0.5, // v0-v3-v4-v5 right
      0.5,  1.0,  0.5,  0.5, 1.0, -0.5, -0.5, 1.0, -0.5, -0.5, 1.0,  0.5, // v0-v5-v6-v1 up
      -0.5, 1.0,  0.5, -0.5, 1.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0,  0.5, // v1-v6-v7-v2 left
      -0.5, 0.0, -0.5,  0.5, 0.0, -0.5,  0.5, 0.0,  0.5, -0.5, 0.0,  0.5, // v7-v4-v3-v2 down
      0.5,  0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 1.0, -0.5,  0.5, 1.0, -0.5  // v4-v7-v6-v5 back
    ])

    // Normal
    let normals = new Float32Array([
      0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0, // v0-v1-v2-v3 front
      1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0, // v0-v3-v4-v5 right
      0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0, // v0-v5-v6-v1 up
      -1.0, 0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, // v1-v6-v7-v2 left
      0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0, // v7-v4-v3-v2 down
      0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0  // v4-v7-v6-v5 back
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
  pushMatrix(m) { // Store the specified matrix to the array
    let m2 = new Matrix4(m)
    this.matrixStack.push(m2)
  }

  popMatrix() { // Retrieve the matrix from the array
    return this.matrixStack.pop()
  }

  render() {
    let gl = this.ctx
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Draw a base
    this.modelMatrix.setTranslate(0.0, -12.0, 0.0)
    this.drawBox(10.0, BASE_HEIGHT, 10.0)

    // Arm1
    this.modelMatrix.translate(0.0, BASE_HEIGHT, 0.0)     // Move onto the base
    this.modelMatrix.rotate(this.arm1Angle, 0.0, 1.0, 0.0)  // Rotate around the y-axis
    this.drawBox(3.0, ARM1_LEN, 3.0) // Draw

    // Arm2
    this.modelMatrix.translate(0.0, ARM1_LEN, 0.0)       // Move to joint1
    this.modelMatrix.rotate(this.joint1Angle, 0.0, 0.0, 1.0)  // Rotate around the z-axis
    this.drawBox(4.0, ARM2_LEN, 4.0) // Draw

    // A palm
    this.modelMatrix.translate(0.0, ARM2_LEN, 0.0)       // Move to palm
    this.modelMatrix.rotate(this.joint2Angle, 0.0, 1.0, 0.0)  // Rotate around the y-axis
    this.drawBox(2.0, PALM_LEN, 6.0)  // Draw

    // Move to the center of the tip of the palm
    this.modelMatrix.translate(0.0, PALM_LEN, 0.0)

    // Draw finger1
    this.pushMatrix(this.modelMatrix)
    this.modelMatrix.translate(0.0, 0.0, 2.0)
    this.modelMatrix.rotate(this.joint3Angle, 1.0, 0.0, 0.0)  // Rotate around the x-axis
    this.drawBox(1.0, 2.0, 1.0)
    this.modelMatrix = this.popMatrix()

    // Draw finger2
    this.modelMatrix.translate(0.0, 0.0, -2.0)
    this.modelMatrix.rotate(-this.joint3Angle, 1.0, 0.0, 0.0)  // Rotate around the x-axis
    this.drawBox(1.0, 2.0, 1.0)
  }

  drawBox(width, height, depth) {
    let gl = this.ctx

    this.pushMatrix(this.modelMatrix)   // Save the model matrix
    this.modelMatrix.scale(width, height, depth)
    // Calculate the model view project matrix and pass it to u_MvpMatrix
    this.mvpMatrix.set(this.viewProjMatrix)
    this.mvpMatrix.multiply(this.modelMatrix)
    gl.uniformMatrix4fv(this.u_MvpMatrix, false, this.mvpMatrix.elements)
    // Calculate the normal transformation matrix and pass it to u_NormalMatrix
    this.normalMatrix.setInverseOf(this.modelMatrix)
    this.normalMatrix.transpose()
    gl.uniformMatrix4fv(this.u_NormalMatrix, false, this.normalMatrix.elements)

    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_BYTE, 0)
    this.modelMatrix = this.popMatrix()   // Retrieve the model matrix
  }

}