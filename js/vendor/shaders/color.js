/**
 * @author Kastor
 *
 * this shader multiplies the texture with a color
 */

THREE.ColorShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    r:  { type: "f", value: 0},
    g:  { type: "f", value: 0},
    b:  { type: "f", value: 0}
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform float r;",
    "uniform float g;",
    "uniform float b;",

    "uniform sampler2D input1;",
    "varying vec2 vUv;",

    "void main() {",
      "vec4 color = texture2D(input1, vUv ) ;",
      "color.x *= r;",
      "color.y *= g;",
      "color.z *= b;",
      "gl_FragColor = color;",
    "}"

  ].join("\n")

};
