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

    CellAction.prototype.gridX = 8;

    CellAction.prototype.gridY = 8;

    CellAction.prototype.render = function(contexts) {
      var cellX, cellY, dist, gridH, gridW, gx, gy, h, imageData, index, maxDist, minDist, point, points, value, w, x, y, _i, _j, _k, _l, _len, _m, _ref2, _ref3, _ref4, _ref5;
      CellAction.__super__.render.call(this);
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      points = this.generatePoints();
      gridW = this.app.getWidth() / this.gridX;
      gridH = this.app.getHeight() / this.gridY;
      w = this.app.getWidth();
      h = this.app.getHeight();
      for (x = _i = 0; 0 <= w ? _i < w : _i > w; x = 0 <= w ? ++_i : --_i) {
        for (y = _j = 0; 0 <= h ? _j < h : _j > h; y = 0 <= h ? ++_j : --_j) {
          index = ((y * w) << 2) + (x << 2);
          cellX = Math.floor(x / gridW);
          cellY = Math.floor(y / gridH);
          minDist = 255;
          maxDist = Math.sqrt(Math.pow(this.gridX, 2) + Math.pow(this.gridY, 2));
          for (gx = _k = _ref2 = cellX - 1, _ref3 = cellX + 1; _ref2 <= _ref3 ? _k < _ref3 : _k > _ref3; gx = _ref2 <= _ref3 ? ++_k : --_k) {
            for (gy = _l = _ref4 = cellY - 1, _ref5 = cellY + 1; _ref4 <= _ref5 ? _l < _ref5 : _l > _ref5; gy = _ref4 <= _ref5 ? ++_l : --_l) {
              if (gy < 0) {
                gy = this.gridX + gy;
              }
              if (gx < 0) {
                gx = this.gridY + gx;
              }
              point = points[(gy * this.gridX) + gx];
              if (point) {
                dist = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
              } else {
                dist = 10;
              }
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
      for (_m = 0, _len = points.length; _m < _len; _m++) {
        point = points[_m];
        imageData.data[((point.y * 256) << 2) + (point.x << 2)] = 255;
        imageData.data[((point.y * 256) << 2) + (point.x << 2) + 3] = 255;
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    CellAction.prototype.generatePoints = function() {
      var gridH, gridW, h, points, w, x, y, _i, _j, _ref2, _ref3;
      w = this.app.getWidth();
      h = this.app.getHeight();
      gridW = this.app.getWidth() / this.gridX;
      gridH = this.app.getHeight() / this.gridY;
      points = [];
      for (x = _i = 0, _ref2 = this.gridX; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; x = 0 <= _ref2 ? ++_i : --_i) {
        for (y = _j = 0, _ref3 = this.gridY; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; y = 0 <= _ref3 ? ++_j : --_j) {
          points.push({
            x: Math.round(x * gridW + Math.random() * gridW),
            y: Math.round(y * gridH + Math.random() * gridH)
          });
        }
      }
      console.log(points.length);
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
