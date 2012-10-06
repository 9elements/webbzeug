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

  var PixelsAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Pixels = PixelsAction = (function(_super) {

    __extends(PixelsAction, _super);

    function PixelsAction() {
      return PixelsAction.__super__.constructor.apply(this, arguments);
    }

    PixelsAction.prototype.availableParameters = function() {
      return {
        seed: {
          name: 'Seed',
          type: 'number',
          min: 0,
          max: 255,
          "default": Math.round(Math.random() * 255)
        }
      };
    };

    PixelsAction.prototype.render = function(contexts) {
      var custRnd, i, imageData, index, rand, _i, _ref2;
      PixelsAction.__super__.render.call(this);
      imageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      custRnd = CustomRandom(this.getParameter('seed'));
      for (i = _i = 0, _ref2 = imageData.data.length / 4; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        rand = custRnd.next() / Math.pow(2, 50);
        rand = rand * 255;
        index = i << 2;
        imageData.data[index] = rand;
        imageData.data[index + 1] = rand;
        imageData.data[index + 2] = rand;
        imageData.data[index + 3] = 255;
      }
      this.context.putImageData(imageData, 0, 0);
      return this.context;
    };

    return PixelsAction;

  })(Webbzeug.Action);

}).call(this);
