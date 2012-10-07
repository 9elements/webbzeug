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
        },
        next01: function() {
          return this.next() / maximum;
        }
    }
}`

window.Webbzeug ?= {}
window.Webbzeug.Actions ?= {}
window.Webbzeug.Actions.Fractal = class FractalAction extends Webbzeug.Action
  availableParameters: ->
    {
      roughness: { name: 'Roughness', type: 'number', min: 1, max: 100, default: 3 },
      unitsize: { name: 'Unit size', type: 'number', min: 1, max: 10, default: 1 },
      seed: { name: 'Seed', type: 'number', min: 1, max: 255, default: Math.round(Math.random() * 255) }
    }

  render: (contexts) ->
    super()

    @rnd = CustomRandom(@getParameter('seed'))

    roughness = @getParameter('roughness') / @app.getWidth()

    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()
    imagePixelData = imageData.data

    w = @app.getWidth()
    h = @app.getHeight()

    map = []
    for x in [0...w+1]
      map[x] = []

    # Set corner points

    # Upper left
    map[0][0] = @rnd.next01()
    ul = map[0][0]

    # Lower left
    map[0][h] = @rnd.next01()
    ll = map[0][h]

    # Upper right
    map[w][0] = @rnd.next01()
    ur = map[w][0]

    # Lower right
    map[w][h] = @rnd.next01()
    lr = map[w][h]

    # Center is the normalized sum of the corners
    map[w / 2][h / 2] = ul + ll + ur + lr
    map[w / 2][h / 2] = @normalize(map[w / 2][h / 2])
    center = map[w / 2][h / 2]

    # Lower center
    map[w / 2][h] = ll + lr + center / 3

    # Upper center
    map[w / 2][0] = ul + ur + center / 3

    # Right center
    map[w][h / 2] = ur + lr + center / 3

    # Left center
    map[0][h / 2] = ul + ll + center / 3

    map = @midpointDisplacement @app.getWidth(), map

    # Draw that map!

    for x in [0...@app.getWidth()]
      for y in [0...@app.getHeight()]
        color = Math.floor(map[x][y] * 250)
        index = ((y * @app.getWidth()) << 2) + (x << 2)
        imagePixelData[index] = color
        imagePixelData[index + 1] = color
        imagePixelData[index + 2] = color
        imagePixelData[index + 3] = 255

    @context.putImageData imageData, 0, 0
    return @context

  midpointDisplacement: (dimension, map) ->
    newDimension = dimension / 2

    if newDimension > @getParameter('unitsize')
      for i in [newDimension..@app.getWidth()] by newDimension
        for j in [newDimension..@app.getWidth()] by newDimension
          x = i - (newDimension / 2)
          y = j - (newDimension / 2)

          tl = map[i - newDimension][j - newDimension]
          tr = map[i][j - newDimension]
          bl = map[i - newDimension][j]
          br = map[i][j]

          # Center
          map[x][y] = (tl + tr + bl + br) / 4 + @displace(dimension)
          map[x][y] = @normalize(map[x][y])
          center = map[x][y]

          # Top
          if j - (newDimension * 2) + (newDimension / 2) > 0
            map[x][j - newDimension] = (tl + tr + center + map[x][j - dimension + (newDimension / 2)]) / 4 + @displace(dimension)
          else
            map[x][j - newDimension] = (tl + tr + center) / 3 + @displace(dimension)

          # Bottom
          if j + (newDimension / 2) < @app.getWidth()
            map[x][j] = (bl + br + center + map[x][j + (newDimension / 2)]) / 4 + @displace(dimension)
          else
            map[x][j] = (bl + br + center) / 3 + @displace(dimension)
          map[x][j] = @normalize(map[x][j])

          
          # Right
          if i + (newDimension / 2) < @app.getWidth()
            map[i][y] = (tr + br + center + map[i + (newDimension / 2)][y]) / 4 + @displace(dimension)
          else
            map[i][y] = (tr + br + center) / 3 + @displace(dimension)
          map[i][y] = @normalize(map[i][y])
          
          # Left
          if i - (newDimension * 2) + (newDimension / 2) > 0
            map[i - newDimension][y] = (tl + bl + center + map[i - dimension + (newDimension / 2)][y]) / 4 + @displace(dimension)
          else
            map[i - newDimension][y] = (tl + bl + center) / 3 + @displace(dimension)
          map[i - newDimension][y] = @normalize(map[i - newDimension][y])

      map = @midpointDisplacement newDimension, map

    return map


  normalize: (value) ->
    value = Math.max(0, value)
    value = Math.min(1, value)
    return value

  displace: (num) ->
    max = num / (@app.getWidth() * 2) * @getParameter('roughness')
    return (@rnd.next01() - 0.5) * max