(function() {
  var CustomRandom = function(nseed) {

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
};

  var CellAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Cell = CellAction = (function(_super) {

    __extends(CellAction, _super);

    function CellAction() {
      return CellAction.__super__.constructor.apply(this, arguments);
    }

    CellAction.prototype.type = 'cell';

    CellAction.prototype.availableParameters = function() {
      return {
        gridSize: {
          name: 'Grid size',
          type: 'number',
          min: 2,
          max: 1000,
          "default": 8
        },
        seed: {
          name: 'Seed',
          type: 'number',
          min: 0,
          max: 255,
          "default": Math.round(Math.random() * 255)
        },
        type: {
          name: 'Type',
          type: 'enum',
          values: {
            balls: 'Balls',
            mosaic: 'Mosaic'
          },
          "default": 'balls'
        }
      };
    };

    CellAction.prototype.render = function(contexts) {
      var dist, distances, gridPosX, gridPosY, gridPxSize, gridSize, gridX, gridY, h, imageData, index, lastMinDist, maxDist, minDist, originalGridX, originalGridY, point, points, px, py, value, w, x, y, _i, _j, _k, _l, _ref2, _ref3, _ref4, _ref5,
        _this = this;
      CellAction.__super__.render.call(this);
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      gridSize = parseInt(this.getParameter('gridSize'));
      points = this.generatePoints(gridSize);
      gridPxSize = this.app.getWidth() / gridSize;
      w = this.app.getWidth();
      h = this.app.getHeight();
      maxDist = Math.sqrt(Math.pow(gridPxSize, 2) + Math.pow(gridPxSize, 2)) * 2;
      for (x = _i = 0; 0 <= w ? _i < w : _i > w; x = 0 <= w ? ++_i : --_i) {
        for (y = _j = 0; 0 <= h ? _j < h : _j > h; y = 0 <= h ? ++_j : --_j) {
          gridPosX = Math.floor(x / gridPxSize);
          gridPosY = Math.floor(y / gridPxSize);
          distances = [];
          minDist = maxDist;
          for (gridX = _k = _ref2 = gridPosX - 1, _ref3 = gridPosX + 1; _ref2 <= _ref3 ? _k <= _ref3 : _k >= _ref3; gridX = _ref2 <= _ref3 ? ++_k : --_k) {
            originalGridX = gridX;
            if (gridX < 0) {
              gridX = gridSize + gridX;
            }
            if (gridX > gridSize - 1) {
              gridX = gridX - gridSize;
            }
            for (gridY = _l = _ref4 = gridPosY - 1, _ref5 = gridPosY + 1; _ref4 <= _ref5 ? _l <= _ref5 : _l >= _ref5; gridY = _ref4 <= _ref5 ? ++_l : --_l) {
              originalGridY = gridY;
              if (gridY < 0) {
                gridY = gridSize + gridY;
              }
              if (gridY > gridSize - 1) {
                gridY = gridY - gridSize;
              }
              point = points[gridX][gridY];
              px = point.x;
              py = point.y;
              if (originalGridX < 0) {
                px -= w;
              } else if (originalGridX > gridSize - 1) {
                px += w;
              }
              if (originalGridY < 0) {
                py -= h;
              } else if (originalGridY > gridSize - 1) {
                py += h;
              }
              dist = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
              distances.push(dist);
              minDist = Math.min(minDist, dist);
            }
          }
          if (this.getParameter('type') === 'mosaic') {
            distances.sort(function(a, b) {
              if (a > b) {
                return 1;
              }
              if (a < b) {
                return -1;
              }
              return 0;
            });
            lastMinDist = distances[1];
            value = (lastMinDist - minDist) / maxDist * 255;
          } else if (this.getParameter('type') === 'balls') {
            value = minDist / maxDist * 255;
          }
          index = ((y * w) << 2) + (x << 2);
          imageData.data[index] = value;
          imageData.data[index + 1] = value;
          imageData.data[index + 2] = value;
          imageData.data[index + 3] = 255;
        }
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    CellAction.prototype.generatePoints = function(gridSize) {
      var custRnd, gridH, gridW, h, points, pointsCol, w, x, y, _i, _j;
      w = this.app.getWidth();
      h = this.app.getHeight();
      gridW = w / gridSize;
      gridH = h / gridSize;
      custRnd = CustomRandom(this.getParameter('seed'));
      points = [];
      for (x = _i = 0; 0 <= gridSize ? _i < gridSize : _i > gridSize; x = 0 <= gridSize ? ++_i : --_i) {
        pointsCol = [];
        for (y = _j = 0; 0 <= gridSize ? _j < gridSize : _j > gridSize; y = 0 <= gridSize ? ++_j : --_j) {
          pointsCol.push({
            x: Math.ceil(x * gridW + custRnd.next01() * gridW),
            y: Math.ceil(y * gridH + custRnd.next01() * gridH)
          });
        }
        points.push(pointsCol);
      }
      return points;
    };

    return CellAction;

  })(Webbzeug.Action);

  /*
    OLD APPROACH
  */


  /*
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
  */


}).call(this);
