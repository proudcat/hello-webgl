import Demo from '../common/demo'
import vert from '../shaders/a_pos_av_texcoord.vs'
import frag from '../shaders/u_sampler_v_texcoord.fs'

export class TextureQuad extends Demo{

  constructor(name){
    super(name,{vert,frag})
    // this.resize(800,800)
    this.setup()
  }

  async setup(){
    let gl = this.ctx

    let vertices = new Float32Array([
      // Vertex coordinates, texture coordinate
      -0.5, 0.5, 0.0, 1.0,
      -0.5, -0.5, 0.0, 0.0,
      0.5, 0.5, 1.0, 1.0,
      0.5, -0.5, 1.0, 0.0,
    ])

    //定点个数
    this.count = 4

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    let FSIZE = vertices.BYTES_PER_ELEMENT

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)
    gl.enableVertexAttribArray(a_Position)

    let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord')
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
    gl.enableVertexAttribArray(a_TexCoord)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    let texture = gl.createTexture()
    let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler')
    let image = await this.loadImage('../images/sky.jpg')


    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)

    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0)

    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler, 0)

    this.render()
  }

  render() {
    let gl = this.ctx

    gl.clear(gl.COLOR_BUFFER_BIT) 
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.count) 
  }

}