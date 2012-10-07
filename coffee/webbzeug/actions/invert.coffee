window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Invert = class InvertAction extends Webbzeug.Action
  type: 'invert'
  render: (contexts) ->
    super()
    if contexts.length == 0
      console.log "Dude an inverter needs an input"
      return

    # How to copy the image data from one context to another
    imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
   
    for i in [0...imageData.data.length]
      if (i % 4) != 3
        imageData.data[i] = 255 - imageData.data[i]

    @context.putImageData imageData, 0, 0 
    return @context