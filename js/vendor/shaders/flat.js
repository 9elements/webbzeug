/**
 * @author Kastor
 *
 * here we haz some shaderZ to combine
 */

THREE.FlatShader = {

  uniforms: {
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

    "varying vec2 vUv;",

    "void main() {",
      "gl_FragColor = vec4(r,g,b,1.0) ;",
    "}"

  ].join("\n")

};
