/**
 * @author Kastor
 *
 * blend shader... blends the 1st and 2nd input acording to the blend map (3rd input)
 */

THREE.BlendShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    input2:  { type: "t", value: 0, texture: null },
    blendMap:  { type: "t", value: 0, texture: null }
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
    "uniform sampler2D input2;",
    "uniform sampler2D blendMap;",
    "varying vec2 vUv;",

    "void main() {",
      "float blend = texture2D(blendMap, vUv ).r;",
      "vec4 color1 = texture2D(input1, vUv );",
      "vec4 color2 = texture2D(input2, vUv );",

      "gl_FragColor = blend * color2 + (1.0 - blend) * color1;",
    "}"

  ].join("\n")

};
