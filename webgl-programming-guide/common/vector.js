
export class Vector3{

/**
 * Constructor of Vector3
 * If options is specified, new vector is initialized by options.
 * @param options source vector(option)
 */
  constructor(options) {
    let v = new Float32Array(3)
    if (options && typeof options === 'object') {
      v[0] = options[0]; v[1] = options[1]; v[2] = options[2]
    } 
    this.elements = v
  }

  /**
  * Normalize.
  * @return this
  */
  normalize () {
    let v = this.elements
    let c = v[0], d = v[1], e = v[2], g = Math.sqrt(c*c+d*d+e*e)
    if(g){
      if(g == 1)
        return this
    } else {
      v[0] = 0; v[1] = 0; v[2] = 0
      return this
    }
    g = 1/g
    v[0] = c*g; v[1] = d*g; v[2] = e*g
    return this
  }
}

/**
 * Constructor of Vector4
 * If options is specified, new vector is initialized by options.
 * @param options source vector(option)
 */
export class Vector4{
  constructor(options) {
    let v = new Float32Array(4)
    if (options && typeof options === 'object') {
      v[0] = options[0]; v[1] = options[1]; v[2] = options[2]; v[3] = options[3]
    } 
    this.elements = v
  }
}
