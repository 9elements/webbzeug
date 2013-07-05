(function() {
  var MirrorAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Mirror = MirrorAction = (function(_super) {

    __extends(MirrorAction, _super);

    function MirrorAction() {
      return MirrorAction.__super__.constructor.apply(this, arguments);
    }

    MirrorAction.prototype.type = 'mirror';

    MirrorAction.prototype.name = 'Mirror';

    MirrorAction.prototype.availableParameters = function() {
      return {
        direction: {
          name: "Direction",
          type: 'enum',
          values: {
            vertical: 'Vertical',
            horizontal: 'Horizontal'
          },
          "default": 'horizontal'
        }
      };
    };

    MirrorAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Mirror will only use the first input.');
      }
      if (contexts.length < 1) {
        errors.push('Mirror needs exactly 1 input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    MirrorAction.prototype.render = function(inputs) {
      MirrorAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.mirrorMaterial = new THREE.ShaderMaterial(THREE.MirrorShader);
        console.log('HERE SEE MY MATERIAL ', this.mirrorMaterial);
        this.screenAlignedQuadMesh.material = this.mirrorMaterial;
      }
      if (this.getParameter('direction') === 'horizontal') {
        this.mirrorMaterial.uniforms['mode'].value = 0.0;
      } else {
        this.mirrorMaterial.uniforms['mode'].value = 1.0;
      }
      this.mirrorMaterial.uniforms['input1'].value = inputs[0];
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return MirrorAction;

  })(Webbzeug.Action);

}).call(this);
