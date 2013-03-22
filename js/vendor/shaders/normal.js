/**
 * @author Kastor
 *
 * here we haz some shaders to combine
 */

THREE.NormalShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    lightness:  { type: "f", value: 0.5},
    textureSize:  { type: "f", value: 256.0}
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
    "uniform float lightness;",
    "uniform float textureSize;",

    "varying vec2 vUv;",

    "void main() {",
      "float off = 1.0 / textureSize;",
      "vec4 s00 = texture2D(input1, vUv + vec2(-off, -off));",
      "vec4 s01 = texture2D(input1, vUv + vec2( 0.0,   -off));",
      "vec4 s02 = texture2D(input1, vUv + vec2( off, -off));",

      "vec4 s10 = texture2D(input1, vUv + vec2(-off,  0.0));",
      "vec4 s12 = texture2D(input1, vUv + vec2( off,  0.0));",
      "vec4 s20 = texture2D(input1, vUv + vec2(-off,  off));",
      "vec4 s21 = texture2D(input1, vUv + vec2( 0.0,    off));",
      "vec4 s22 = texture2D(input1, vUv + vec2( off,  off));",
      "vec4 color1 = texture2D( input1, vUv );",

      "// Slope in X direction",
      "vec4 sobelX = s00 + 2.0 * s10 + s20 - s02 - 2.0 * s12 - s22;",
      "// Slope in Y direction",
      "vec4 sobelY = s00 + 2.0 * s01 + s02 - s20 - 2.0 * s21 - s22;",

      "// Weight the slope in all channels, we use grayscale as height",
      "vec4 lightnessVector = vec4(lightness);",
      "float sx = dot(sobelX, lightnessVector);",
      "float sy = dot(sobelY, lightnessVector);",

      "// Compose the normal",
      "vec3 normal = normalize(vec3(sx, sy, 1.0));",

      "// Pack [-1, 1] into [0, 1]",
      "gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);",
    "}"

  ].join("\n")

};
