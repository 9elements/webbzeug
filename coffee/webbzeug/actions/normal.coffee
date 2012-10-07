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
        gray = (inputImageData.data[index] + inputImageData.data[index + 1] + inputImageData.data[index + 2]) / 3  
        grayRight = (inputImageData.data[index + 4] + inputImageData.data[index + 5] + inputImageData.data[index + 6]) / 3  
        grayBottom = (inputImageData.data[index + rowLen] + inputImageData.data[index + rowLen + 1] + inputImageData.data[index + rowLen + 2]) / 3  

        vector1X = -1
        vector1Y = 0
        vector1Z = gray - grayRight

        vector2X = 0
        vector2Y = -1
        vector2Z = gray - grayBottom

        # and now cross product
        vector3X = vector1Y * vector2Z - vector1Z * vector2Y
        vector3Y = vector1Z * vector2X - vector1X * vector2Z
        vector3Z = vector1X * vector2Y - vector1Y * vector2X

        outputImageData.data[index] = (vector3X + 255) / 2
        outputImageData.data[index + 1] = (vector3Y + 255) / 2
        outputImageData.data[index + 2] = (vector3Z + 255) / 2
        outputImageData.data[index + 3] = 255

    @context.putImageData outputImageData, 0, 0
    return @context
