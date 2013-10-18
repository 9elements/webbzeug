/**
 * @author Kastor
 *
 * here we haz some shaders to contrast saturation
** Contrast, saturation, brightness
** Code of this function is from TGM's shader pack
** http://irrlicht.sourceforge.net/phpBB2/viewtopic.php?t=21057

*/

THREE.CSBShader = {

  uniforms: {
    input1:  { type: "t", value: 0, texture: null },
    contrast:  { type: "f", value: 1.0 },
    brightness:  { type: "f", value: 1.0 },
    saturation: { type: "f", value: 1.0}
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [
    "// For all settings: 1.0 = 100% 0.5=50% 1.5 = 150%",
    "uniform sampler2D input1;",
    "uniform float contrast;",
    "uniform float brightness;",
    "uniform float saturation;",
    "varying vec2 vUv;",

    "void main() {",
      "float AvgLumR = 0.5;",
      "float AvgLumG = 0.5;",
      "float AvgLumB = 0.5;",

      "vec3 LumCoeff = vec3(0.2125, 0.7154, 0.0721);",
      "vec4 color = texture2D(input1, vUv );",
      "vec3 color3 = vec3(color.x, color.y, color.z);",
      "vec3 AvgLumin = vec3(AvgLumR, AvgLumG, AvgLumB);",
      "vec3 brtColor = color3 * brightness;",
      "float intensityf = dot(brtColor, LumCoeff);",
      "vec3 intensity = vec3(intensityf, intensityf, intensityf);",
      "vec3 satColor = mix(intensity, brtColor, saturation);",
      "vec3 conColor = mix(AvgLumin, satColor, contrast);",
      "gl_FragColor = vec4(vUv.x,vUv.y,0.0, 1.0);",
    "}"

  ].join("\n")

};
