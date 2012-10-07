window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Mirror = class MirrorAction extends Webbzeug.Action
  render: (contexts) ->
    super()
    if contexts.length == 0
      console.log "Dude a mirror needs an input"
      return

    # How to copy the image data from one context to another
    imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
   
    for y in [0...imageData.height]
      ySrcOffset  = (y * imageData.width) << 2
      yDrawOffset = (y * imageData.width + imageData.width - 1) << 2

      for x in [0...imageData.width / 2]
        imageData.data[yDrawOffset - (x << 2)] = imageData.data[ySrcOffset + (x << 2)]
        imageData.data[yDrawOffset - (x << 2) + 1] = imageData.data[ySrcOffset + (x << 2) + 1]
        imageData.data[yDrawOffset - (x << 2) + 2] = imageData.data[ySrcOffset + (x << 2) + 2]
        imageData.data[yDrawOffset - (x << 2) + 3] = imageData.data[ySrcOffset + (x << 2) + 3]

    @context.putImageData imageData, 0, 0 
    return @context