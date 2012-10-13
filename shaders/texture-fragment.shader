// precision mediump float;

// // our texture
// uniform sampler2D u_image;
// uniform vec2 u_textureSize;
// uniform float u_kernel[9];

// // the texCoords passed in from the vertex shader.
// varying vec2 v_texCoord;

// void main() {
//    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
//    vec4 colorSum =
//      texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
//      texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
//      texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
//      texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
//      texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
//      texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
//      texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
//      texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
//      texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
//    float kernelWeight =
//      u_kernel[0] +
//      u_kernel[1] +
//      u_kernel[2] +
//      u_kernel[3] +
//      u_kernel[4] +
//      u_kernel[5] +
//      u_kernel[6] +
//      u_kernel[7] +
//      u_kernel[8] ;

//    if (kernelWeight <= 0.0) {
//      kernelWeight = 1.0;
//    }

//    // Divide the sum by the weight but just use rgb
//    // we'll set alpha to 1.0
//    gl_FragColor = vec4((colorSum / kernelWeight).rgb, 1.0);
// }

void main() {
  gl_FragColor = vec4(0,1,0,1);  // green
}