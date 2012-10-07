(function() {
  var RotoZoomAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.RotoZoom = RotoZoomAction = (function(_super) {

    __extends(RotoZoomAction, _super);

    function RotoZoomAction() {
      return RotoZoomAction.__super__.constructor.apply(this, arguments);
    }

    RotoZoomAction.prototype.type = 'rotozoom';

    RotoZoomAction.prototype.availableParameters = function() {
      return {
        rotation: {
          name: 'Rotation',
          type: 'number',
          min: 0,
          max: Math.PI * 2,
          "default": 0,
          step: 0.01
        },
        zoom: {
          name: 'Zoom',
          type: 'number',
          min: 1,
          max: 255,
          "default": 10
        }
      };
    };

    RotoZoomAction.prototype.render = function(contexts) {
      var cosrot, cosx, cosy, inputImageData, k, offsetInput, offsetOutput, outputImageData, rotation, sinrot, sinx, siny, x, xsrc, y, ysrc, zoom, _i, _j, _k;
      RotoZoomAction.__super__.render.call(this);
      if (contexts.length === 0) {
        console.log("Dude an inverter needs an input");
        return;
      }
      rotation = this.getParameter('rotation');
      zoom = this.getParameter('zoom') / 10;
      inputImageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      outputImageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      cosrot = Math.cos(rotation) * zoom;
      sinrot = Math.sin(rotation) * zoom;
      for (y = _i = 0; _i < 256; y = ++_i) {
        cosy = cosrot * (y - 128);
        siny = sinrot * (y - 128);
        for (x = _j = 0; _j < 256; x = ++_j) {
          cosx = cosrot * (x - 128);
          sinx = sinrot * (x - 128);
          xsrc = parseInt(cosx - siny - 128) & 255;
          ysrc = parseInt(sinx + cosy - 128) & 255;
          offsetInput = (ysrc << 10) + (xsrc << 2);
          offsetOutput = (y << 10) + (x << 2);
          for (k = _k = 0; _k < 4; k = ++_k) {
            outputImageData.data[offsetOutput + k] = inputImageData.data[offsetInput + k];
          }
        }
      }
      this.context.putImageData(outputImageData, 0, 0);
      return this.context;
    };

    return RotoZoomAction;

  })(Webbzeug.Action);

}).call(this);
