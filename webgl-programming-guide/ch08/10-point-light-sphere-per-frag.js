import Demo from '../common/demo'
import frag from '../shaders/point-light-diffuse-ambient.frag'
import Matrix4 from '../common/matrix4.js'
import vert from '../shaders/point-light-sphere-v2.vert'

export class PointLightSpherePerFrag extends Demo {

  constructor(name) {
    super(name, { vert, frag })

    let gl = this.ctx

    this.initVertexBuffer()

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
    let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')
    let u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor')
    let u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition')
    let u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight')

    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0)
    gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5)
    gl.uniform3f(u_AmbientLight, 0.3, 0.3, 0.3)

    let modelMatrix = new Matrix4()
    let mvpMatrix = new Matrix4()
    let normalMatrix = new Matrix4()

    modelMatrix.setRotate(90, 0, 1, 0)
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

    mvpMatrix.setPerspective(30, this.$canvas.width / this.$canvas.height, 1, 100)
    mvpMatrix.lookAt(0, 0, 6, 0, 0, 0, 0, 1, 0)
    mvpMatrix.multiply(modelMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

    normalMatrix.setInverseOf(modelMatrix)
    normalMatrix.transpose()
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)

    this.render()
  }

  initVertexBuffer() {

    let gl = this.ctx

    let SPHERE_DIV = 13

    let i, ai, si, ci
    let j, aj, sj, cj
    let p1, p2

    let positions = []
    let indices = []

    // Generate coordinates
    for (j = 0;j <= SPHERE_DIV;j++) {
      aj = j * Math.PI / SPHERE_DIV
      sj = Math.sin(aj)
      cj = Math.cos(aj)
      for (i = 0;i <= SPHERE_DIV;i++) {
        ai = i * 2 * Math.PI / SPHERE_DIV
        si = Math.sin(ai)
        ci = Math.cos(ai)

        positions.push(si * sj)  // X
        positions.push(cj)       // Y
        positions.push(ci * sj)  // Z
      }
    }

    for (j = 0;j < SPHERE_DIV;j++) {
      for (i = 0;i < SPHERE_DIV;i++) {
        p1 = j * (SPHERE_DIV + 1) + i
        p2 = p1 + (SPHERE_DIV + 1)

        indices.push(p1)
        indices.push(p2)
        indices.push(p1 + 1)

        indices.push(p1 + 1)
        indices.push(p2)
        indices.push(p2 + 1)
      }
    }

    // let vertices = new Float32Array([
    //   2.0, 2.0, 2.0, -2.0, 2.0, 2.0, -2.0, -2.0, 2.0, 2.0, -2.0, 2.0, // v0-v1-v2-v3 front
    //   2.0, 2.0, 2.0, 2.0, -2.0, 2.0, 2.0, -2.0, -2.0, 2.0, 2.0, -2.0, // v0-v3-v4-v5 right
    //   2.0, 2.0, 2.0, 2.0, 2.0, -2.0, -2.0, 2.0, -2.0, -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
    //   -2.0, 2.0, 2.0, -2.0, 2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, 2.0, // v1-v6-v7-v2 left
    //   -2.0, -2.0, -2.0, 2.0, -2.0, -2.0, 2.0, -2.0, 2.0, -2.0, -2.0, 2.0, // v7-v4-v3-v2 down
    //   2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, 2.0, -2.0, 2.0, 2.0, -2.0  // v4-v7-v6-v5 back
    // ])

    //顶点个数
    this.count = indices.length

    this.initArrayBuffer('a_Position', new Float32Array(positions), 3)
    this.initArrayBuffer('a_Normal', new Float32Array(positions), 3)

    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    let indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

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
    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0)
  }

}