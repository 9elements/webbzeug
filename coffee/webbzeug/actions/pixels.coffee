`var CustomRandom = function(nseed) {

    var seed,
        constant = Math.pow(2, 13)+1,
        prime = 37,
        maximum = Math.pow(2, 50);
 
    if (nseed) {
        seed = nseed;
    }
 
    if (seed == null) {
        seed = (new Date()).getTime();
    } 
 
    return {
        next : function() {
            seed *= constant;
            seed += prime;
            seed %= maximum;
            
            return seed;
        }
    }
}`

window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Pixels = class PixelsAction extends Webbzeug.Action
  availableParameters: ->
    {
      seed: { name: 'Seed', type: 'number', min: 0, max: 999999999, default: Math.round(Math.random() * 999999999) },
    }

  render: (contexts) ->
    super()

    # How to copy the image data from one context to another
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    # @context.putImageData imageData, 0, 0

    # Pixel manipulation
    
    # imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    # imageData.data[1] = 255
    # imageData.data[2] = 255

    # @context.putImageData imageData, 0, 0 

    custRnd = CustomRandom(@getParameter('seed'))
    for i in [0...imageData.data.length / 4]
      rand = custRnd.next() / Math.pow(2, 50)
      rand = rand * 255
      index = (i << 2)
      imageData.data[index] = rand
      imageData.data[index + 1] = rand
      imageData.data[index + 2] = rand
      imageData.data[index + 3] = 255
    @context.putImageData imageData, 0, 0 
    return @context