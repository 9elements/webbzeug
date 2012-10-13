window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Blur = class BlurAction extends Webbzeug.Action
  type: 'blur'
  availableParameters: ->
    {
      strength: { name: 'Strength', type: 'number', default: 1, min: 1 , max: 30 }
      type: { name: 'Type', type: 'enum', values: { linear: 'Linear', gauss: 'Gauss' }, default: 'linear' }
    }

  validations: (contexts) ->
    warnings = []
    errors   = []
    if contexts.length > 1
      warnings.push 'Blur will only use the first input.'
    if contexts.length < 1
      errors.push 'Blur needs exactly 1 input.'
    
    return { errors: errors, warnings: warnings }

  linearBlur: (contexts) ->
    strength = parseInt @getParameter('strength')
    
    # How to copy the image data from one context to another
    for n in [0...strength]
      if n is 0
        imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
      else
        imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()      
      outputData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
      rowLength = @app.getWidth() << 2
      for y in [0...@app.getHeight()]
        for x in [0...@app.getWidth()]
          index = (x << 2) + y * (@app.getWidth() << 2)
          for i in [0...3]  
            pixelCount = 9
            # unrolled for performance 
            value = imageData.data[index + i] # our pixel itself is our starting point

            # upper row
            if y != 0 
              value += imageData.data[index + i - rowLength]
              if x != 0
                value += imageData.data[index + i - 4 - rowLength]
              else 
                pixelCount -= 1
              if x < (@app.getWidth() - 1)        
                value += imageData.data[index + i + 4 - rowLength]
              else 
                pixelCount -= 1
            else 
              pixelCount -=3
            # mid row
            if x != 0
              value += imageData.data[index + i - 4]
            else 
              pixelCount -= 1
            if x < (@app.getWidth() - 1)        
              value += imageData.data[index + i + 4]
            else
              pixelCount -=1

            # bottom row
            if y < (@app.getHeight() - 1)
              value += imageData.data[index + i +  rowLength]
              if x != 0
                value += imageData.data[index + i - 4 + rowLength]
              else 
                pixelCount -= 1
              if x < (@app.getWidth() - 1)       
                value += imageData.data[index + i + 4 + rowLength]
              else 
                pixelCount -= 1
            else 
              pixelCount -= 3
            outputData.data[index + i] = value / pixelCount

          outputData.data[index + 3] = 255

      @context.putImageData outputData, 0, 0 
     

  gaussBlur: (contexts) ->
    strength = parseInt @getParameter('strength')
    
    # How to copy the image data from one context to another
    for n in [0...strength]
      if n is 0
        imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
      else
        imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()      
      outputData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
      rowLength = @app.getWidth() << 2
      for y in [0...@app.getHeight()]
        for x in [0...@app.getWidth()]
          index = (x << 2) + y * (@app.getWidth() << 2)
          for i in [0...3]  
            pixelCount = 16
            # unrolled for performance 
            value = imageData.data[index + i]  << 2 # our pixel itself is our starting point

            # upper row
            if y != 0 
              value += (imageData.data[index + i - rowLength] << 1)
              if x != 0
                value += imageData.data[index + i - 4 - rowLength]
              else 
                pixelCount -= 1
              if x < (@app.getWidth() - 1)        
                value += imageData.data[index + i + 4 - rowLength]
              else 
                pixelCount -= 1
            else 
              pixelCount -=4
            # mid row
            if x != 0
              value += (imageData.data[index + i - 4] << 1)
            else 
              pixelCount -= 2
            if x < (@app.getWidth() - 1)        
              value += (imageData.data[index + i + 4] << 1)
            else
              pixelCount -= 2

            # bottom row
            if y < (@app.getHeight() - 1)
              value += (imageData.data[index + i +  rowLength] << 1)
              if x != 0
                value += imageData.data[index + i - 4 + rowLength]
              else 
                pixelCount -= 1
              if x < (@app.getWidth() - 1)       
                value += imageData.data[index + i + 4 + rowLength]
              else 
                pixelCount -= 1
            else 
              pixelCount -= 4
            outputData.data[index + i] = value / pixelCount

          outputData.data[index + 3] = 255

      @context.putImageData outputData, 0, 0 
     

  render: (contexts) ->
    super()
    switch @getParameter('type')
      when 'linear'
        @linearBlur contexts
      when 'gauss'
        @gaussBlur contexts
    return @context
