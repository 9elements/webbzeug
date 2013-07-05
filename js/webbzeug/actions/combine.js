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
        errors.push('Combine needs at least 2 inputs.');
      }
      return {
        warnings: warnings,
        errors: errors
      };
    };

    CombineAction.prototype.createCombineMaterial = function() {
      switch (this.getParameter('type')) {
        case 'darken':
          return this.combineMaterial = new THREE.ShaderMaterial(THREE.DarkenShader);
        case 'lighten':
          return this.combineMaterial = new THREE.ShaderMaterial(THREE.LightenShader);
        case 'multiply':
          return this.combineMaterial = new THREE.ShaderMaterial(THREE.MulShader);
        case 'add':
          return this.combineMaterial = new THREE.ShaderMaterial(THREE.AddShader);
        case 'substract':
          return this.combineMaterial = new THREE.ShaderMaterial(THREE.SubShader);
        case 'divide':
          return this.combineMaterial = new THREE.ShaderMaterial(THREE.DivShader);
      }
    };

    CombineAction.prototype.render = function(inputs) {
      var i, useRenderTargetAsBuffer, _i, _ref2;
      CombineAction.__super__.render.call(this);
      if (inputs.length < 2) {
        return false;
      }
      this.createCombineMaterial();
      this.screenAlignedQuadMesh.material = this.combineMaterial;
      if (inputs.length > 2) {
        this.createTempTarget();
      }
      useRenderTargetAsBuffer = inputs.length % 2 === 0;
      console.log(useRenderTargetAsBuffer);
      this.combineMaterial.uniforms['input1'].value = inputs[0];
      for (i = _i = 1, _ref2 = inputs.length; 1 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 1 <= _ref2 ? ++_i : --_i) {
        console.log(i);
        this.combineMaterial.uniforms['input2'].value = inputs[i];
        if (useRenderTargetAsBuffer) {
          this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.renderTarget, false);
          this.combineMaterial.uniforms['input1'].value = this.renderTarget;
          console.log('renderTarget');
        } else {
          this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.tempTarget, false);
          this.combineMaterial.uniforms['input1'].value = this.tempTarget;
          console.log('tempTarget');
        }
        useRenderTargetAsBuffer = !useRenderTargetAsBuffer;
      }
      return this.renderTarget;
    };

    return CombineAction;

  })(Webbzeug.Action);

}).call(this);
