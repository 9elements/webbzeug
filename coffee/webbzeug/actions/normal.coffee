window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Normal = class NormalAction extends Webbzeug.Action
  type: 'normal'
  validations: (contexts) ->
    errors = []
    warnings = []
    if contexts.length > 1
      warnings.push 'Normal will only use the first input.'
    if contexts.length < 1
      errors.push 'Normal needs exactly 1 input.'
    
    return { errors: errors, warnings: warnings }

  render: (contexts) ->
    super()

    inputImageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
    outputImageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    w = @app.getWidth()
    h = @app.getHeight()
    for y in [0...h]
      for x in [0...w]
        rowLen = (w << 2)
        index = (x << 2) + y * rowLen

        negRowLen = - rowLen
        posRowLen = rowLen
        negPixelLen = -4
        posPixelLen = 4

        if x is 0
            negPixelLen = 0
        if x is w - 1
            posPixelLen = 0
        if y is 0 
            negRowLen = 0
        if y is h - 1
            posRowLen = 0

        tl = inputImageData.data[index + negRowLen + negPixelLen]  
        l = inputImageData.data[index + negPixelLen] 
        bl = inputImageData.data[index + posPixelLen + negPixelLen] 

        t = inputImageData.data[index  + negPixelLen]  
        b = inputImageData.data[index + posRowLen ] 

        tr = inputImageData.data[index + negRowLen + posPixelLen]  
        r = inputImageData.data[index + posPixelLen]  
        br = inputImageData.data[index + posRowLen + posPixelLen] 
      
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
