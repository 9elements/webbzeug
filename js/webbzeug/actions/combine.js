(function() {
  var CombineAction, _base, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  if ((_ref1 = (_base = window.Webbzeug).Actions) == null) {
    _base.Actions = {};
  }

  window.Webbzeug.Actions.Combine = CombineAction = (function(_super) {

    __extends(CombineAction, _super);

    function CombineAction() {
      return CombineAction.__super__.constructor.apply(this, arguments);
    }

    CombineAction.prototype.type = 'combine';

    CombineAction.prototype.name = 'Combine';

    CombineAction.prototype.availableParameters = function() {
      return {
        type: {
          name: 'Type',
          type: 'enum',
          values: {
            darken: 'Darken',
            lighten: 'Lighten',
            multiply: 'Multiply',
            add: 'Add',
            substract: 'Substract',
            divide: 'Divide'
          },
          "default": 'add'
        }
      };
    };

    CombineAction.prototype.validations = function(contexts) {
      var errors, warnings;
      errors = [];
      warnings = [];
      if (contexts.length < 2) {
        errors.push('Combine needs exactly 2 inputs.');
      }
      if (contexts.length > 2) {
        warnings.push('Combine will only use the first 2 inputs.');
      }
      return {
        warnings: warnings,
        errors: errors
      };
    };

    CombineAction.prototype.render = function(inputs) {
      CombineAction.__super__.render.call(this);
      if (inputs.length < 2) {
        console.log('A combine needs at least 2 inputs!');
        return false;
      }
      switch (this.getParameter('type')) {
        case 'darken':
          this.combineMaterial = new THREE.ShaderMaterial(THREE.DarkenShader);
          break;
        case 'lighten':
          this.combineMaterial = new THREE.ShaderMaterial(THREE.LightenShader);
          break;
        case 'multiply':
          this.combineMaterial = new THREE.ShaderMaterial(THREE.MulShader);
          break;
        case 'add':
          this.combineMaterial = new THREE.ShaderMaterial(THREE.AddShader);
          break;
        case 'substract':
          this.combineMaterial = new THREE.ShaderMaterial(THREE.SubShader);
          break;
        case 'divide':
          this.combineMaterial = new THREE.ShaderMaterial(THREE.DivShader);
      }
      this.screenAlignedQuadMesh.material = this.combineMaterial;
      this.combineMaterial.uniforms['input1'].value = inputs[0];
      this.combineMaterial.uniforms['input2'].value = inputs[1];
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, true);
      /*
          # Take first image, draw it to the action context
          imageData = contexts[0].getImageData 0, 0, @app.getWidth(), @app.getHeight()
          @context.putImageData imageData, 0, 0
      
          # Go though all other contexts and apply blend mode
          for i in [1...contexts.length]
            applyingContext = contexts[i]
      
            switch @getParameter('type')
              when 'darken'
                @darken applyingContext
              when 'lighten'
                @lighten applyingContext
              when 'multiply'
                @multiply applyingContext
              when 'add'
                @add applyingContext
              when 'substract'
                @substract applyingContext
              when 'divide'
                @divide applyingContext
      */

      return this.renderTarget;
    };

    return CombineAction;

  })(Webbzeug.Action);

}).call(this);
