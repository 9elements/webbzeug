/**
 * @author Kastor
 *
 * here we haz some round rect shader
 */

THREE.RoundRectShader = {

  uniforms: {
    frameSharpness:  { type: "f", value: 0.5 },
    x:  { type: "f", value: 0.5 },
    y:  { type: "f", value: 0.5 },
    sizeX:  { type: "f", value: 0.5 },
    sizeY:  { type: "f", value: 0.5 },
    radiusX:  { type: "f", value: 0.5 },
    radiusY:  { type: "f", value: 0.5 }
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform float frameSharpness;",
    "uniform float x;",
    "uniform float y;",
    "uniform float sizeX;",
    "uniform float sizeY;",
    "uniform float radiusX;",
    "uniform float radiusY;",

    "varying vec2 vUv;",

    "void main() {",

      "vec2 pos = vUv;",
      "//pos = pos * 2.0 - 1.0;",

      "//pos.x -= x;",

      "if(pos.x > 0.0 )",
      "{",
          "if(pos.x < sizeX)",
          "{",
          "   pos.x = 0.0; ",
          "}",
          "else",
          "{",
             "pos.x -= sizeX;",
             "pos.x *= radiusX;",
          "}",
       "}",
       "else",
       "{",
          "if(pos.x > -sizeX)",
          "{",
             "pos.x = 0.0;",
          "}",
          "else",
          "{",
             "pos.x += sizeX;",
             "pos.x *= radiusX;",
          "}",
       "}",

       "if(pos.y > 0.0 )",
       "{",
          "if(pos.y < sizeY)",
          "{",
             "pos.y = 0.0;",
          "}",
          "else",
          "{",
             "pos.y -= sizeY;",
             "pos.y *= radiusY;",
          "}",
       "}",
       "else",
       "{",
          "if(pos.y > -sizeY)",
          "{",
             "pos.y = 0.0; ",
          "}",
          "else",
          "{",
             "pos.y += sizeY;",
             "pos.y *= radiusY;",
          "}",
       "}",

       "vec4 color = vec4(1.0 - pow(dot(pos,pos),frameSharpness));",
       "color.x = vUv.x;",
       "gl_FragColor = color;",

    "}"

  ].join("\n")

};
