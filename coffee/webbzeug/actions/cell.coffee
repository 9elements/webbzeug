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
window.Webbzeug.Actions.Cell = class CellAction extends Webbzeug.Action
  type: 'cell'
  availableParameters: ->
    {
      gridSize: { name: 'Grid size', type: 'number', min: 2, max: 64, default: 2 },
    }
  render: (contexts) ->
    super()
    imageData = @context.getImageData 0, 0, @app.getWidth(), @app.getHeight()

    gridSize = parseInt @getParameter('gridSize')

    points = @generatePoints gridSize   

    gridW = @app.getWidth() / gridSize
    gridH = @app.getHeight() / gridSize

    w = @app.getWidth()
    h = @app.getHeight()

    for y in [0...h]
      for x in [0...w]
        index = ((y * w) << 2) + (x << 2)

        cellX = Math.floor(x / gridW)
        cellY = Math.floor(y / gridH)

        maxDist = Math.sqrt(Math.pow(gridW,2) + Math.pow(gridH,2)) * 2
        minDist = maxDist

        for gx in [(cellX - 2)...(cellX + 2)]
          for gy in [(cellY - 2)...(cellY + 2)]
            ogx = gx
            ogy = gy

            # Tiling
            if gx < 0
              gx = gridSize + gx
            if gx > gridSize - 1
              gx = gx - gridSize

            if gy < 0
              gy = gridSize + gy
            if gy > gridSize - 1
              gy = gy - gridSize

            point = points[gx][gy]

            px = point.x
            py = point.y

            if ogx < 0
              px -= gridW * gridSize
            if ogx > gridSize - 1
              px += gridW * gridSize            

            if ogy < 0
              py -= gridH * gridSize
            if ogy > gridSize - 1 
              py += gridH * gridSize

            dist  = Math.sqrt( Math.pow(x - px, 2) + Math.pow(y - py, 2) )

            minDist = Math.min(dist, minDist)

        # Normalize minDist
        value = minDist / maxDist * 255

        imageData.data[index] = value
        imageData.data[index + 1] = value
        imageData.data[index + 2] = value
        imageData.data[index + 3] = 255

    for point in _.flatten(points)
      imageData.data[((point.y * 256) << 2) + (point.x << 2)] = 255
      imageData.data[((point.y * 256) << 2) + (point.x << 2) + 3] = 255


    @context.putImageData imageData, 0, 0 
    return @context

  generatePoints: (gridSize) ->
    w = @app.getWidth()
    h = @app.getHeight()

    gridW = @app.getWidth() / gridSize
    gridH = @app.getHeight() / gridSize

    points = []
    for x in [0...gridSize]
      pointsCol = []
      for y in [0...gridSize]
        pointsCol.push { x: Math.ceil(x * gridW + Math.random() * gridW), y: Math.ceil(y * gridH + Math.random() * gridH) }
        # points.push { x: x * gridW + gridW, y: y * gridH + gridH / 3 }

      points.push pointsCol

    console.log points

    return points

###
  OLD APPROACH
###
###
  w = @app.getWidth()
  h = @app.getHeight()

  smallestDistances = []
  maxDist = 0
  minDist = 255

  for x in [0...w]
    for y in [0...h]
      index = ((y * w) << 2) + (x << 2)

      smallestDistance = 255
      for point in @points
        dist = Math.sqrt(Math.pow( (x - point.x), 2 ) + Math.pow( (y - point.y), 2 ))
        smallestDistance = Math.min(dist, smallestDistance)
      maxDist = Math.max(maxDist, smallestDistance)
      minDist = Math.min(minDist, smallestDistance)
      smallestDistances.push smallestDistance

  dDist = maxDist - minDist
  # normalize array
  for distance, i in smallestDistances
    smallestDistances[i] = (distance - minDist) / dDist * 255

  for x in [0...w]
    for y in [0...h]
      pixindex = y * w + x
      value = smallestDistances[pixindex]

      index = ((y * w) << 2) + (x << 2)
      imageData.data[index] = value
      imageData.data[index + 1] = value
      imageData.data[index + 2] = value

      imageData.data[index + 3] = 255
###