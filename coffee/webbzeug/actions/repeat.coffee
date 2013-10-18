window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Repeat = class RepeatAction extends Webbzeug.Action
  type: 'repeat'
  name: 'Repeat'

  availableParameters: ->
    {
      scrollX: { name: 'Scroll X', type: 'integer', min: -256, max: 256, default: 0, step: 1, scrollPrecision: 1 },
      scrollY: { name: 'Scroll Y', type: 'integer', min: -256, max: 256, default: 0, step: 1, scrollPrecision: 1 },
      count: { name: 'Count', type: 'integer', min: 1, max: 50, default: 1, scrollPrecision: 1 },
      blendmode: { name: 'Blend Mode', type: 'enum', values: {
        add: 'Add'
      }, default: 'add' }
    }

  validations: (contexts) ->
    warnings = []
    errors = []
    if contexts.length > 1
      warnings.push 'Repeat will only use the first input.'
    if contexts.length < 1
      errors.push 'Repeat needs exactly one input.'
    
    return { errors: errors, warnings: warnings }

  render: (contexts) ->
    super()

    @copyRendered contexts

    w = @app.getWidth()
    h = @app.getHeight()

    inputData  = contexts[0].getImageData 0, 0, w, h
    outputData = @context.getImageData 0, 0, w, h

    scrollXinc = parseInt @getParameter('scrollX')
    scrollYinc = parseInt @getParameter('scrollY')

    for x in [0...w]
      for y in [0...h]
        scrollX = scrollXinc
        scrollY = scrollYinc
        for i in [0...parseInt(@getParameter('count'))]

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

          switch @getParameter('blendmode')
            when 'add'
              outputData.data[destIndex] = Math.min(outputData.data[destIndex] + inputData.data[srcIndex], 255)
              outputData.data[destIndex + 1] = Math.min(outputData.data[destIndex + 1] + inputData.data[srcIndex + 1], 255)
              outputData.data[destIndex + 2] = Math.min(outputData.data[destIndex + 2] + inputData.data[srcIndex + 2], 255)
              outputData.data[destIndex + 3] = Math.min(outputData.data[destIndex + 3] + inputData.data[srcIndex + 3], 255)
          
          scrollX += scrollXinc
          scrollY += scrollYinc  

    @context.putImageData outputData, 0, 0 
    return @context