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

    LightAction.prototype.name = 'Light';

    LightAction.prototype.availableParameters = function() {
      return {
        eyeX: {
          name: 'Eye X',
          type: 'float',
          min: -1,
          max: 1,
          "default": 0.5,
          scrollPrecision: 0.001
        },
        eyeY: {
          name: 'Eye Y',
          type: 'float',
          min: -1,
          max: 1,
          "default": 0.5,
          scrollPrecision: 0.001
        },
        eyeZ: {
          name: 'Eye Z',
          type: 'float',
          min: -1,
          max: 1,
          "default": 0.5,
          scrollPrecision: 0.001
        },
        lightX: {
          name: 'Light X',
          type: 'float',
          min: -1,
          max: 1,
          "default": 0.5,
          scrollPrecision: 0.001
        },
        lightY: {
          name: 'Light Y',
          type: 'float',
          min: -1,
          max: 1,
          "default": 0.5,
          scrollPrecision: 0.001
        },
        lightZ: {
          name: 'Light Z',
          type: 'float',
          min: -1,
          max: 1,
          "default": 0.5,
          scrollPrecision: 0.001
        },
        power: {
          name: 'Power',
          type: 'integer',
          min: 0.1,
          max: 100,
          "default": 20,
          scrollPrecision: 1
        },
        diffuseColor: {
          name: 'Diffuse',
          type: 'color',
          "default": '#000000'
        },
        reflectionColor: {
          name: 'Reflection',
          type: 'color',
          "default": '#000000'
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

    LightAction.prototype.normalize = function(v) {
      var mag;
      mag = this.magnitude(v.x, v.y, v.z);
      return {
        x: v.x / mag,
        y: v.y / mag,
        z: v.z / mag
      };
    };

    LightAction.prototype.dot = function(v1, v2) {
      return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    };

    LightAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length < 2) {
        errors.push('Light needs exactly 2 inputs.');
      }
      if (contexts.length > 2) {
        warnings.push('Light will only use the first 2 inputs.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    LightAction.prototype.render = function(contexts) {
      var NDotL, RDotV, baseColor, binormal, diffuseColor, diffuseRGB, h, index, inputImageData, light, lightDirection, normal, normalImageData, outputImageData, pixel, power, reflection, reflectionRGB, rowLen, specularColor, tangent, u, uinc, v, view, viewDirection, vinc, w, x, y, _i, _j;
      LightAction.__super__.render.call(this);
      if (contexts.length === 0) {
        console.log("Dude a light needs an input");
        return;
      }
      diffuseRGB = Webbzeug.Utilities.getRgb2(this.getParameter('diffuseColor'));
      diffuseRGB = {
        r: diffuseRGB[0],
        g: diffuseRGB[1],
        b: diffuseRGB[2]
      };
      reflectionRGB = Webbzeug.Utilities.getRgb2(this.getParameter('reflectionColor'));
      reflectionRGB = {
        r: reflectionRGB[0],
        g: reflectionRGB[1],
        b: reflectionRGB[2]
      };
      inputImageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      normalImageData = contexts[1].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      outputImageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      w = this.app.getWidth();
      h = this.app.getHeight();
      power = parseInt(this.getParameter('power')) / 100;
      normal = {
        x: 0,
        y: 0,
        z: 1
      };
      binormal = {
        x: 0,
        y: -1,
        z: 0
      };
      tangent = {
        x: -1,
        y: 0,
        z: 0
      };
      uinc = 2 / w;
      vinc = 2 / h;
      u = -1;
      v = -1;
      for (x = _i = 0; 0 <= w ? _i < w : _i > w; x = 0 <= w ? ++_i : --_i) {
        for (y = _j = 0; 0 <= h ? _j < h : _j > h; y = 0 <= h ? ++_j : --_j) {
          rowLen = w << 2;
          index = (x << 2) + y * rowLen;
          light = {
            x: parseFloat(this.getParameter('lightX')) - u,
            y: parseFloat(this.getParameter('lightY')) - v,
            z: parseFloat(this.getParameter('lightZ'))
          };
          view = {
            x: parseFloat(this.getParameter('eyeX')) - u,
            y: parseFloat(this.getParameter('eyeY')) - v,
            z: parseFloat(this.getParameter('eyeZ'))
          };
          lightDirection = this.normalize({
            x: this.dot(tangent, light),
            y: this.dot(binormal, light),
            z: this.dot(normal, light)
          });
          viewDirection = this.normalize({
            x: this.dot(tangent, view),
            y: this.dot(binormal, view),
            z: this.dot(normal, view)
          });
          pixel = this.normalize({
            x: (normalImageData.data[index] / 127) - 1,
            y: (normalImageData.data[index + 1] / 127) - 1,
            z: (normalImageData.data[index + 2] / 127) - 1
          });
          NDotL = this.dot(pixel, lightDirection);
          reflection = this.normalize({
            x: ((pixel.x * 2) * NDotL) - lightDirection.x,
            y: ((pixel.y * 2) * NDotL) - lightDirection.y,
            z: ((pixel.z * 2) * NDotL) - lightDirection.z
          });
          RDotV = Math.max(0, this.dot(reflection, viewDirection));
          baseColor = {
            r: inputImageData.data[index] / 255,
            g: inputImageData.data[index + 1] / 255,
            b: inputImageData.data[index + 2] / 255
          };
          diffuseColor = {
            r: NDotL * baseColor.r * diffuseRGB.r / 255,
            g: NDotL * baseColor.g * diffuseRGB.g / 255,
            b: NDotL * baseColor.b * diffuseRGB.b / 255
          };
          specularColor = Math.pow(RDotV, power);
          outputImageData.data[index] = Math.max(0, Math.min((0.5 * baseColor.r + diffuseColor.r + specularColor * reflectionRGB.r / 255) * 255, 255));
          outputImageData.data[index + 1] = Math.max(0, Math.min((0.5 * baseColor.g + diffuseColor.g + specularColor * reflectionRGB.g / 255) * 255, 255));
          outputImageData.data[index + 2] = Math.max(0, Math.min((0.5 * baseColor.b + diffuseColor.b + specularColor * reflectionRGB.b / 255) * 255, 255));
          outputImageData.data[index + 3] = 255;
          v += vinc;
        }
        v = 0;
        u += uinc;
      }
      this.context.putImageData(outputImageData, 0, 0);
      return this.context;
    };

    return LightAction;

  })(Webbzeug.Action);

}).call(this);
