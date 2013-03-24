/**
 * @author Kastor
 *
 * here we haz some round rect shader
 */

THREE.RectangleShader = {

  uniforms: {
    x:  { type: "f", value: 0.5 },
    y:  { type: "f", value: 0.5 },
    width:  { type: "f", value: 0.5 },
    height:  { type: "f", value: 0.5 },
    r:  { type: "f", value: 1.0 },
    g:  { type: "f", value: 1.0 },
    b:  { type: "f", value: 1.0 },
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
    "uniform float x;",
    "uniform float y;",
    "uniform float width;",
    "uniform float height;",
    "uniform float r;",
    "uniform float g;",
    "uniform float b;",
    "varying vec2 vUv;",
    "uniform sampler2D input1;",

    "void main() {",

      "gl_FragColor = texture2D(input1, vUv ) ;",
      "vec2 pos = vUv;",
      "pos.y = 1.0 - pos.y;",
      "float right = x + width;",
      "float bottom = y + height;",
      "if ((pos.x >= x) && (pos.y >= y) && (pos.x <= right) && (pos.y <= bottom) )",
      "{",
      "  gl_FragColor = vec4(r,g,b,1.0);",
      "}",
    "}"

  ].join("\n")

};
