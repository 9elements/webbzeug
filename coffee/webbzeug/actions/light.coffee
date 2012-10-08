window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Light = class LightAction extends Webbzeug.Action
  type: 'light'
  availableParameters: ->
    {
      eyeX: { name: 'eye X', type: 'number', min: 0, max: 256, default: 128 },
      eyeY: { name: 'eye Y', type: 'number', min: 0, max: 256, default: 128 }
      eyeZ: { name: 'eye Z', type: 'number', min: 0, max: 256, default: 128 }
      lightX: { name: 'light X', type: 'number', min: 0, max: 256, default: 20 }
      lightY: { name: 'light Y', type: 'number', min: 0, max: 256, default: 20 }
      lightZ: { name: 'light Z', type: 'number', min: 0, max: 256, default: 20 }
    }
  
  magnitude: (x, y, z) ->
    x *= x
    y *= y
    z *= z
    len = x + y + z 
    return Math.sqrt ( len )

  dot: (x1, y1, z1, x2, y2, z2) ->
    return x1 * x2 + y1 * y2 + z1 * z2 

  render: (contexts) ->
    super()
    if contexts.length == 0
      console.log "Dude a light needs an input"
      return

    # How to copy the image data from one context to another
    inputImageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
    normalImageData = contexts[1].getImageData 0, 0, @app.getWidth(), @app.getHeight()
    outputImageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    w = @app.getWidth()
    h = @app.getHeight()

    eyeX = parseInt @getParameter('eyeX')
    eyeY = -1 * parseInt @getParameter('eyeY')
    eyeZ = -1 * parseInt @getParameter('eyeZ')

    lightX = parseInt @getParameter('lightX')
    lightY = -1 * parseInt @getParameter('lightY')
    lightZ = -1 * parseInt @getParameter('lightZ')
    lightLen = @magnitude  lightX , lightY , lightZ  
    eyeLen = @magnitude  eyeX , eyeY , eyeZ 
    lightX /= lightLen
    lightY /= lightLen
    lightZ /= lightLen
    eyeX /= eyeLen
    eyeY /= eyeLen
    eyeZ /= eyeLen
 
    for x in [0...w]
      for y in [0...h]
        rowLen = (w << 2)
        index = (x << 2) + y * rowLen
        normalX = ( normalImageData[index] / 127 ) - 1
        normalY = ( normalImageData[index + 1] / 127 ) - 1 
        normalZ = ( normalImageData[index + 2] / 127 ) - 1
        normalLen = @magnitude normalX, normalY, normalZ 
        normalX /= normalLen  
        normalY /= normalLen  
        normalZ /= normalLen  

        nDotL = @dot normalX, normalY, normalZ, lightX, lightY, lightZ 
        
        reflectionX = ( 2 * normalX * nDotL ) - lightX
        reflectionY = ( 2 * normalY * nDotL ) - lightY
        reflectionZ = ( 2 * normalZ * nDotL ) - lightZ
        reflectionLen = @magnitude  reflectionX, reflectionY, reflectionZ 
        reflectionX /= reflectionLen
        reflectionY /= reflectionLen
        reflectionZ /= reflectionLen

        rDotV = Math.max( 0 , @dot reflectionX, reflectionY, reflectionZ, eyeX, eyeY, eyeZ  ) 
  # float4 fvTotalDiffuse   = fvDiffuse * fNDotL * fvBaseColor;
        totalSpecular  = Math.pow( rDotV, 2 );
        totalSpecular *= 255
        #console.log totalSpecular


        
#   return( saturate( fvTotalAmbient + fvTotalDiffuse + fvTotalSpecular ) );
 
        for i in [0...3]
          outputImageData.data[index + i] = Math.min( inputImageData.data[index + i] + inputImageData.data[index + i] * nDotL , 255 )
        outputImageData.data[index + 3] = 255

    @context.putImageData outputImageData, 0, 0
    return @context

