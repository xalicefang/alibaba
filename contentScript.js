function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

// set every page. - local storage doesn't persist between domains!
chrome.runtime.sendMessage({getEssentials: true}, function(response) {
  //alert("response " + response.user);
  window.localStorage.setItem('userID', response.user);
  window.localStorage.setItem('group', response.group);
});

function sameTab(event) {
  // there's repeats with related node, but it covers everything
  var a = event.relatedNode.getElementsByTagName('a');
  for (i=0; i<a.length; i++) { 
    if (a[i].target=="_blank") { 
      a[i].target="_self";
    }
  } 

  var b = event.relatedNode.getElementsByTagName('base'); 
  for (i=0;i<b.length;i++) { 
    if (b[i].target=="_blank") { 
        b[i].target="_self";
    }                 
  }
}

var colorsForeground;

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

function colorsLinks(e) {
  e.preventDefault();
  var a = $(this)[0].href;

  var picBox = $(this)[0].parentNode.parentNode.parentNode;

  // exclude # links and hack - else, the first item pops up twice - still bug!!! ARGHHHHH
  if (a.indexOf('#', a.length - 1) === -1 && !picBox.getAttribute('tabId')) {

    if (document.URL.indexOf("aliexpress.com/category") != -1 || document.URL.indexOf("aliexpress.com/wholesale") != -1) {
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

function colorsTab() {
  $( "a" ).unbind( "click", colorsLinks );
  $( "a" ).bind( "click", colorsLinks );
}

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

function backgroundTab() {
  $( "a" ).unbind( "click", backgroundLinks );
  $( "a" ).bind( "click", backgroundLinks );
}

if(document.URL.indexOf("aliexpress.com") != -1) {
  
  chrome.runtime.sendMessage({getTask: true}, function(response) {
    // window.localStorage.setItem('task', response.task);
    // if (response.condition=='s') {
    //   console.log("same tab");
    //   document.addEventListener('DOMNodeInserted', sameTab);
    // } else if (response.condition=='b') {
    //   console.log("background tab");
    //   document.addEventListener('DOMNodeInserted', backgroundTab);
    // } else if (response.condition=='c') {
    //   console.log("colors tab");
    //   document.addEventListener('DOMNodeInserted', colorsTab);
    // } 

    // for testing!!! asdf
    document.addEventListener('DOMNodeInserted', colorsTab);

    window.localStorage.setItem('taskMsg', response.taskMsg);
    // set if already there
    if ($("#modal")) {
      $("#modal").innerHTML = response.taskMsg;
    }
  });
}

if (document.URL.indexOf("stanford.edu/~fangx/cgi-bin/alibaba/redirect.html") != -1) {
  chrome.runtime.sendMessage({redirect: true});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.get == "readyState") {
      sendResponse({readyState: document.readyState});
  	} 

    else if (request.closedTab) {
      console.log("closed tab request received");
      deactivateItemBox(request.closedTab);
    }
  });

// deactivate ctrl-click
 var cntrlIsPressed;
  $(document).keydown(function(e){
    if (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) {
      cntrlIsPressed = true;
    }
  });

  $(document).keyup(function(){
    cntrlIsPressed = false;
  });

  document.onclick=function(e) {
    if(cntrlIsPressed) {
      cntrlIsPressed = false;
      alert("Sorry, the 'ctrl' and right click buttons are disabled in this study.");
      e.preventDefault();
      console.log(e);
    }
  };

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
      chrome.runtime.sendMessage({domLoaded: true});
  }
}

window.onbeforeunload = function() {
  chrome.runtime.sendMessage({unload: true});
};

// if (window.localStorage.getItem('task')==1) {
//    console.log("same tab");
//     document.addEventListener('DOMNodeInserted', sameTab);
// }
// if (window.localStorage.getItem('condition')==1) {
//   console.log("condition 1");
//   if (window.localStorage.getItem('task')==2 || window.localStorage.getItem('task')== 5 || window.localStorage.getItem('task')==8) {
//     console.log("same tab");
//     document.addEventListener('DOMNodeInserted', sameTab);
//   } else if (window.localStorage.getItem('task')==3 || window.localStorage.getItem('task')==6 || window.localStorage.getItem('task')==9) {
//     console.log("background tab")
//     document.addEventListener('DOMNodeInserted', backgroundTab);
//   } 
// } else if (window.localStorage.getItem('condition')==2) {
//   console.log("condition 2");
//   if (window.localStorage.getItem('task')==3 || window.localStorage.getItem('task')== 6 || window.localStorage.getItem('task')==9) {
//     console.log("same tab");
//     document.addEventListener('DOMNodeInserted', sameTab);
//   } else if (window.localStorage.getItem('task')==4 || window.localStorage.getItem('task')==7 || window.localStorage.getItem('task')==10) {
//     console.log("background tab")
//     document.addEventListener('DOMNodeInserted', backgroundTab);
//   } 
// } else {
//   console.log("condition 3");
//   if (window.localStorage.getItem('task')==4 || window.localStorage.getItem('task')== 7 || window.localStorage.getItem('task')==10) {
//     console.log("same tab");
//     document.addEventListener('DOMNodeInserted', sameTab);
//   } else if (window.localStorage.getItem('task')==2 || window.localStorage.getItem('task')==5 || window.localStorage.getItem('task')==8) {
//     console.log("background tab")
//     document.addEventListener('DOMNodeInserted', backgroundTab);
//   } 
// }

// $.get( "http://detail.tmall.com/item.htm?spm=a230r.1.14.3.noSSs1&id=38548416168&ad_id=&am_id=&cm_id=140105335569ed55e27b&pm_id=", function( data ) {
//   console.log(data);
//   alert( "Load was performed." );
// });