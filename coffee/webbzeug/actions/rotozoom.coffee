window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.RotoZoom = class RotoZoomAction extends Webbzeug.Action
  type: 'rotozoom'
  availableParameters: ->
    {
      rotation: { name: 'Rotation', type: 'number', min: 0, max: Math.PI * 2, default: 0, step: 0.01},
      zoom: { name: 'Zoom', type: 'number', min: 1, max: 255, default: 10}
    }
  render: (contexts) ->
    super()
    if contexts.length == 0
      console.log "Dude an inverter needs an input"
      return

    rotation = @getParameter('rotation')
    zoom  = @getParameter('zoom') / 10

    # How to copy the image data from one context to another
    inputImageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
    outputImageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    cosrot = Math.cos(rotation)*zoom
    sinrot = Math.sin(rotation)*zoom

    for y in [0...256]
      cosy = cosrot * (y - 128)
      siny = sinrot * (y - 128)
      for x in [0...256]
        cosx = cosrot * (x - 128)
        sinx = sinrot * (x - 128)

        xsrc = parseInt(cosx - siny - 128) & 255
        ysrc = parseInt(sinx + cosy - 128) & 255

        offsetInput  = (ysrc << 10) + (xsrc << 2)
        offsetOutput = (y << 10) + (x << 2)

        for k in [0...4]
          outputImageData.data[offsetOutput + k] = inputImageData.data[offsetInput + k]

    @context.putImageData outputImageData, 0, 0 
    return @context