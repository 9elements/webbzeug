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
    for y in [1..h - 1]
      for x in [1..w - 1]
        rowLen = (w << 2)
        index = (x << 2) + y * rowLen
        
        tl = inputImageData.data[index - rowLen - 4]  
        l = inputImageData.data[index - 4] 
        bl = inputImageData.data[index + rowLen - 4] 

        t = inputImageData.data[index  - rowLen ]  
        b = inputImageData.data[index + rowLen ] 

        tr = inputImageData.data[index - rowLen + 4]  
        r = inputImageData.data[index + 4]  
        br = inputImageData.data[index + rowLen + 4] 
      
        # Compute dx using Sobel:  
        #           -1 0 1   
        #           -2 0 2  
        #           -1 0 1  
        dX = tr + 2.0 * r + br - tl - 2.0 * l - bl;  
  
        # Compute dy using Sobel:  
        #           -1 -2 -1   
        #            0  0  0  
        #            1  2  1  
  
        dY = bl + 2.0 * b + br - tl - 2.0 * t - tr;  

        outputImageData.data[index] = (dX + 255) / 2
        outputImageData.data[index + 1] = (dY + 255) / 2
        outputImageData.data[index + 2] = 255
        outputImageData.data[index + 3] = 255

    @context.putImageData outputImageData, 0, 0
    return @context
