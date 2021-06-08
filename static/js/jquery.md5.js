/*
*
*  jQuery MD5 Plugin
*
*  string jQuery.MD5( string )
*  input string and return string
*  The $.MD5() function convert string to MD5
*
*  (c) 2012 Winai Reungjam
*  licensed under the MIT licenses.
*
*  This function orginally get from the WebToolkit and rewrite for using as the jQuery plugin.
*  MD5 (Message-Digest Algorithm)
*  http://www.webtoolkit.info/
*
*/

(function($) {
  var MD5;
  MD5 = function(string) {
    var AA, AddUnsigned, BB, CC, ConvertToWordArray, DD, F, FF, G, GG, H, HH, I, II, RotateLeft, S11, S12, S13, S14, S21, S22, S23, S24, S31, S32, S33, S34, S41, S42, S43, S44, Utf8Encode, WordToHex, a, b, c, d, k, temp, x;
    RotateLeft = function(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };
    AddUnsigned = function(lX, lY) {
      var lResult, lX4, lX8, lY4, lY8;
      lX8 = lX & 0x80000000;
      lY8 = lY & 0x80000000;
      lX4 = lX & 0x40000000;
      lY4 = lY & 0x40000000;
      lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
      if (lX4 & lY4) {
        return lResult ^ 0x80000000 ^ lX8 ^ lY8;
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
        } else {
          return lResult ^ 0x40000000 ^ lX8 ^ lY8;
        }
      } else {
        return lResult ^ lX8 ^ lY8;
      }
    };
    F = function(x, y, z) {
      return (x & y) | ((~x) & z);
    };
    G = function(x, y, z) {
      return (x & z) | (y & (~z));
    };
    H = function(x, y, z) {
      return x ^ y ^ z;
    };
    I = function(x, y, z) {
      return y ^ (x | (~z));
    };
    FF = function(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };
    GG = function(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };
    HH = function(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };
    II = function(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };
    ConvertToWordArray = function(string) {
      var lByteCount, lBytePosition, lMessageLength, lNumberOfWords, lNumberOfWords_temp1, lNumberOfWords_temp2, lWordArray, lWordCount;
      lMessageLength = string.length;
      lNumberOfWords_temp1 = lMessageLength + 8;
      lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      lWordArray = Array(lNumberOfWords - 1);
      lBytePosition = 0;
      lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    };
    WordToHex = function(lValue) {
      var WordToHexValue, WordToHexValue_temp, lByte, lCount;
      WordToHexValue = "";
      WordToHexValue_temp = "";
      lCount = 0;
      while (lCount <= 3) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        lCount++;
      }
      return WordToHexValue;
    };
    Utf8Encode = function(string) {
      var c, n, utftext;
      string = string.replace(/\r\n/g, "\n");
      utftext = "";
      n = 0;
      while (n < string.length) {
        c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        n++;
      }
      return utftext;
    };
    x = Array();
    S11 = 7;
    S12 = 12;
    S13 = 17;
    S14 = 22;
    S21 = 5;
    S22 = 9;
    S23 = 14;
    S24 = 20;
    S31 = 4;
    S32 = 11;
    S33 = 16;
    S34 = 23;
    S41 = 6;
    S42 = 10;
    S43 = 15;
    S44 = 21;
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    k = 0;
    while (k < x.length) {
      AA = a;
      BB = b;
      CC = c;
      DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
      d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
      b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
      d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
      c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
      b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
      d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
      b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
      d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
      c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
      b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
      a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
      d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
      c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
      b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
      d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
      b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
      d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
      c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
      b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
      a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
      d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
      b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
      a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
      d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
      c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
      b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
      a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
      d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
      c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
      b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
      d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
      c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
      b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
      d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
      c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
      b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
      a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
      d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
      c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
      b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
      d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
      c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
      b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
      d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
      c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
      b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
      a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
      d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
      c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
      b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
      a = AddUnsigned(a, AA);
      b = AddUnsigned(b, BB);
      c = AddUnsigned(c, CC);
      d = AddUnsigned(d, DD);
      k += 16;
    }
    temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase();
  };
  return $.extend({
    MD5: MD5
  });
})(jQuery);

/**
 * @下拉刷新
 */
(function(){
  
  var isValid = false,  
    isTouching = false, 
    isEfec = false, 
    isRefresh = false,
    isDestory = false,  
    startX, startY, disY = 0, 
    loadingH = 0,
    options = {
      $el: $('body'), 
      $loadingEl: null, 
      autoHide: true, 
      url: undefined, 
      sendData: null, 
      startPX: 16,  
      refreshPx:45, 
      callbacks: {
        pullStart: null,  
        start: null,  
        success: null,  
        error: null,  
        end: null 
      }
    };

  var getPos = function(event){

    var pos = {
      x: event.pageX || event.clientX,
      y: event.pageY || event.clientY
    }

    return pos;
  }

  /**
   * 重置
   * @param Boolean isAnim 是否需要过度动画
   */
  var reset = function(isAnim) {
    isValid = false,  // 是否生效
    isEfec = false, // 触摸是否生效
    isRefresh = false, //刷新是否生效
    startX, startY, disY = 0;
    options.$loadingEl.animate({'margin-top': -loadingH}, (isAnim == false ? 0 : 800), function() {
        isTouching = false;
        runCb('end');
      });
  }
  
  /**
     *下拉刷新
     */
  var touchStart = function(evt) {
    var scrollTop = parseInt(options.$el.scrollTop());
    if(scrollTop > 0) return;
    if(isDestory) return;
    if(isTouching) return;
    
    isTouching = true;
    
    var touch = evt.touches[0], 
    x = parseInt(touch.pageX), 
    y = parseInt(touch.pageY); 

    //记录触点初始位置
    startX = x;
    startY = y;
  }
  
  /**
   * 触摸移动过程
   */
  var touchMove = function(evt) {

    if(isDestory) return;
    if(!isTouching) return;

    var $loadingEl = options.$loadingEl,
          touch = evt.touches[0], 
          x = parseInt(touch.pageX), 
          y = parseInt(touch.pageY), 
          t = y - startY;     

        if(!isValid && t > options.startPX) {
          isValid = true; isEfec = true;
          runCb('pullStart')
        }else if ( isEfec && t > options.refreshPx) {
          isEfec = false; isRefresh =true
          runCb('pullEnough')
        }
        
        if(!isValid) return;

        if(evt.preventDefault) evt.preventDefault();

        // 向上拖动
        if(t < 0){
          $loadingEl.css('margin-top', -loadingH);
        }

        if(t > 0 && t <= loadingH){
          $loadingEl.css('margin-top', -(loadingH-t));
          $loadingEl.height(loadingH);  
        } 

        else if(t > loadingH){
          $loadingEl.css('margin-top', 0);
          $loadingEl.height(t)
        } 

        disY = t;
  }

  /**
   * 执行回调函数
   */
  var runCb = function(name, data){
    if(options.callbacks[name]) options.callbacks[name].call(null, data);
  }

  /**
   * 触摸结束，请求数据
   */
  var touchEnd = function(evt) {

    if(isDestory) return;
    if(!isValid) return; 
    if(!isTouching) return;
    if(evt.preventDefault) evt.preventDefault();

    var $loadingEl = options.$loadingEl,
        touch = evt.touches[0] || evt.changedTouches[0],  
        x = parseInt(touch.pageX),  
        y = parseInt(touch.pageY),  
        t = y - startY;


      if(t <= loadingH){
        $loadingEl.css('margin-top', -(loadingH-t));
        $loadingEl.height(loadingH);
        $loadingEl.animate({'margin-top': -loadingH}, 800, function() {
          isTouching = false;
        });
      }else if(t > loadingH) {
        // 拖动高度超过刷新显示容器高度
        if(options.cb) options.cb()
        $loadingEl.animate({'height': loadingH}, 800, function() {})
      }

      if ( isRefresh) {
        runCb('start');
      }else{
        if(options.autoHide) reset()
      }
      
      isRefresh = false
      isValid = false;
      isEfec = false;
      disY = 0;
  }
  
  /**
   * 设置是否销毁
   */
  var setDestroy = function(destroy){
    isDestory = destroy || false;
  }

  /**
   * 初始化
   */
  var initlize = function() {
      loadingH = options.$loadingEl.height();
      $el = options.$el;
      $el[0].addEventListener('touchstart', touchStart, false);
      $el[0].addEventListener('touchmove', touchMove, false);
      $el[0].addEventListener('touchend', touchEnd, false);
  }

  var pullDown = function(){
    initlize();

    return {
      reset: reset,
      setDestroy: setDestroy
    }
  }

  $.pPullRefresh = function(settings){
    $.extend(true, options, (settings || {}));
    
    options.$el = options.$el || $('body');

    return pullDown(settings);
  }

  $.fn.pPullRefresh = function(settings){
    settings.$el = $(this);
    
    return $.pPullRefresh(settings);
  }

})();