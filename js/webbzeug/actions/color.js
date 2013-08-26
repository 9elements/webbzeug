(function() {
  var ColorAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Color = ColorAction = (function(_super) {

    __extends(ColorAction, _super);

    function ColorAction() {
      return ColorAction.__super__.constructor.apply(this, arguments);
    }

    ColorAction.prototype.type = 'color';

    ColorAction.prototype.name = 'Color';

    ColorAction.prototype.availableParameters = function() {
      return {
        color: {
          name: 'Color',
          type: 'color',
          "default": 'rgba(255,0,0,1)'
        }
      };
    };

    ColorAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('color will only use one input.');
      }
      if (contexts.length < 1) {
        errors.push('color needs exactly one input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    ColorAction.prototype.render = function(inputs) {
      var colorRGB;
      ColorAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.colorMaterial = new THREE.ShaderMaterial(THREE.ColorShader);
        this.screenAlignedQuadMesh.material = this.colorMaterial;
      }
      colorRGB = Webbzeug.Utilities.getRgb2(this.getParameter('color'));
      this.colorMaterial.uniforms["r"].value = colorRGB[0] / 255.0;
      this.colorMaterial.uniforms["g"].value = colorRGB[1] / 255.0;
      this.colorMaterial.uniforms["b"].value = colorRGB[2] / 255.0;
      this.colorMaterial.uniforms['input1'].value = inputs[0];
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return ColorAction;

  })(Webbzeug.Action);

}).call(this);
