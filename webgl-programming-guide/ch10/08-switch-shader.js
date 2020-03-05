import Demo from '../common/demo'
import { createProgram } from '../common/webgl-util'
import Matrix4 from '../common/matrix4'

let SOLID_VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  vec3 lightDirection = vec3(0.0, 0.0, 1.0);\n' + // Light direction(World coordinate)
  '  vec4 color = vec4(0.0, 1.0, 1.0, 1.0);\n' +     // Face color
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
  '  v_Color = vec4(color.rgb * nDotL, color.a);\n' +
  '}\n'

// Fragment shader for single color drawing
let SOLID_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n'

// Vertex shader for texture drawing
let TEXTURE_VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'varying float v_NdotL;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  vec3 lightDirection = vec3(0.0, 0.0, 1.0);\n' + // Light direction(World coordinate)
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  v_NdotL = max(dot(normal, lightDirection), 0.0);\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n'

// Fragment shader for texture drawing
let TEXTURE_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'varying float v_NdotL;\n' +
  'void main() {\n' +
  '  vec4 color = texture2D(u_Sampler, v_TexCoord);\n' +
  '  gl_FragColor = vec4(color.rgb * v_NdotL, color.a);\n' +
  '}\n'

let ANGLE_STEP = 30   // The increments of rotation angle (degrees)

export class SwitchShader extends Demo {
  constructor(name) {
    super(name)
    this.setup()
  }

  async setup() {
    let gl = this.ctx
    this.desc = '动态切换shader'

    // Initialize shaders
    this.solidProgram = createProgram(gl, SOLID_VSHADER_SOURCE, SOLID_FSHADER_SOURCE)
    this.texProgram = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE)

    // Get storage locations of attribute and uniform variables in program object for single color drawing
    this.solidProgram.a_Position = gl.getAttribLocation(this.solidProgram, 'a_Position')
    this.solidProgram.a_Normal = gl.getAttribLocation(this.solidProgram, 'a_Normal')
    this.solidProgram.u_MvpMatrix = gl.getUniformLocation(this.solidProgram, 'u_MvpMatrix')
    this.solidProgram.u_NormalMatrix = gl.getUniformLocation(this.solidProgram, 'u_NormalMatrix')


    // Get storage locations of attribute and uniform variables in program object for texture drawing
    this.texProgram.a_Position = gl.getAttribLocation(this.texProgram, 'a_Position')
    this.texProgram.a_Normal = gl.getAttribLocation(this.texProgram, 'a_Normal')
    this.texProgram.a_TexCoord = gl.getAttribLocation(this.texProgram, 'a_TexCoord')
    this.texProgram.u_MvpMatrix = gl.getUniformLocation(this.texProgram, 'u_MvpMatrix')
    this.texProgram.u_NormalMatrix = gl.getUniformLocation(this.texProgram, 'u_NormalMatrix')
    this.texProgram.u_Sampler = gl.getUniformLocation(this.texProgram, 'u_Sampler')


    this.cube = this.initVertexBuffers()

    this.texture = await this.initTextures()

    this.modelMatrix = new Matrix4()
    this.mvpMatrix = new Matrix4()
    this.normalMatrix = new Matrix4()


    // Set the clear color and enable the depth test
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)


    // Calculate the view projection matrix
    this.viewProjMatrix = new Matrix4()
    this.viewProjMatrix.setPerspective(30.0, this.$canvas.width / this.$canvas.height, 1.0, 100.0)
    this.viewProjMatrix.lookAt(0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)

    this.currentAngle = 0.0 // Current rotation angle (degrees)
    this.lastTime = Date.now()

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

  async initTextures() {
    let gl = this.ctx
    let texture = gl.createTexture()   // Create a texture object

    let image = await this.loadImage('../images/orange.jpg')  // Create a image object

    // Write the image data to texture object
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)  // Flip the image Y coordinate
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    // Pass the texure unit 0 to u_Sampler
    gl.useProgram(this.texProgram)
    gl.uniform1i(this.texProgram.u_Sampler, 0)

    gl.bindTexture(gl.TEXTURE_2D, null) // Unbind texture

    return texture
  }

  initVertexBuffers() {
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
      1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0, -1.0, 1.0,   1.0, -1.0, 1.0,    // v0-v1-v2-v3 front
      1.0, 1.0, 1.0,   1.0, -1.0, 1.0,   1.0, -1.0, -1.0,   1.0, 1.0, -1.0,    // v0-v3-v4-v5 right
      1.0, 1.0, 1.0,   1.0, 1.0, -1.0,  -1.0, 1.0, -1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,  -1.0, 1.0, -1.0,  -1.0, -1.0, -1.0,  -1.0, -1.0, 1.0,    // v1-v6-v7-v2 left
      -1.0, -1.0, -1.0,   1.0, -1.0, -1.0,   1.0, -1.0, 1.0,  -1.0, -1.0, 1.0,    // v7-v4-v3-v2 down
      1.0, -1.0, -1.0,  -1.0, -1.0, -1.0,  -1.0, 1.0, -1.0,   1.0, 1.0, -1.0     // v4-v7-v6-v5 back
    ])

    let normals = new Float32Array([   // Normal
      0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,     // v0-v1-v2-v3 front
      1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
      0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
      -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,     // v1-v6-v7-v2 left
      0.0, -1.0, 0.0,   0.0, -1.0, 0.0,   0.0, -1.0, 0.0,   0.0, -1.0, 0.0,     // v7-v4-v3-v2 down
      0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   0.0, 0.0, -1.0      // v4-v7-v6-v5 back
    ])

    let texCoords = new Float32Array([   // Texture coordinates
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
      0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
      1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
    ])

    let indices = new Uint8Array([        // Indices of the vertices
      0, 1, 2,   0, 2, 3,    // front
      4, 5, 6,   4, 6, 7,    // right
      8, 9, 10,   8, 10, 11,    // up
      12, 13, 14,  12, 14, 15,    // left
      16, 17, 18,  16, 18, 19,    // down
      20, 21, 22,  20, 22, 23     // back
    ])

    let o = {} // Utilize Object to to return multiple buffer objects together

    // Write vertex information to buffer object
    o.vertexBuffer = this.initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT)
    o.normalBuffer = this.initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT)
    o.texCoordBuffer = this.initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT)
    o.indexBuffer = this.initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE)
    if (!o.vertexBuffer || !o.normalBuffer || !o.texCoordBuffer || !o.indexBuffer) {
      return null
    }

    o.numIndices = indices.length

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    return o
  }

  initElementArrayBufferForLaterUse(gl, data, type) {
    let buffer = gl.createBuffer()  // Create a buffer object
    if (!buffer) {
      console.log('Failed to create the buffer object')
      return null
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)

    buffer.type = type

    return buffer
  }

  initArrayBufferForLaterUse(gl, data, num, type) {
    let buffer = gl.createBuffer()   // Create a buffer object
    if (!buffer) {
      console.log('Failed to create the buffer object')
      return null
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    // Keep the information necessary to assign to the attribute variable later
    buffer.num = num
    buffer.type = type

    return buffer
  }

  initAttributeVariable(gl, a_attribute, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0)
    gl.enableVertexAttribArray(a_attribute)
  }
  render() {
    let gl = this.ctx
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    this.drawSolidCube()
    this.drawTexCube()
  }

  drawSolidCube() {
    let gl = this.ctx
    let program = this.solidProgram
    gl.useProgram(program)   // Tell that this program object is used

    // Assign the buffer objects and enable the assignment
    this.initAttributeVariable(gl, program.a_Position, this.cube.vertexBuffer) // Vertex coordinates
    this.initAttributeVariable(gl, program.a_Normal, this.cube.normalBuffer)   // Normal
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cube.indexBuffer)  // Bind indices

    this.drawCube(program, this.cube, -2.0)   // Draw
  }

  drawTexCube() {

    let gl = this.ctx
    let program = this.texProgram

    gl.useProgram(program)   // Tell that this program object is used

    // Assign the buffer objects and enable the assignment
    this.initAttributeVariable(gl, program.a_Position, this.cube.vertexBuffer)  // Vertex coordinates
    this.initAttributeVariable(gl, program.a_Normal, this.cube.normalBuffer)    // Normal
    this.initAttributeVariable(gl, program.a_TexCoord, this.cube.texCoordBuffer)// Texture coordinates
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cube.indexBuffer) // Bind indices

    // Bind texture object to texture unit 0
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)

    this.drawCube(program, this.cube, 2.0) // Draw
  }


  drawCube(program, o, x) {
    let gl = this.ctx
    // Calculate a model matrix
    this.modelMatrix.setTranslate(x, 0.0, 0.0)
    this.modelMatrix.rotate(20.0, 1.0, 0.0, 0.0)
    this.modelMatrix.rotate(this.currentAngle, 0.0, 1.0, 0.0)

    // Calculate transformation matrix for normals and pass it to u_NormalMatrix
    this.normalMatrix.setInverseOf(this.modelMatrix)
    this.normalMatrix.transpose()
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, this.normalMatrix.elements)

    // Calculate model view projection matrix and pass it to u_MvpMatrix
    this.mvpMatrix.set(this.viewProjMatrix)
    this.mvpMatrix.multiply(this.modelMatrix)
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, this.mvpMatrix.elements)

    gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0)   // Draw
  }

}