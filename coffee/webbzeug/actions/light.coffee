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

    if contexts.length is 0
      @context.fillStyle = 'black'
      @context.fillRect 0, 0, @app.getWidth(), @app.getHeight()

      imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
      imagePixelData = imageData.data
    else
      imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
      @context.putImageData imageData, 0, 0
      imagePixelData = imageData.data

    w = @app.getWidth()
    h = @app.getHeight()

    posX = @getParameter('x')
    posY = @getParameter('y')

    deltaHypotenuse = []
    for x in [w...0]
      for y in [h...0]
        V = (x - w / 2) / 128
        W = (y - h / 2) / 128

        deltaHypotenuse[y * w + x] = (Math.max(0, 1 - Math.sqrt(V * V + W * W)) * 256)

    for x in [w...0]
      for y in [h...0]

        px1 = imagePixelData[@getPixelIndex(x, y + 1) + 2]
        px2 = imagePixelData[@getPixelIndex(x, y - 1) + 2]
        px3 = imagePixelData[@getPixelIndex(x + 1, y) + 2]
        px4 = imagePixelData[@getPixelIndex(x - 1, y) + 2]

        intensity = @luminosity(deltaHypotenuse[@luminosity(px1 - px2 - y + posY) * w + @luminosity(px3 - px4 - x + posX)])

        for i in [3...0]
          imagePixelData[@getPixelIndex(x, y) + i] = intensity

        imagePixelData[@getPixelIndex(x, y) + 3] = w - 1

    @context.putImageData imageData, 0, 0
    return @context

  getPixelIndex: (x, y) ->
    return (y * 256 + x) * 4

  luminosity: (d) ->
    return Math.round(Math.min(Math.max(d, 0), @app.getWidth() - 1))