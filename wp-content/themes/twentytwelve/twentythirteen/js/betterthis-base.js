(function($, window) {

  function effectContent() {
    var effect = {
      types : {leftToRight : 'ltr', rightToLeft : 'rtl'},
      allItems : [],
      container : null,
      currentBlock : null,
      time : 600,
      init : function(prElm, time) {
        effect.container = $('#'+prElm);
        if(effect.container.length == 0) {
          effect.container = $('.'+prElm);
        }
        effect.allItems = effect.container.find('> .item-slider');
        effect.currentBlock = effect.container.find('> .item-active');
        effect.resetHeight();
        if(typeof time != 'undefined') {
          effect.time = time;
        }
      },
      resetHeight: function() {
        effect.currentBlock.css('width', effect.container.outerWidth());
        effect.container.css('height', effect.currentBlock.outerHeight());
      },
      effectApply : function(type, contentId, callback, callbefore) {
        var page = $('#'+contentId);
        //
        if(callbefore && typeof callbefore === "function") {
          callbefore(page);
        }
        
        if(page.length > 0) {
          if(page[0] != effect.currentBlock[0]) {
            if(type === effect.types.leftToRight){
              page.insertBefore(effect.currentBlock);
              page.css({left: -(page.width()) + 'px'}).addClass('item-active');
              page.animate({left: 0}, effect.time, function() {});
              effect.currentBlock.animate({left: (effect.currentBlock.width() + page.width())}, effect.time, function() {
                effect.currentBlock.removeClass('item-active');
                effect.currentBlock = page;
                effect.resetHeight();
                //
                
                if(callback && typeof callback === "function") {
                  callback.call();
                }

              });
            } else {
              page.insertAfter(effect.currentBlock);
              page.css({left: (effect.currentBlock.width()) + 'px'}).addClass('item-active');
              page.animate({left: 0}, effect.time, function() {});
              effect.currentBlock.animate({left: -(page.width())}, effect.time, function() {
                effect.currentBlock.removeClass('item-active');
                effect.currentBlock = page;
                effect.resetHeight();
                //
                if(callback && typeof callback === "function") {
                  callback.call();
                }
              });
            }
          }
        } else {
            alert('Sorry ! Page not existing.');
        }
      }
    };
    return effect;
  }
  
  var PostSlider = {
    items : [],
    size : 0,
    isAuto: true,
    end: true,
    init : function(container, isAuto) {
      var contn = $('#'+container);
      if(contn.length == 0) {
        contn = $('.'+container + ':first');
      }
      this.items = contn.find('> .item-slider');
      this.size = this.items.length;

      $('.sectionItem').on('click', 
        function(e){
          e.stopPropagation();
          e.preventDefault();
          var elm = $(this);
          var id = elm.data('id');
          //
          PostSlider.clickAction(elm, 'r');
          //
          var thumb = $('#section3').betterScrollTop().find('.list-item-thumb'); 
          thumb.find('li').show();
          thumb.find('#thumnail_'+id).hide();
      });
      
      if(typeof isAuto === 'boolean'){
        this.isAuto = isAuto;
      }
    },
    clickAction : function(elm, type) {
      if(elm.attr('data-id') === EffectContent.currentBlock.attr('id')) {
        return;
      }
      if(PostSlider.end === true) {
        PostSlider.end = false;
        EffectContent.effectApply((type === 'r') ? 'ltr' : 'rtl', elm.attr('data-id'), PostSlider.callback, PostSlider.callbefore);
      }
    },
    callback : function() {
      PostSlider.end = true;
      window.better.initFadeInOut(EffectContent.currentBlock);
    },
    callbefore : function(elm) {
      if(elm && elm.length > 0) {
        //
        var mW = elm.width();
        elm.find('.content-data:first').width((mW - elm.find('.thumnail:first').width() - 24) + 'px');
        
        elm.find('.fadein:first').find('li.active:first').removeClass("active");
        elm.find('.fadein:first').find('li:first').addClass('active');
      }
    }
    
  };

  var better = {
    currentFadeInt : null,
    scrollTop : function (elm) {
      if(elm === undefined || elm == null) {
        elm = $(this);
      } else {
        elm = $(elm);
      }
      var top = elm.offset().top;
      var scroller = $('html, body');
      var delta = (top - jQuery(window).scrollTop());
      if(delta < 0) {
        delta = delta*(-1);
      }
      speed = 500;//delta/2;

      var aniOpts = {
          duration: speed,
          easing: '',
          complete: function() {
            window.location.hash = elm.attr('id');
          }
        };
      scroller.stop().animate({scrollTop : top + 'px'}, aniOpts);
      return elm;
    },
    scrollTo : function(elm) {
      if(elm === undefined || elm == null) {
        elm = $(this);
      }
      
      elm.on('mousedown mouseup', function(e) {
        e.stopPropagation();
        e.preventDefault();
      }).off('click').on('click',  function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        better.scrollProcess($(this));
      });
    
    },
    nextOrFirst : function(selector) {
      var next = this.next(selector);
      return (next.length) ? next : this.prevAll(selector).last();
    },
    fadeOuter : function() {
      var elm = $(this);
      elm.stop().animate({'opacity': 0}, 800, function(){
        $(this).removeClass("active").css({'opacity': 1});
      });
      return elm;
    },
    fadeIner : function() {
      var elm = $(this);
      elm.stop().css({'opacity': 0}).addClass('active')
         .animate({'opacity': 1}, 800, function(){
      });
      return elm;
    },
    fadeInOut : function(parent) {
        parent.find('.fadein:first').find('.active:first').fadeOuter()
              .nextOrFirst('li').fadeIner().end();
    },
    initFadeInOut : function(elm) {
      
      //
      window.currentFade = elm;
      if(better.currentFadeInt !== null) {
        window.clearInterval(better.currentFadeInt);
      }
      better.currentFadeInt = setInterval(function() {better.fadeInOut(window.currentFade);}, 5000);
    },
    scrollProcess : function(elm) {
      var id = elm.attr('href');
      $(id).betterScrollTop(); 
    }
    
  };

  window.better = better;
  $.fn.nextOrFirst = window.better.nextOrFirst;
  $.fn.betterScrollTop = window.better.scrollTop;
  $.fn.scrollTo = window.better.scrollTo;
  $.fn.fadeOuter = window.better.fadeOuter;
  $.fn.fadeIner = window.better.fadeIner;


  (function($){
    // scroll menu
    $('a[href^=#section]').scrollTo();
    $('a[href=#page]').scrollTo();
    
    // init
    var elm = $('#section3').find('.list-item-content:first').find('.page-slider:first');
    PostSlider.callbefore(elm);
    window.better.initFadeInOut(elm);
   
    window.EffectContent = new effectContent();
    
    EffectContent.init('slider-container');
    PostSlider.init('slider-container', true);
   
  })($);


  

})(jQuery, window);