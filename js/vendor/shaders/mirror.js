/**
 * @author Kastor
 *
 * here we haz some shaders to combine
 */

THREE.Mirror = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null }
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
    "varying vec2 vUv;",

    "void main() {",
      "vec2 uv = vUv;",
      "if (uv.x >= 0.5) ",
      "uv.x = 1.0 - uv.x;",
      "gl_FragColor = texture2D(input1, uv ) ;",
    "}"

  ].join("\n")

};
