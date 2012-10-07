window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Normal = class NormalAction extends Webbzeug.Action
  type: 'normal'
  availableParameters: ->
    {
 
    }

  render: (contexts) ->
    super()

    inputImageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
    outputImageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    w = @app.getWidth()
    h = @app.getHeight()
    for y in [0...h - 1]
      for x in [0...w - 1]
        rowLen = (w << 2)
        index = (x << 2) + y * rowLen
        vector1X = inputImageData.data[index] - inputImageData.data[index + 4]
        vector1Y = inputImageData.data[index + 1]  - inputImageData.data[index + 5]
        vector1Z = inputImageData.data[index + 2]   - inputImageData.data[index + 6]

        vector2X = inputImageData.data[index] - inputImageData.data[index + rowLen]
        vector2Y = inputImageData.data[index + 1]  - inputImageData.data[index + rowLen + 1]
        vector2Z = inputImageData.data[index + 2]   - inputImageData.data[index + rowLen + 2]

        # and now cross product
        vector3X = vector1Y * vector2Z - vector1Z * vector2Y
        vector3Y = vector1Z * vector2X - vector1X * vector2Z
        vector3Z = vector1X * vector2Y - vector1Y * vector2X

        outputImageData.data[index] = vector3X
        outputImageData.data[index + 1] = vector3Y
        outputImageData.data[index + 2] = vector3Z

    @context.putImageData outputImageData, 0, 0
    return @context
