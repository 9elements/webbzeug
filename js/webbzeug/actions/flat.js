(function() {
  var FlatAction, _base, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (window.Webbzeug == null) {
    window.Webbzeug = {};
  }

  if ((_base = window.Webbzeug).Actions == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Flat = FlatAction = (function(_super) {
    __extends(FlatAction, _super);

    function FlatAction() {
      _ref = FlatAction.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlatAction.prototype.type = 'flat';

    FlatAction.prototype.name = 'Flat';

    FlatAction.prototype.availableParameters = function() {
      return {
        color: {
          name: 'Color',
          type: 'color',
          "default": 'rgba(255,0,0,1)'
        }
      };
    };

    FlatAction.prototype.validations = function(contexts) {
      var warnings;
      warnings = [];
      if (contexts.length > 0) {
        warnings.push('Flat uses not input at all');
      }
      return {
        warnings: warnings
      };
    };

    FlatAction.prototype.render = function(inputs) {
      var colorRGB;
      FlatAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.flatMaterial = new THREE.ShaderMaterial(THREE.FlatShader);
        this.screenAlignedQuadMesh.material = this.flatMaterial;
      }
      colorRGB = Webbzeug.Utilities.getRgb2(this.getParameter('color'));
      this.flatMaterial.uniforms["r"].value = colorRGB[0] / 255.0;
      this.flatMaterial.uniforms["g"].value = colorRGB[1] / 255.0;
      this.flatMaterial.uniforms["b"].value = colorRGB[2] / 255.0;
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return FlatAction;

  })(Webbzeug.Action);

}).call(this);
