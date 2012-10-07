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

    RotoZoomAction.prototype.render = function(contexts) {
      var angle, d, index, inputImageData, m00, m01, m10, m11, m20, m21, newHeight, newWidth, outputImageData, rotangle, sx, sy, tx, txs, ty, tys, u, v, x, xs, y, ys, _i, _j;
      RotoZoomAction.__super__.render.call(this);
      if (contexts.length === 0) {
        console.log("Dude an inverter needs an input");
        return;
      }
      inputImageData = contexts[0].getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      outputImageData = this.context.getImageData(0, 0, this.app.getWidth(), this.app.getHeight());
      sx = 1;
      sy = 1;
      xs = this.app.getWidth();
      ys = this.app.getHeight();
      tx = 1;
      ty = 1;
      angle = 0;
      newWidth = xs;
      newHeight = ys;
      txs = xs;
      tys = ys;
      d = 0;
      rotangle = angle * 2 * Math.PI;
      m00 = Math.cos(rotangle) * 0x10000 * xs / (sx * txs);
      m01 = Math.sin(rotangle) * 0x10000 * ys / (sx * txs);
      m10 = -Math.sin(rotangle) * 0x10000 * xs / (sy * tys);
      m11 = Math.cos(rotangle) * 0x10000 * ys / (sy * tys);
      m20 = tx * xs * 0x10000 - (txs * m00 + tys * m10) / 2;
      m21 = ty * ys * 0x10000 - (txs * m01 + tys * m11) / 2;
      for (y = _i = 0; 0 <= tys ? _i < tys : _i > tys; y = 0 <= tys ? ++_i : --_i) {
        u = y * m10 + m20;
        v = y * m11 + m21;
        for (x = _j = 0; 0 <= txs ? _j < txs : _j > txs; x = 0 <= txs ? ++_j : --_j) {
          index = u * 4 + v * this.app.getWidth();
          console.log(u, v);
          outputImageData.data[d] = inputImageData.data[index];
          outputImageData.data[d + 1] = inputImageData.data[index + 1];
          outputImageData.data[d + 2] = inputImageData.data[index + 2];
          outputImageData.data[d + 3] = 255;
          u += m00;
          v += m01;
          d += 4;
        }
      }
      outputImageData.data[d] = 255;
      outputImageData.data[d + 1] = 255;
      outputImageData.data[d + 2] = 255;
      outputImageData.data[d + 3] = 255;
      this.context.putImageData(outputImageData, 0, 0);
      return this.context;
    };

    return RotoZoomAction;

  })(Webbzeug.Action);

  /*
  GenBitmap * __stdcall Bitmap_Rotate(GenBitmap *bm,sF32 angle,sF32 sx,sF32 sy,sF32 tx,sF32 ty,sInt border,sInt newWidth,sInt newHeight)
  {
    NOTEXTURES1(bm);
  
    GenBitmap *in;
    sInt x,y;
    sU16 *d;
    sU64 *mem;
    sInt xs,ys;
    sInt txs,tys;
    sInt m00,m01,m10,m11,m20,m21;
    sF32 rotangle;
    BilinearContext ctx;
  
    if(sFAbs(sx) < 1.0f/32768.0f) sx = 1.0f/32768.0f;
    if(sFAbs(sy) < 1.0f/32768.0f) sy = 1.0f/32768.0f;
  
    if(CheckBitmap(bm,&in)) return 0;
  
  // prepare
    xs = bm->XSize;
    ys = bm->YSize;
    txs = newWidth ? 1 << (newWidth - 1 + GenBitmapTextureSizeOffset) : xs;
    tys = newHeight ? 1 << (newHeight - 1 + GenBitmapTextureSizeOffset) : ys;
    mem = new sU64[txs * tys];
    d = (sU16 *)mem;
  
  // rotate
  
    rotangle = angle*sPI2F;
  
    m00 = sFtol( sFCos(rotangle)*0x10000*xs/(sx*txs));
    m01 = sFtol( sFSin(rotangle)*0x10000*ys/(sx*txs));
    m10 = sFtol(-sFSin(rotangle)*0x10000*xs/(sy*tys));
    m11 = sFtol( sFCos(rotangle)*0x10000*ys/(sy*tys));
    m20 = sFtol( tx*xs*0x10000 - (txs*m00+tys*m10)/2);
    m21 = sFtol( ty*ys*0x10000 - (txs*m01+tys*m11)/2);
    BilinearSetup(&ctx,in->Data,xs,ys,border);
  
    for(y=0;y<tys;y++)
    {
      sInt u = y*m10+m20;
      sInt v = y*m11+m21;
  
      for(x=0;x<txs;x++)
      {
        BilinearFilter(&ctx,(sU64 *)d,u,v);
        u += m00;
        v += m01;
        d += 4;
      }
    }
  
    delete[] bm->Data;
    bm->XSize = txs;
    bm->YSize = tys;
    bm->Size = txs*tys;
    bm->Data = mem;
  
    return bm;
  }
  */


}).call(this);
