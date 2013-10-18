/**
 * @author Kastor
 *
 * here we haz some shaders to combine
 */

THREE.DistortShader = {

  uniforms: {
    baseMap:  { type: "t", value: 0, texture: null },
    distMap:  { type: "t", value: 0, texture: null },
    amount:  { type: "f", value: 0 },
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D baseMap;",
    "uniform sampler2D distMap;",
    "uniform float amount;",

    "varying vec2 vUv;",

    "void main() {",

      "vec4 distorion = texture2D(distMap, vUv );",
      "vec2 tex = vUv;",
      "tex.x -= amount * ((2.0 * distorion.y) - 1.0);",
      "tex.y += amount * ((2.0 * distorion.z) - 1.0);",

      "// Pack [-1, 1] into [0, 1]",
      "//gl_FragColor = texture2D(baseMap, tex );",
      "gl_FragColor = texture2D(baseMap, tex );",
    "}"

  ].join("\n")

};
