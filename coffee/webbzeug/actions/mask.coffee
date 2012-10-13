window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Mask = class MaskAction extends Webbzeug.Action
  type: 'processive'
  name: 'Mask'
  availableParameters: -> {}

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 3
      warnings.push 'Mask will only use the first 3 inputs.'
    if contexts.length < 3
      errors.push 'Mask needs exactly 3 inputs.'
    
    return { warnings: warnings }

  render: (contexts) ->
    super()
    if contexts.length isnt 3
      console.log "Dude a mask needs three inputs"
      return false

    maskData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
    imgA = contexts[1].getImageData 0, 0, @app.getWidth(), @app.getHeight()
    imgB = contexts[2].getImageData 0, 0, @app.getWidth(), @app.getHeight()

    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    imageData[0] = 255

    for i in [0...imageData.data.length / 4]
      index = i << 2

      avg = Math.floor((maskData.data[index] + maskData.data[index + 1] + maskData.data[index + 2]) / 3)

      rd = imgB.data[index] - imgA.data[index]
      gd = imgB.data[index + 1] - imgA.data[index + 1]
      bd = imgB.data[index + 2] - imgA.data[index + 2]

      imageData.data[index] = imgA.data[index] + (rd * (avg / 255))
      imageData.data[index + 1] = imgA.data[index + 1] + (gd * (avg / 255))
      imageData.data[index + 2] = imgA.data[index + 2] + (bd * (avg / 255))

      imageData.data[index + 3] = 255

    @context.putImageData imageData, 0, 0
    return @context
