/**
 * @author Kastor
 *
 * invert shader... inverts the input
 */

THREE.InvertShader = {

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
      "gl_FragColor = 1.0 - texture2D(input1, vUv ) ;",
    "}"

  ].join("\n")

};
