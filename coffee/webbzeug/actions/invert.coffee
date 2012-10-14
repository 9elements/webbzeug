window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Invert = class InvertAction extends Webbzeug.Action
  type: 'invert'
  name: 'Invert'

  validations: (contexts) ->
    warnings = []
    errors = []
    if contexts.length > 1
      warnings.push 'Invert will only use the first input.'
    if contexts.length < 1
      errors.push 'Invert needs exactly one input.'
    
    return { errors: errors, warnings: warnings }


  render: (contexts) ->
    super()

    # How to copy the image data from one context to another
    imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
   
    for i in [0...imageData.data.length]
      if (i % 4) != 3
        imageData.data[i] = 255 - imageData.data[i]

    @context.putImageData imageData, 0, 0 
    return @context