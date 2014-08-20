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

function backgroundLinks(e) {
  e.preventDefault();
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

if(document.URL.indexOf("s.taobao.com") != -1 || document.URL.indexOf("detail.tmall.com") != -1) {
  chrome.runtime.sendMessage({getTask: true}, function(response) {
    window.localStorage.setItem('task', response.task);
    if (response.condition=='s') {
      console.log("same tab");
      document.addEventListener('DOMNodeInserted', sameTab);
    } else if (response.condition=='b') {
      console.log("background tab");
      document.addEventListener('DOMNodeInserted', backgroundTab);
    } 
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