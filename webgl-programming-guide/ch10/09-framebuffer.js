import Demo from '../common/demo'
import Matrix4 from '../common/matrix4'

let vert =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n'

// Fragment shader program
let frag =
  'precision mediump float;\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '}\n'

let ANGLE_STEP = 30   // The increments of rotation angle (degrees)

let OFFSCREEN_WIDTH = 256
let OFFSCREEN_HEIGHT = 256

export class FrameBuffer extends Demo {
  constructor(name) {
    super(name, { vert, frag })
    // this.resize(300, 300)
    this.setup()
  }

  async setup() {
    let gl = this.ctx

    let program = gl.program

    program.a_Position = gl.getAttribLocation(program, 'a_Position')
    program.a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord')
    program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')


    // Set the vertex information
    this.cube = this.initVertexBuffersForCube()
    this.plane = this.initVertexBuffersForPlane()

    this.texture = await this.initTextures()
    this.fbo = this.initFramebufferObject()


    // Enable depth test
    gl.enable(gl.DEPTH_TEST)
    //  gl.enable(gl.CULL_FACE);


    this.viewProjMatrix = new Matrix4()   // Prepare view projection matrix for color buffer
    this.viewProjMatrix.setPerspective(30, this.$canvas.width / this.$canvas.height, 1.0, 100.0)
    this.viewProjMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)

    this.viewProjMatrixFBO = new Matrix4()   // Prepare view projection matrix for FBO
    this.viewProjMatrixFBO.setPerspective(30.0, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1.0, 100.0)
    this.viewProjMatrixFBO.lookAt(0.0, 2.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)

    this.modelMatrix = new Matrix4()
    this.mvpMatrix = new Matrix4()


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

    // draw(gl, canvas, fbo, plane, cube, currentAngle, texture, viewProjMatrix, viewProjMatrixFBO);

    this.render()
    requestAnimationFrame(() => this.update())
  }

  initVertexBuffersForCube() {
    let gl = this.ctx

    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3

    // Vertex coordinates
    let vertices = new Float32Array([
      1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0, -1.0, 1.0,   1.0, -1.0, 1.0,    // v0-v1-v2-v3 front
      1.0, 1.0, 1.0,   1.0, -1.0, 1.0,   1.0, -1.0, -1.0,   1.0, 1.0, -1.0,    // v0-v3-v4-v5 right
      1.0, 1.0, 1.0,   1.0, 1.0, -1.0,  -1.0, 1.0, -1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,  -1.0, 1.0, -1.0,  -1.0, -1.0, -1.0,  -1.0, -1.0, 1.0,    // v1-v6-v7-v2 left
      -1.0, -1.0, -1.0,   1.0, -1.0, -1.0,   1.0, -1.0, 1.0,  -1.0, -1.0, 1.0,    // v7-v4-v3-v2 down
      1.0, -1.0, -1.0,  -1.0, -1.0, -1.0,  -1.0, 1.0, -1.0,   1.0, 1.0, -1.0     // v4-v7-v6-v5 back
    ])

    // Texture coordinates
    let texCoords = new Float32Array([
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
      0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
      1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
      1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
      0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
    ])

    // Indices of the vertices
    let indices = new Uint8Array([
      0, 1, 2,   0, 2, 3,    // front
      4, 5, 6,   4, 6, 7,    // right
      8, 9, 10,   8, 10, 11,    // up
      12, 13, 14,  12, 14, 15,    // left
      16, 17, 18,  16, 18, 19,    // down
      20, 21, 22,  20, 22, 23     // back
    ])

    let o = {}  // Create the "Object" object to return multiple objects.

    // Write vertex information to buffer object
    o.vertexBuffer = this.initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT)
    o.texCoordBuffer = this.initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT)
    o.indexBuffer = this.initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE)

    o.numIndices = indices.length

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    return o
  }

  initVertexBuffersForPlane() {

    let gl = this.ctx

    // Create face
    //  v1------v0
    //  |        |
    //  |        |
    //  |        |
    //  v2------v3

    // Vertex coordinates
    let vertices = new Float32Array([
      1.0, 1.0, 0.0,  -1.0, 1.0, 0.0,  -1.0, -1.0, 0.0,   1.0, -1.0, 0.0    // v0-v1-v2-v3
    ])

    // Texture coordinates
    let texCoords = new Float32Array([1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0])

    // Indices of the vertices
    let indices = new Uint8Array([0, 1, 2,   0, 2, 3])

    let o = {} // Create the "Object" object to return multiple objects.

    // Write vertex information to buffer object
    o.vertexBuffer = this.initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT)
    o.texCoordBuffer = this.initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT)
    o.indexBuffer = this.initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE)

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


  async initTextures() {
    let gl = this.ctx
    let texture = gl.createTexture()   // Create a texture object
    let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler')

    let image = await this.loadImage('../images/sky_cloud.jpg')  // Create a image object

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)  // Flip the image Y coordinate
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    // Pass the texure unit 0 to u_Sampler
    gl.uniform1i(u_Sampler, 0)

    gl.bindTexture(gl.TEXTURE_2D, null) // Unbind the texture object

    return texture
  }

  initFramebufferObject() {
    let gl = this.ctx
    let framebuffer, texture, depthBuffer

    // Define the error handling function
    let error = function() {
      if (framebuffer) {
        gl.deleteFramebuffer(framebuffer)
      }
      if (texture) {
        gl.deleteTexture(texture)
      }
      if (depthBuffer) {
        gl.deleteRenderbuffer(depthBuffer)
      }
      return null
    }

    // Create a frame buffer object (FBO)
    framebuffer = gl.createFramebuffer()

    // Create a texture object and set its size and parameters
    texture = gl.createTexture() // Create a texture object

    gl.bindTexture(gl.TEXTURE_2D, texture) // Bind the object to target
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    framebuffer.texture = texture

    // Create a renderbuffer object and Set its size and parameters
    depthBuffer = gl.createRenderbuffer() // Create a renderbuffer object
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer) // Bind the object to target
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT)

    // Attach the texture and the renderbuffer object to the FBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer)

    // Check if FBO is configured correctly
    let e = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
      console.log('Frame buffer object is incomplete: ' + e.toString())
      return error()
    }

    // Unbind the buffer object
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)

    return framebuffer
  }

  render() {
    let gl = this.ctx

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo)              // Change the drawing destination to FBO
    gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT) // Set a viewport for FBO

    gl.clearColor(0.2, 0.2, 0.4, 1.0) // Set clear color (the color is slightly changed)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)  // Clear FBO

    this.drawTexturedCube()   // Draw the cube

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)        // Change the drawing destination to color buffer
    gl.viewport(0, 0, this.$canvas.width, this.$canvas.height)  // Set the size of viewport back to that of <canvas>
    // gl.viewport(0, 0, 400, 400)  // Set the size of viewport back to that of <canvas>

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // Clear the color buffer

    this.drawTexturedPlane()  // Draw the plane
  }

  drawTexturedCube() {
    let gl = this.ctx

    this.modelMatrix.setRotate(20.0, 1.0, 0.0, 0.0)
    this.modelMatrix.rotate(this.currentAngle, 0.0, 1.0, 0.0)

    this.mvpMatrix.set(this.viewProjMatrixFBO)
    this.mvpMatrix.multiply(this.modelMatrix)
    gl.uniformMatrix4fv(gl.program.u_MvpMatrix, false, this.mvpMatrix.elements)

    this.drawTexturedObject(this.cube, this.texture)
  }

  drawTexturedPlane() {

    let gl = this.ctx

    this.modelMatrix.setTranslate(0, 0, 1)
    this.modelMatrix.rotate(20.0, 1.0, 0.0, 0.0)
    this.modelMatrix.rotate(this.currentAngle, 0.0, 1.0, 0.0)

    // Calculate the model view project matrix and pass it to u_MvpMatrix
    this.mvpMatrix.set(this.viewProjMatrix)
    this.mvpMatrix.multiply(this.modelMatrix)
    gl.uniformMatrix4fv(gl.program.u_MvpMatrix, false, this.mvpMatrix.elements)

    this.drawTexturedObject(this.plane, this.fbo.texture)
  }

  drawTexturedObject(o, texture) {

    let gl = this.ctx

    this.initAttributeVariable(gl, gl.program.a_Position, o.vertexBuffer)    // Vertex coordinates
    this.initAttributeVariable(gl, gl.program.a_TexCoord, o.texCoordBuffer)  // Texture coordinates

    // Bind the texture object to the target
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Draw
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer)
    gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0)
  }

  initAttributeVariable(gl, a_attribute, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0)
    gl.enableVertexAttribArray(a_attribute)
  }

}