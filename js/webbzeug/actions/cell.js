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
          max: 64,
          "default": 2
        }
      };
    };

    CellAction.prototype.render = function(contexts) {
      var cellX, cellY, dist, gridH, gridSize, gridW, gx, gy, h, imageData, index, maxDist, minDist, ogx, ogy, point, points, px, py, value, w, x, y, _i, _j, _k, _l, _len, _m, _ref2, _ref3, _ref4, _ref5, _ref6;
      CellAction.__super__.render.call(this);
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      gridSize = parseInt(this.getParameter('gridSize'));
      points = this.generatePoints(gridSize);
      gridW = this.app.getWidth() / gridSize;
      gridH = this.app.getHeight() / gridSize;
      w = this.app.getWidth();
      h = this.app.getHeight();
      for (y = _i = 0; 0 <= h ? _i < h : _i > h; y = 0 <= h ? ++_i : --_i) {
        for (x = _j = 0; 0 <= w ? _j < w : _j > w; x = 0 <= w ? ++_j : --_j) {
          index = ((y * w) << 2) + (x << 2);
          cellX = Math.floor(x / gridW);
          cellY = Math.floor(y / gridH);
          maxDist = Math.sqrt(Math.pow(gridW, 2) + Math.pow(gridH, 2)) * 2;
          minDist = maxDist;
          for (gx = _k = _ref2 = cellX - 2, _ref3 = cellX + 2; _ref2 <= _ref3 ? _k < _ref3 : _k > _ref3; gx = _ref2 <= _ref3 ? ++_k : --_k) {
            for (gy = _l = _ref4 = cellY - 2, _ref5 = cellY + 2; _ref4 <= _ref5 ? _l < _ref5 : _l > _ref5; gy = _ref4 <= _ref5 ? ++_l : --_l) {
              ogx = gx;
              ogy = gy;
              if (gx < 0) {
                gx = gridSize + gx;
              }
              if (gx > gridSize - 1) {
                gx = gx - gridSize;
              }
              if (gy < 0) {
                gy = gridSize + gy;
              }
              if (gy > gridSize - 1) {
                gy = gy - gridSize;
              }
              point = points[gx][gy];
              px = point.x;
              py = point.y;
              if (ogx < 0) {
                px -= gridW * gridSize;
              }
              if (ogx > gridSize - 1) {
                px += gridW * gridSize;
              }
              if (ogy < 0) {
                py -= gridH * gridSize;
              }
              if (ogy > gridSize - 1) {
                py += gridH * gridSize;
              }
              dist = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
              minDist = Math.min(dist, minDist);
            }
          }
          value = minDist / maxDist * 255;
          imageData.data[index] = value;
          imageData.data[index + 1] = value;
          imageData.data[index + 2] = value;
          imageData.data[index + 3] = 255;
        }
      }
      _ref6 = _.flatten(points);
      for (_m = 0, _len = _ref6.length; _m < _len; _m++) {
        point = _ref6[_m];
        imageData.data[((point.y * 256) << 2) + (point.x << 2)] = 255;
        imageData.data[((point.y * 256) << 2) + (point.x << 2) + 3] = 255;
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    CellAction.prototype.generatePoints = function(gridSize) {
      var gridH, gridW, h, points, pointsCol, w, x, y, _i, _j;
      w = this.app.getWidth();
      h = this.app.getHeight();
      gridW = this.app.getWidth() / gridSize;
      gridH = this.app.getHeight() / gridSize;
      points = [];
      for (x = _i = 0; 0 <= gridSize ? _i < gridSize : _i > gridSize; x = 0 <= gridSize ? ++_i : --_i) {
        pointsCol = [];
        for (y = _j = 0; 0 <= gridSize ? _j < gridSize : _j > gridSize; y = 0 <= gridSize ? ++_j : --_j) {
          pointsCol.push({
            x: Math.ceil(x * gridW + Math.random() * gridW),
            y: Math.ceil(y * gridH + Math.random() * gridH)
          });
        }
        points.push(pointsCol);
      }
      console.log(points);
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
