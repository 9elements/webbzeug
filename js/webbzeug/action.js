(function() {
  var Action, _ref;

  if ((_ref = window.Webbzeug) == null) {
    window.Webbzeug = {};
  }

  window.Webbzeug.Action = Action = (function() {

    Action.prototype.width = 3;

    function Action(app, x, y, width, index) {
      var info, parameter, _ref1;
      this.app = app;
      this.x = x;
      this.y = y;
      this.width = width;
      this.index = index;
      this.children = [];
      this.parent = null;
      this.needsUpdate = true;
      this.parameters = {};
      _ref1 = this.availableParameters();
      for (parameter in _ref1) {
        info = _ref1[parameter];
        this.parameters[parameter] = info["default"];
      }
      this.createRenderTarget();
    }

    Action.prototype.createRenderTarget = function() {
      var height, parameters, width;
      width = this.app.textureSize || 1;
      height = this.app.textureSize || 1;
      parameters = {
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false
      };
      this.renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);
      this.screenAlignedQuadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);
      this.renderToTextureScene = new THREE.Scene();
      return this.renderToTextureScene.add(this.screenAlignedQuadMesh);
    };

    Action.prototype.createTempTarget = function() {
      var height, parameters, width;
      if (this.tempTarget != null) {
        return;
      }
      width = this.app.textureSize || 1;
      height = this.app.textureSize || 1;
      parameters = {
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false
      };
      return this.tempTarget = new THREE.WebGLRenderTarget(width, height, parameters);
    };

    Action.prototype.availableParameters = function() {
      return {};
    };

    Action.prototype.validations = function() {
      return {};
    };

    /*
      this is called from the tree renderer
    */


    Action.prototype.doRender = function(textures) {
      var valid, _ref1, _ref2;
      valid = this.validations(textures);
      if (((_ref1 = valid.warnings) != null ? _ref1.length : void 0) > 0) {
        this.app.displayWarnings(this, valid.warnings);
      } else {
        this.app.removeWarnings(this);
      }
      if (((_ref2 = valid.errors) != null ? _ref2.length : void 0) > 0) {
        this.app.displayErrors(this, valid.errors);
        return false;
      } else {
        this.app.removeErrors(this);
      }
      if (this.willRender()) {
        this.render(textures);
      }
      return this.renderTarget;
    };

    Action.prototype.render = function(textures) {
      return this.needsUpdate = false;
    };

    Action.prototype.willRender = function() {
      return this.needsUpdate;
    };

    Action.prototype.deleteChildren = function() {
      return this.children = [];
    };

    Action.prototype.addChild = function(child) {
      return this.children.push(child);
    };

    Action.prototype.getParameter = function(parameter) {
      return this.parameters[parameter];
    };

    Action.prototype.setParameter = function(parameter, value) {
      this.parameters[parameter] = value;
      this.needsUpdate = true;
      this.app.buildTree();
      this.app.updateParentsRecursively(this);
      return this.setCaption(this.caption());
    };

    Action.prototype.setCaption = function(caption) {
      return this.element.find('.wrapper').contents().first().get(0).data = caption || this.caption();
    };

    Action.prototype.caption = function() {
      return this.name;
    };

    Action.prototype.clearTempTarget = function() {
      var flatMaterial, oldMaterial;
      oldMaterial = this.screenAlignedQuadMesh.material;
      flatMaterial = new THREE.ShaderMaterial(THREE.FlatShader);
      this.screenAlignedQuadMesh.material = flatMaterial;
      flatMaterial.uniforms["r"].value = 0;
      flatMaterial.uniforms["g"].value = 0;
      flatMaterial.uniforms["b"].value = 0;
      this.app.renderer.render(this.renderToTextureScene, this.app.renderToTextureCamera, this.tempTarget, true);
      return this.screenAlignedQuadMesh.material = oldMaterial;
    };

    Action.prototype.createCanvas = function() {
      this.canvas = $('<canvas>').get(0);
      this.canvas.width = this.app.textureSize;
      this.canvas.height = this.app.textureSize;
      return this.context = this.canvas.getContext("2d");
    };

    return Action;

  })();

}).call(this);
