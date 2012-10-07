window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Light = class LightAction extends Webbzeug.Action
  availableParameters: ->
    {
      x: { name: 'X', type: 'number', min: 0, max: 256, default: 32 },
      y: { name: 'Y', type: 'number', min: 0, max: 256, default: 128 }
    }

  render: (contexts) ->
    super()

    @context.canvas.width *= 2

    if contexts.length == 0
      console.log "Dude a light needs an input"
      return

    # How to copy the image data from one context to another
    inputImageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
    outputImageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    w = @app.getWidth()
    h = @app.getHeight()

    posX = parseInt @getParameter('x')
    posY = parseInt @getParameter('y')

    deltaHypotenuse = []
    for x in [w...0]
      for y in [h...0]
        V = (x - w / 2) / 128
        W = (y - h / 2) / 128

        deltaHypotenuse[y * w + x] = (Math.max(0, 1 - Math.sqrt(V * V + W * W)) * 256)

    for x in [w...0]
      for y in [h...0]

        px1 = inputImageData.data[@getPixelIndex(x, y + 1) + 2]
        px2 = inputImageData.data[@getPixelIndex(x, y - 1) + 2]
        px3 = inputImageData.data[@getPixelIndex(x + 1, y) + 2]
        px4 = inputImageData.data[@getPixelIndex(x - 1, y) + 2]

        intensity = @luminosity(deltaHypotenuse[@luminosity(px1 - px2 - y + posY) * w + @luminosity(px3 - px4 - x + posX)])

        for i in [0...3]
          outputImageData.data[@getPixelIndex(x, y) + i] = intensity

        outputImageData.data[@getPixelIndex(x, y) + 3] = w - 1

    @context.putImageData outputImageData, 0, 0
    return @context

  getPixelIndex: (x, y) ->
    return (y * 256 + x) * 4

  luminosity: (d) ->
    return Math.round(Math.min(Math.max(d, 0), @app.getWidth() - 1))