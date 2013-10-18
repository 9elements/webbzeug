/**
 * @author Kastor
 *
 * move shader moves the texture in x and y direction
 */

THREE.MoveShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    x:  { type: "f", value: 0.0 },
    y:  { type: "f", value: 0.0 }
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
    "uniform float x;",
    "uniform float y;",
    "varying vec2 vUv;",

    "void main() {",
      "vec2 uv = vUv;",
      "uv.x += x;",
      "uv.y += y;",
      "gl_FragColor = texture2D(input1, uv ) ;",
    "}"

  ].join("\n")

};
