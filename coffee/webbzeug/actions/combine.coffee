window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Combine = class CombineAction extends Webbzeug.Action
  availableParameters: ->
    {
      type: { name: 'Type', type: 'enum', values: { multiply: 'Multiply', addition: 'Addition' }, default: 'addition' }
    }

  render: (contexts) ->
    super()

    if contexts.length < 2
      console.log 'A combine needs at least 2 inputs!'
      return false

    # Take first image, draw it to the action context
    imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
    @context.putImageData imageData, 0, 0

    # Go though all other contexts and apply blend mode
    for i in [1...contexts.length]
      applyingContext = contexts[i]

      switch @getParameter('type')
        when 'multiply'
          @multiply applyingContext
        when 'addition'
          @addition applyingContext

    return @context

  # Multiplication
  multiply: (applyingContext) ->
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    applyingImageData = applyingContext.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    for i in [0...applyingImageData.data.length]
      imageData.data[i] = Math.round(applyingImageData.data[i] * imageData.data[i] / 255)

    @context.putImageData imageData, 0, 0

  # Addition
  addition: (applyingContext) ->
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    applyingImageData = applyingContext.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    for i in [0...applyingImageData.data.length]
      imageData.data[i] = Math.min(applyingImageData.data[i] + imageData.data[i], 255)

    @context.putImageData imageData, 0, 0