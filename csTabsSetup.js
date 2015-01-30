/****** HELPER FUNCTIONS FOR TABS SETUP ******/

// hack - function variable for setting tab color
var colorsForeground;

/*
For color links case, helper function to remove colored boxes when tabs are closed.
*/
function deactivateItemBox(closedTabId) {
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++) {
    if (allElements[i].getAttribute("tabId") == closedTabId) {
      allElements[i].className = "item smallItemHoverBox";
      allElements[i].removeAttribute('tabId');
      var closeBtn = allElements[i].getElementsByClassName("closeBtn")[0];
      if (closeBtn)
        allElements[i].removeChild(closeBtn);
      // get link
      link = allElements[i].childNodes[1].childNodes[1].childNodes[1];

      $(link).unbind( "click", colorsForeground );
      $(link).bind( "click", colorsLinks );
      return;
    }
  }
}

/* 
helper function for converting all links into anchored color tab
*/
function colorsLinks(e) {
  e.preventDefault();
  var a = $(this)[0].href;

  var picBox = $(this)[0].parentNode.parentNode.parentNode;

  // exclude # links and hack - else, the first item pops up twice - still bug!!! ARGHHHHH
  if (a.indexOf('#', a.length - 1) === -1 && !picBox.getAttribute('tabId')) {

    if (document.URL.indexOf("aliexpress.com/category") != -1 || document.URL.indexOf("aliexpress.com/w") != -1) {
      picBox.className += " colorBorder";
      var closeBtn = document.createElement('div');
      closeBtn.innerHTML = "<a href='#'>x</a>";
      closeBtn.className = "closeBtn";
      picBox.appendChild(closeBtn);

      var tabId;

      var port = chrome.runtime.connect({name: "getOpenedTab"});
      port.postMessage({openedTab: true});
      port.onMessage.addListener(function(msg) {
        if (msg.gotIt) {
          tabId = msg.gotIt;
          console.log(tabId);
          picBox.setAttribute('tabId',tabId);
        } else {
          port.postMessage({keepGoing: true});
        }
      });

      $(closeBtn).bind("click",function(e) {
        e.preventDefault();
        chrome.runtime.sendMessage({closeTab: tabId});
      });

      console.log(this);
     
      $(this).unbind( "click", colorsLinks );
      $(this).bind("click", colorsForeground = function(e) {
        e.preventDefault();
        console.log("foreground" + tabId);
        chrome.runtime.sendMessage({activateTab: tabId}); 
      });
    }

    var b = document.createElement('a');
    // copy original link over - need to have a separate element to dispatch event on or else will go into infinite loop of clicks
    b.href = a;
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
    b.dispatchEvent(evt);
  }

}

/*
helper function for converting all links into open in background tab
*/
function backgroundLinks(e) {
  e.preventDefault();
  var a = $(this)[0].href;
  // exclude # links
  if (a.indexOf('#', a.length - 1) === -1) {
    var b = document.createElement('a');
    // copy original link over - need to have a separate element to dispatch event on or else will go into infinite loop of clicks
    b.href = a;
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
    b.dispatchEvent(evt);
  }
}
