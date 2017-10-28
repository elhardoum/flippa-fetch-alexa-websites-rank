(function(){
  const SELECTORS = [
    '.ListingResults___listingName',
    '.CardSlider___track .grid__col--bleed-y .text--semibold a',
    '.Section___type_a .grid--bleed .grid__col-6:first-child .text--semibold',
  ];
  var alexa_cache = [], counter=0, updateCounter = function() {
    if ( counter ) {
      emit(counter + ' ✓');
    } else {
      emit('✓✓');
      setTimeout(function(){ emit(''); }, 2000);
    }
  }, watchNode = function(obj, callback)
  {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
      eventListenerSupported = window.addEventListener;
    if( MutationObserver ){
      var obs = new MutationObserver(function(mutations, observer){
          if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
              callback();
      });
      obs.observe( obj, { childList:true, subtree:true });
    }
    else if( eventListenerSupported ){
      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  }, alexa = function(domain, node) {
    if ( alexa_cache && alexa_cache[domain] ) {
      node.innerText += ' (alexa: ' + alexa_cache[domain] + ')';
      counter--; updateCounter();
    } else {
      var req = new XMLHttpRequest();
      req.addEventListener('load', function(){
          var r, n;
          r = /<POPULARITY[^>]*TEXT="(\d+)"/g
          n = r.exec(this.response);
          alexa_cache[domain] = null != n ? n[1].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : -1;
          node.innerText += ' (alexa: ' + alexa_cache[domain] + ')';
          counter--; updateCounter();
      });
      req.open('GET', 'https://cors-anywhere.herokuapp.com/http://data.alexa.com/data?cli=10&dat=s&url='+domain);
      req.send();
    }
  }, emit = function(message) {
    chrome.extension.sendMessage(message);
  }, elements = [], validateDomain = function(d) {
    return d.length && /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(d);
  }, fetch = function(then) {
    elements = [];
    for ( var sel in SELECTORS ) {
      if ( SELECTORS.hasOwnProperty(sel) ) {
        sel = SELECTORS[sel];
        if ( sel.length ) {
          Array.prototype.forEach.call(document.querySelectorAll(sel), function(el){
            if ( el.innerText && validateDomain( el.innerText.trim() ) ) {
              elements.push(el);
            }
          });
        }
      }
      then();
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    fetch(function(){
      if ( elements.length ) {
        emit(''+elements.length)
      }
    });

    null != document.getElementById('searchBody') && watchNode(document.getElementById('searchBody'), function(){
      fetch(function(){
        if ( elements.length ) {
          emit(''+elements.length)
        }
      });
    });

    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
      if ( msg.text === 'icon_click' && elements.length ) {
        var d;
        counter=elements.length;
        for ( var node in elements ) {
          if ( elements.hasOwnProperty(node) ) {
            d = elements[node].innerText.trim();
            if ( validateDomain(d) ) {
              alexa( d, elements[node] );
            }
          }
        }
        sendResponse();
      }
    });
  }, false);
})();