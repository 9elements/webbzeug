/**
 * @author Kastor
 *
 * here we haz some shaders to combine
 */

THREE.ContrastBrightnessShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    contrast:  { type: "f", value: 1.0 },
    brightness:  { type: "f", value: 0.0 }
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
    "uniform float contrast;",
    "uniform float brightness;",
    "varying vec2 vUv;",

    "void main() {",
      "vec4 color = texture2D(input1, vUv );",
      "color *= contrast;",
      "color += brightness;",
      "gl_FragColor = clamp(color, 0.0, 1.0);",
    "}"

  ].join("\n")

};
