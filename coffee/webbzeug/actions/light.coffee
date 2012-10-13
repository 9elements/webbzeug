window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Light = class LightAction extends Webbzeug.Action
  type: 'processive'
  name: 'Light'
  availableParameters: ->
    {
      eyeX: { name: 'Eye X', type: 'number', min: -1, max: 1, default: 0.5, step: 0.001 },
      eyeY: { name: 'Eye Y', type: 'number', min: -1, max: 1, default: 0.5, step: 0.001 }
      eyeZ: { name: 'Eye Z', type: 'number', min: -1, max: 1, default: 0.5, step: 0.001 }
      lightX: { name: 'Light X', type: 'number', min: -1, max: 1, default: 0.5, step: 0.001 }
      lightY: { name: 'Light Y', type: 'number', min: -1, max: 1, default: 0.5, step: 0.001 }
      lightZ: { name: 'Light Z', type: 'number', min: -1, max: 1, default: 0.5, step: 0.001 }
      power: { name: 'Power', type: 'number', min: 0.1, max: 100, default: 20 },
      diffuseColor: { name: 'Diffuse', type: 'color', default: '#000000' },
      reflectionColor: { name: 'Reflection', type: 'color', default: '#000000' }
    }
  
  magnitude: (x, y, z) ->
    x *= x
    y *= y
    z *= z
    len = x + y + z 
    return Math.sqrt ( len )

  normalize: (v) ->
    mag = @magnitude(v.x, v.y, v.z)
    return {
      x: v.x / mag,
      y: v.y / mag,
      z: v.z / mag
    }

  dot: (v1, v2) ->
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length < 2
      errors.push 'Light needs exactly 2 inputs.'
    if contexts.length > 2
      warnings.push 'Light will only use the first 2 inputs.'

    return { errors: errors, warnings: warnings }

  render: (contexts) ->
    super()
    if contexts.length == 0
      console.log "Dude a light needs an input"
      return

    diffuseRGB = Webbzeug.Utilities.getRgb2 @getParameter('diffuseColor')
    diffuseRGB = 
      r: diffuseRGB[0]
      g: diffuseRGB[1]
      b: diffuseRGB[2]
    reflectionRGB = Webbzeug.Utilities.getRgb2 @getParameter('reflectionColor')
    reflectionRGB = 
      r: reflectionRGB[0]
      g: reflectionRGB[1]
      b: reflectionRGB[2]

    # How to copy the image data from one context to another
    inputImageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
    normalImageData = contexts[1].getImageData 0, 0, @app.getWidth(), @app.getHeight()
    outputImageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    w = @app.getWidth()
    h = @app.getHeight()

    power = parseInt(@getParameter('power')) / 100

    normal = 
      x: 0
      y: 0
      z: 1

    binormal =
      x: 0
      y: -1
      z: 0

    tangent = 
      x: -1
      y: 0
      z: 0    

    #console.log eyeX, eyeY, eyeZ, lightX, lightY, lightZ
    uinc = 2 / w
    vinc = 2 / h
    u = -1
    v = -1
    for x in [0...w]
      for y in [0...h]
        rowLen = (w << 2)
        index = (x << 2) + y * rowLen
        
        light = 
          x: parseFloat(@getParameter('lightX')) - u
          y: parseFloat(@getParameter('lightY')) - v
          z: parseFloat(@getParameter('lightZ'))

        view = 
          x: parseFloat(@getParameter('eyeX')) - u
          y: parseFloat(@getParameter('eyeY')) - v
          z: parseFloat(@getParameter('eyeZ'))

        lightDirection = @normalize
          x: @dot(tangent, light)
          y: @dot(binormal, light)
          z: @dot(normal, light)

        viewDirection = @normalize
          x: @dot(tangent, view)
          y: @dot(binormal, view)
          z: @dot(normal, view)

        pixel = @normalize
          x: (normalImageData.data[index] / 127) - 1
          y: (normalImageData.data[index + 1] / 127) - 1
          z: (normalImageData.data[index + 2] / 127) - 1

        NDotL = @dot pixel, lightDirection

        reflection = @normalize
          x: ((pixel.x * 2) * NDotL) - lightDirection.x
          y: ((pixel.y * 2) * NDotL) - lightDirection.y
          z: ((pixel.z * 2) * NDotL) - lightDirection.z

        RDotV = Math.max 0, @dot(reflection, viewDirection)

        baseColor =
          r: inputImageData.data[index] / 255
          g: inputImageData.data[index + 1] / 255
          b: inputImageData.data[index + 2] / 255

        diffuseColor = 
          r: NDotL * baseColor.r * diffuseRGB.r / 255
          g: NDotL * baseColor.g * diffuseRGB.g / 255
          b: NDotL * baseColor.b * diffuseRGB.b / 255

        specularColor = Math.pow RDotV, power

        outputImageData.data[index] = Math.max 0, Math.min( (0.5 * baseColor.r + diffuseColor.r + specularColor * reflectionRGB.r / 255) * 255, 255)
        outputImageData.data[index + 1] = Math.max 0, Math.min( (0.5 * baseColor.g + diffuseColor.g + specularColor * reflectionRGB.g / 255) * 255, 255)
        outputImageData.data[index + 2] = Math.max 0, Math.min( (0.5 * baseColor.b + diffuseColor.b + specularColor * reflectionRGB.b / 255) * 255, 255)
        outputImageData.data[index + 3] = 255

        v += vinc
      v = 0
      u += uinc


    @context.putImageData outputImageData, 0, 0
    return @context