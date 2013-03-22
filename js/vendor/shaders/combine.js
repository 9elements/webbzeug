/**
 * @author Kastor
 *
 * here we haz some shaders to combine
 */

THREE.SubShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    input2:  { type: "t", value: 0, texture: null }
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D input1;",
    "uniform sampler2D input2;",

    "varying vec2 vUv;",

    "void main() {",
      "vec4 color1 = texture2D( input1, vUv );",
      "vec4 color2 = texture2D( input2, vUv );",
      "vec4 color = clamp(color1 - color2, 0.0, 1.0) ;",
      "gl_FragColor = color;",
    "}"

  ].join("\n")

};
THREE.AddShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    input2:  { type: "t", value: 0, texture: null }
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D input1;",
    "uniform sampler2D input2;",

    "varying vec2 vUv;",

    "void main() {",
      "vec4 color1 = texture2D( input1, vUv );",
      "vec4 color2 = texture2D( input2, vUv );",
      "vec4 color = clamp(color1 + color2, 0.0, 1.0) ;",
      "gl_FragColor = color;",
    "}"

  ].join("\n")

};

THREE.MulShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    input2:  { type: "t", value: 0, texture: null }
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D input1;",
    "uniform sampler2D input2;",

    "varying vec2 vUv;",

    "void main() {",
      "vec4 color1 = texture2D( input1, vUv );",
      "vec4 color2 = texture2D( input2, vUv );",
      "vec4 color = clamp(color1 * color2, 0.0, 1.0) ;",
      "gl_FragColor = color;",
    "}"

  ].join("\n")

};

THREE.DivShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    input2:  { type: "t", value: 0, texture: null }
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D input1;",
    "uniform sampler2D input2;",

    "varying vec2 vUv;",

    "void main() {",
      "vec4 color1 = texture2D( input1, vUv );",
      "vec4 color2 = texture2D( input2, vUv );",
      "vec4 color = clamp(color1 / color2, 0.0, 1.0) ;",
      "gl_FragColor = color;",
    "}"

  ].join("\n")

};

THREE.LightenShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    input2:  { type: "t", value: 0, texture: null }
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D input1;",
    "uniform sampler2D input2;",

    "varying vec2 vUv;",

    "void main() {",
      "vec4 color1 = texture2D( input1, vUv );",
      "vec4 color2 = texture2D( input2, vUv );",
      "vec4 color = max(color1 , color2) ;",
      "gl_FragColor = color;",
    "}"

  ].join("\n")

};

THREE.DarkenShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    input2:  { type: "t", value: 0, texture: null }
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D input1;",
    "uniform sampler2D input2;",

    "varying vec2 vUv;",

    "void main() {",
      "vec4 color1 = texture2D( input1, vUv );",
      "vec4 color2 = texture2D( input2, vUv );",
      "vec4 color = min(color1 , color2) ;",
      "gl_FragColor = color;",
    "}"

  ].join("\n")

};