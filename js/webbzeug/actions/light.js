(function() {
  var LightAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Light = LightAction = (function(_super) {

    __extends(LightAction, _super);

    function LightAction() {
      return LightAction.__super__.constructor.apply(this, arguments);
    }

    LightAction.prototype.type = 'light';

    LightAction.prototype.availableParameters = function() {
      return {
        eyeX: {
          name: 'eye X',
          type: 'number',
          min: 0,
          max: 256,
          "default": 128
        },
        eyeY: {
          name: 'eye Y',
          type: 'number',
          min: 0,
          max: 256,
          "default": 128
        },
        eyeZ: {
          name: 'eye Z',
          type: 'number',
          min: 0,
          max: 256,
          "default": 128
        },
        lightX: {
          name: 'light X',
          type: 'number',
          min: 0,
          max: 256,
          "default": 20
        },
        lightY: {
          name: 'light Y',
          type: 'number',
          min: 0,
          max: 256,
          "default": 20
        },
        lightZ: {
          name: 'light Z',
          type: 'number',
          min: 0,
          max: 256,
          "default": 20
        },
        power: {
          name: 'power',
          type: 'number',
          min: 0,
          max: 256,
          "default": 20
        }
      };
    };

    LightAction.prototype.magnitude = function(x, y, z) {
      var len;
      x *= x;
      y *= y;
      z *= z;
      len = x + y + z;
      return Math.sqrt(len);
    };

    LightAction.prototype.dot = function(x1, y1, z1, x2, y2, z2) {
      return x1 * x2 + y1 * y2 + z1 * z2;
    };

    LightAction.prototype.render = function(contexts) {
      var eyeLen, eyeX, eyeY, eyeZ, h, i, index, inputImageData, lightLen, lightX, lightY, lightZ, nDotL, normalImageData, normalLen, normalX, normalY, normalZ, outputImageData, power, rDotV, reflectionLen, reflectionX, reflectionY, reflectionZ, rowLen, totalSpecular, u, uinc, v, vinc, w, x, y, _i, _j, _k;
      LightAction.__super__.render.call(this);
      if (contexts.length === 0) {
        console.log("Dude a light needs an input");
        return;
      }
      inputImageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      normalImageData = contexts[1].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      outputImageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      w = this.app.getWidth();
      h = this.app.getHeight();
      power = parseInt(this.getParameter('power') / 100);
      uinc = 1 / w;
      vinc = 1 / h;
      u = 0;
      v = 0;
      for (x = _i = 0; 0 <= w ? _i < w : _i > w; x = 0 <= w ? ++_i : --_i) {
        for (y = _j = 0; 0 <= h ? _j < h : _j > h; y = 0 <= h ? ++_j : --_j) {
          rowLen = w << 2;
          index = (x << 2) + y * rowLen;
          lightX = (parseInt(this.getParameter('lightX') - 127)) / 255 - uinc;
          lightY = -1 * ((parseInt(this.getParameter('lightY') - 127)) / 255 - vinc);
          lightZ = -1 * ((parseInt(this.getParameter('lightZ') - 127)) / 255);
          lightLen = this.magnitude(lightX, lightY, lightZ);
          lightX /= lightLen;
          lightY /= lightLen;
          lightZ /= lightLen;
          eyeX = (parseInt(this.getParameter('eyeX') - 127)) / 255 - uinc;
          eyeY = -1 * ((parseInt(this.getParameter('eyeY') - 127)) / 255 - vinc);
          eyeZ = -1 * ((parseInt(this.getParameter('eyeZ') - 127)) / 255);
          eyeLen = this.magnitude(eyeX, eyeY, eyeZ);
          eyeX /= eyeLen;
          eyeY /= eyeLen;
          eyeZ /= eyeLen;
          normalX = (normalImageData.data[index] / 127) - 1;
          normalY = (normalImageData.data[index + 1] / 127) - 1;
          normalZ = (normalImageData.data[index + 2] / 127) - 1;
          normalLen = this.magnitude(normalX, normalY, normalZ);
          normalX /= normalLen;
          normalY /= normalLen;
          normalZ /= normalLen;
          nDotL = this.dot(normalX, normalY, normalZ, lightX, lightY, lightZ);
          reflectionX = (2 * normalX * nDotL) - lightX;
          reflectionY = (2 * normalY * nDotL) - lightY;
          reflectionZ = (2 * normalZ * nDotL) - lightZ;
          reflectionLen = this.magnitude(reflectionX, reflectionY, reflectionZ);
          reflectionX /= reflectionLen;
          reflectionY /= reflectionLen;
          reflectionZ /= reflectionLen;
          rDotV = this.dot(reflectionX, reflectionY, reflectionZ, eyeX, eyeY, eyeZ);
          rDotV = Math.max(rDotV);
          totalSpecular = Math.pow(rDotV, power);
          totalSpecular *= 255;
          u += uinc;
          v += vinc;
          for (i = _k = 0; _k < 3; i = ++_k) {
            outputImageData.data[index + i] = Math.min(inputImageData.data[index + i] + totalSpecular + inputImageData.data[index + i] * nDotL, 255);
          }
          outputImageData.data[index + 3] = 255;
        }
      }
      this.context.putImageData(outputImageData, 0, 0);
      return this.context;
    };

    return LightAction;

  })(Webbzeug.Action);

}).call(this);
