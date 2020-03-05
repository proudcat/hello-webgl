
/**
 * 加载shader
 * @param {WebGLRenderingContext} gl webgl render context
 * @param {gl.VERTEX_SHADER|gl.VERTEX_SHADER} type vertext or fragment shader
 * @param {String} source source text of the shader
 * @returns {WebGLShader} compiled shader
 */
export function loadShader(gl, type, source) {

  let shader = gl.createShader(type)
  if (shader === null) {
    console.log('unable to create shader')
    return null
  }

  gl.shaderSource(shader, source)

  gl.compileShader(shader)

  let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    let error = gl.getShaderInfoLog(shader)
    console.log('Failed to compile shader: ' + error)
    gl.deleteShader(shader)
    return null
  }

  return shader
}

/**
 * 创建 WebGLProgram
 * @param {WebGLRenderingContext} gl webgl render context
 * @param {String} vshader source text of the shader
 * @param{String} fshader source text of the shader
 * @returns {WebGLProgram} webgl program
 */
export function createProgram(gl, vshader, fshader) {

  let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader)
  let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader)
  if (!vertexShader || !fragmentShader) {
    return null
  }

  let program = gl.createProgram()
  if (!program) {
    return null
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)

  let linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    let error = gl.getProgramInfoLog(program)
    console.log('Failed to link program: ' + error)
    gl.deleteProgram(program)
    gl.deleteShader(fragmentShader)
    gl.deleteShader(vertexShader)
    return null
  }
  return program
}


/**
 * 初始化shader
 * @param {WebGLRenderingContext} gl webgl render context
 * @param {String} vshader source text of the shader
 * @param{String} fshader source text of the shader
 * @returns {Boolean} success or failed
 */
export function initShader(gl, vshader, fshader) {
  let program = createProgram(gl, vshader, fshader)
  if (!program) {
    console.log('Failed to create program')
    return false
  }

  gl.useProgram(program)
  gl.program = program

  return true
}
