/**
 * @author Kastor
 *
 * this shader multiplies the texture with a color
 */

THREE.RangeShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    lowerR:  { type: "f", value: 0},
    lowerG:  { type: "f", value: 0},
    lowerB:  { type: "f", value: 0}
    upperR:  { type: "f", value: 1},
    upperG:  { type: "f", value: 1},
    upperB:  { type: "f", value: 1}
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
      "color.x = clamp(color.x, lowerR, upperR);",
      "color.y = clamp(color.y, lowerG, upperG);",
      "color.z = clamp(color.z, lowerB, upperB);",
      "gl_FragColor = color;",
    "}"

  ].join("\n")

};
