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

    RotoZoomAction.prototype.name = 'Rotozoom';

    RotoZoomAction.prototype.availableParameters = function() {
      return {
        rotation: {
          name: 'Rotation',
          type: 'float',
          min: 0,
          max: Math.PI * 2,
          "default": 0,
          scrollPrecision: 0.01
        },
        zoom: {
          name: 'Zoom',
          type: 'float',
          min: 1,
          max: 255,
          "default": 10,
          scrollPrecision: 1
        }
      };
    };

    RotoZoomAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length > 1) {
        warnings.push('Rotozoom will only use one input.');
      }
      if (contexts.length < 1) {
        errors.push('Rotozoom needs one input.');
      }
      return {
        errors: errors,
        warnings: warnings
      };
    };

    RotoZoomAction.prototype.setUniforms = function() {
      var rotation, zoom;
      rotation = this.getParameter('rotation');
      this.rotozoomMaterial.uniforms['rotation'].value = rotation;
      zoom = this.getParameter('zoom');
      return this.rotozoomMaterial.uniforms['zoom'].value = zoom / 10.0;
    };

    RotoZoomAction.prototype.render = function(inputs) {
      RotoZoomAction.__super__.render.call(this);
      if (this.screenAlignedQuadMesh.material === null) {
        this.rotozoomMaterial = new THREE.ShaderMaterial(THREE.RotoZoomShader);
        this.screenAlignedQuadMesh.material = this.rotozoomMaterial;
      }
      this.rotozoomMaterial.uniforms['input1'].value = inputs[0];
      this.setUniforms();
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      return this.renderTarget;
    };

    return RotoZoomAction;

  })(Webbzeug.Action);

}).call(this);
