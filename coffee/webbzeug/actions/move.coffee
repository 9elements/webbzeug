window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Move = class MoveAction extends Webbzeug.Action
  type: 'move'
  name: 'Move'

  availableParameters: ->
    {
      scrollX: { name: 'Scroll X', type: 'integer', min: -256, max: 256, default: 0, step: 1, scrollPrecision: 1 },
      scrollY: { name: 'Scroll Y', type: 'integer', min: -256, max: 256, default: 0, step: 1, scrollPrecision: 1 }
    }

  validations: (contexts) ->
    warnings = []
    errors = []
    if contexts.length > 1
      warnings.push 'Move will only use the first input.'
    if contexts.length < 1
      errors.push 'Move needs exactly one input.'
    
    return { errors: errors, warnings: warnings }

  render: (contexts) ->
    super()

    @copyRendered contexts

    w = @app.getWidth()
    h = @app.getHeight()

    inputData  = contexts[0].getImageData 0, 0, w, h
    outputData = @context.getImageData 0, 0, w, h

    scrollX = parseInt @getParameter('scrollX')
    scrollY = parseInt @getParameter('scrollY')

    for x in [0...w]
      for y in [0...h]        
        srcX = x
        srcY = y
        destX = (srcX + scrollX) % w
        destY = (srcY + scrollY) % h

        if destX < 0
          destX += w
        if destY < 0
          destY += h

        srcIndex = ((srcY * w) + srcX) << 2
        destIndex = ((destY * w) + destX) << 2

        outputData.data[destIndex] = inputData.data[srcIndex]
        outputData.data[destIndex + 1] = inputData.data[srcIndex + 1]
        outputData.data[destIndex + 2] = inputData.data[srcIndex + 2]
        outputData.data[destIndex + 3] = inputData.data[srcIndex + 3]

    @context.putImageData outputData, 0, 0 
    return @context