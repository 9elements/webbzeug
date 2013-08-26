(function() {
  var RangeAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Range = RangeAction = (function(_super) {

    __extends(RangeAction, _super);

    function RangeAction() {
      return RangeAction.__super__.constructor.apply(this, arguments);
    }

    RangeAction.prototype.type = 'color';

    RangeAction.prototype.name = 'Color';

    RangeAction.prototype.availableParameters = function() {
      return {
        minColor: {
          name: 'MinColor',
          type: 'color',
          "default": 'rgba(0,0,0,1)'
        },
        maxColor: {
          name: 'MaxColor',
          type: 'color',
          "default": 'rgba(255,255,255,1)'
        }
      };
    };

    RangeAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Range will only use one input.');
      }
      if (contexts.length < 1) {
        errors.push('Range needs exactly one input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    RangeAction.prototype.render = function(inputs) {
      var colorRGB;
      RangeAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.rangeMaterial = new THREE.ShaderMaterial(THREE.RangeShader);
        this.screenAlignedQuadMesh.material = this.rangeMaterial;
      }
      colorRGB = Webbzeug.Utilities.getRgb2(this.getParameter('minColor'));
      this.rangeMaterial.uniforms["lowerR"].value = colorRGB[0] / 255.0;
      this.rangeMaterial.uniforms["lowerG"].value = colorRGB[1] / 255.0;
      this.rangeMaterial.uniforms["lowerB"].value = colorRGB[2] / 255.0;
      colorRGB = Webbzeug.Utilities.getRgb2(this.getParameter('maxColor'));
      this.rangeMaterial.uniforms["upperR"].value = colorRGB[0] / 255.0;
      this.rangeMaterial.uniforms["upperG"].value = colorRGB[1] / 255.0;
      this.rangeMaterial.uniforms["upperB"].value = colorRGB[2] / 255.0;
      this.rangeMaterial.uniforms['input1'].value = inputs[0];
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return RangeAction;

  })(Webbzeug.Action);

}).call(this);
