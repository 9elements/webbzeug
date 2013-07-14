/**
 * @author Kastor
 *
 * here we haz some shaders to combine
 */

THREE.MirrorShader = {

  uniforms: {
    mode:  { type: "f", value: 0.0 },
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
    "uniform float mode;",
    "uniform sampler2D input1;",
    "varying vec2 vUv;",

    "void main() {",
      "vec2 uv = vUv;",
      "if (mode == 0.0) {",
      " if (uv.x >= 0.5) {",
      "   uv.x = 1.0 - uv.x;",
      " }",
      "}",
      "else {",
      " if(uv.y <= 0.5) {",
      "   uv.y = 1.0- uv.y;",
      " }",
      "}",
      "gl_FragColor = texture2D(input1, uv ) ;",
    "}"

  ].join("\n")

};
