window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Combine = class CombineAction extends Webbzeug.Action
  type: 'combine'
  availableParameters: ->
    {
      type: { name: 'Type', type: 'enum', values: { 
        darken: 'Darken',
        lighten: 'Lighten',
        multiply: 'Multiply', 
        add: 'Add', 
        substract: 'Substract',
        divide: 'Divide'
      }, default: 'add' }
    }

  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length < 2
      errors.push 'Combine needs exactly 2 inputs.'
    if contexts.length > 2
      warnings.push 'Combine will only use the first 2 inputs.'
    
    return { warnings: warnings, errors: errors }

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
        when 'darken'
          @darken applyingContext
        when 'lighten'
          @lighten applyingContext
        when 'multiply'
          @multiply applyingContext
        when 'add'
          @add applyingContext
        when 'substract'
          @substract applyingContext
        when 'divide'
          @divide applyingContext

    return @context

  # Darken
  darken: (applyingContext) ->
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    applyingImageData = applyingContext.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    for i in [0...applyingImageData.data.length] by 4
      for j in [0...3]
        imageData.data[i + j] = Math.min(imageData.data[i + j], applyingImageData.data[i + j])

    @context.putImageData imageData, 0, 0

  # Lighten
  lighten: (applyingContext) ->
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    applyingImageData = applyingContext.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    for i in [0...applyingImageData.data.length] by 4
      for j in [0...3]
        imageData.data[i + j] = Math.max(imageData.data[i + j], applyingImageData.data[i + j])

    @context.putImageData imageData, 0, 0

  # Multiplication
  multiply: (applyingContext) ->
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    applyingImageData = applyingContext.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    for i in [0...applyingImageData.data.length]
      imageData.data[i] = Math.round(applyingImageData.data[i] * imageData.data[i] / 255)

    @context.putImageData imageData, 0, 0

  # Addition
  add: (applyingContext) ->
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    applyingImageData = applyingContext.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    for i in [0...applyingImageData.data.length]
      imageData.data[i] = Math.min(applyingImageData.data[i] + imageData.data[i], 255)

    @context.putImageData imageData, 0, 0

  # Substraction
  substract: (applyingContext) ->
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    applyingImageData = applyingContext.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    for i in [0...applyingImageData.data.length] by 4
      for j in [0...3]
        imageData.data[i + j] = imageData.data[i + j] - applyingImageData.data[i + j]

    @context.putImageData imageData, 0, 0

  # Division
  divide: (applyingContext) ->
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    applyingImageData = applyingContext.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    for i in [0...applyingImageData.data.length]
      if imageData.data[i] > 0
        imageData.data[i] = Math.round(applyingImageData.data[i] / imageData.data[i])

    @context.putImageData imageData, 0, 0