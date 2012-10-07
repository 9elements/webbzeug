window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Mirror = class MirrorAction extends Webbzeug.Action
  availableParameters: ->
    {
      direction: { name: "Direction", type: 'enum', values: { vertical: 'Vertical', horizontal: 'Horizontal'}, default: 'vertical' }  
    }

  render: (contexts) ->
    super()
    if contexts.length == 0
      console.log "Dude a mirror needs an input"
      return

    # How to copy the image data from one context to another
    imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()

    console.log @getParameter('direction')
    if @getParameter('direction') is 'horizontal'
      for y in [0...imageData.height]
        ySrcOffset  = (y * imageData.width) << 2 + (x << 2)
        yDrawOffset = (y * imageData.width + imageData.width - 1) << 2 - (x << 2)

        for x in [0...imageData.width / 2]
          imageData.data[yDrawOffset] = imageData.data[ySrcOffset]
          imageData.data[yDrawOffset + 1] = imageData.data[ySrcOffset + 1]
          imageData.data[yDrawOffset + 2] = imageData.data[ySrcOffset + 2]
          imageData.data[yDrawOffset + 3] = imageData.data[ySrcOffset + 3]

    @context.putImageData imageData, 0, 0 
    return @context