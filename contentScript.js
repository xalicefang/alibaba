function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

// set every page. - local storage doesn't persist between domains!
//if (window.localStorage.getItem('userID')==null) {
  chrome.runtime.sendMessage({getEssentials: true}, function(response) {
    //alert("response " + response.user);
    window.localStorage.setItem('userID', response.user);
    window.localStorage.setItem('condition', response.condition);
  });
//}

if(document.URL.indexOf("s.taobao.com") != -1 || document.URL.indexOf("detail.tmall.com") != -1) {
  chrome.runtime.sendMessage({getTask: true}, function(response) {
    window.localStorage.setItem('task', response.task);
  });
}

if (document.URL.indexOf("stanford.edu/~fangx/cgi-bin/alibaba/redirect.html") != -1) {
  chrome.runtime.sendMessage({redirect: true});
}

window.localStorage.setItem('taskMsg', "Imagine you are shopping for presents and landed on this listings page. Please click to explore the items, and select an item that you like and is reasonable in price. Please take your time and browse as you normally would. The experiment will take 15 minutes no matter how fast/ slow you browse.");


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    if (request.get == "readyState") {
      //console.log(document.readyState);
      sendResponse({readyState: document.readyState});

  	} 

    else if (request.browserAction == "clicked") {
      console.log("clicked!");
      var modal = document.getElementById('modal');
      modal.style.visibility = "visible";
    } 

    else if (request.newActivate) {
      console.log("start watch!");
      startActiveWatch();
    }

    else if (request.oldDeactivate) {
      stopActiveWatch();
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
      // log this??!!!
      alert("Sorry, the 'ctrl' and right click buttons are disabled in this study.");
      e.preventDefault();
      console.log(e);
    }
  };

document.addEventListener("DOMContentLoaded", function(event) {
  chrome.runtime.sendMessage({domLoaded: true});
});

window.onbeforeunload = function() {
  chrome.runtime.sendMessage({unload: true});
};

function allLinks(e) {
  if (this.href.indexOf("s.taobao.com") != -1) {
    // pass over page number
    chrome.runtime.sendMessage({list: this.innerHTML});
  } else if (this.href.indexOf("detail.tmall.com") != -1) {
    chrome.runtime.sendMessage({detail: this.href});
  } else {
    // i don't know what happened
  }
  // if not new tab - why do we need this? doesn't work for background tabs
  // if (history.length > 1) {
  //   chrome.runtime.sendMessage({link: this.href});
  // }
}
// add onclick event for all links!
function nodeInsertedCallback(event) {
  $( "a" ).unbind( "click", allLinks );
  $( "a" ).bind( "click", allLinks );
}

function sameTab(event) {
  // there's repeats with related node, but it covers everything
  var a = event.relatedNode.getElementsByTagName('a');
  for (i=0;i<a.length;i++) { 
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

function backgroundLinks(e) {
  e.preventDefault();
  //!!!!!!!!!!!!!!!!!!!!!!!!!??????????????????
  // if ($(this)[0].parentNode && $(this)[0].parentNode.classList.indexOf("page-wrap") != -1) {
  //   console.log($(this)[0]);
  // }
  var a = $(this)[0].href;
  // exclude the expand/ min link
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

document.addEventListener('DOMNodeInserted', nodeInsertedCallback);


if (window.localStorage.getItem('task')==1) {
  console.log("same tab");
  document.addEventListener('DOMNodeInserted', sameTab);
} else if (window.localStorage.getItem('task')==2) {
  console.log("background tab");
  document.addEventListener('DOMNodeInserted', backgroundTab);
} 

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