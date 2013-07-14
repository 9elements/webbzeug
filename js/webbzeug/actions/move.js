(function() {
  var MoveAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Move = MoveAction = (function(_super) {

    __extends(MoveAction, _super);

    function MoveAction() {
      return MoveAction.__super__.constructor.apply(this, arguments);
    }

    MoveAction.prototype.type = 'move';

    MoveAction.prototype.name = 'Move';

    MoveAction.prototype.availableParameters = function() {
      return {
        scrollX: {
          name: 'Scroll X',
          type: 'integer',
          min: -255,
          max: 255,
          "default": 0,
          step: 1,
          scrollPrecision: 1
        },
        scrollY: {
          name: 'Scroll Y',
          type: 'integer',
          min: -255,
          max: 255,
          "default": 0,
          step: 1,
          scrollPrecision: 1
        }
      };
    };

    MoveAction.prototype.validations = function(contexts) {
      var errors, warnings;
      warnings = [];
      errors = [];
      if (contexts.length > 1) {
        warnings.push('Move will only use the first input.');
      }
      if (contexts.length < 1) {
        errors.push('Move needs exactly one input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    MoveAction.prototype.setUniforms = function() {
      var x, y;
      x = parseInt(this.getParameter('scrollX'));
      x /= -255.0;
      this.moveMaterial.uniforms['x'].value = x;
      y = parseInt(this.getParameter('scrollY'));
      y /= 255.0;
      return this.moveMaterial.uniforms['y'].value = y;
    };

    MoveAction.prototype.render = function(inputs) {
      MoveAction.__super__.render.call(this);
      if (!(this.moveMaterial != null)) {
        this.moveMaterial = new THREE.ShaderMaterial(THREE.MoveShader);
      }
      this.screenAlignedQuadMesh.material = this.moveMaterial;
      this.moveMaterial.uniforms['input1'].value = inputs[0];
      this.setUniforms();
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return MoveAction;

  })(Webbzeug.Action);

}).call(this);
