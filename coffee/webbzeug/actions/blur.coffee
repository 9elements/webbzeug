window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Blur = class BlurAction extends Webbzeug.Action
  availableParameters: ->
    {
      strength: { name: 'Strength', type: 'number', default: 1, min: 1 , max: 10 }
    }
  render: (contexts) ->
    super()
    if contexts.length == 0
      console.log "Dude an blur needs an input"
      return

    strength = parseInt @getParameter('strength')
    
    # How to copy the image data from one context to another
    for n in [0...strength]
      if n is 0
        imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
      else
        imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()      
      outputData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
      rowLength = @app.getWidth() << 2
      for y in [1...@app.getHeight() - 1]
        for x in [1...@app.getWidth() - 1]
          index = (x << 2) + y * (@app.getWidth() << 2)
          for i in [0...3]  
            # unrolled for performance 
            value = imageData.data[index + i - rowLength]
            value += imageData.data[index + i - 4 - rowLength]
            value += imageData.data[index + i + 4 - rowLength]

            value += imageData.data[index + i]
            value += imageData.data[index + i - 4]
            value += imageData.data[index + i + 4]

            value += imageData.data[index + i +  rowLength]
            value += imageData.data[index + i - 4 + rowLength]
            value += imageData.data[index + i + 4 + rowLength]
            outputData.data[index + i] = value / 9

          outputData.data[index + 3] = 255

      @context.putImageData outputData, 0, 0 
    return @context