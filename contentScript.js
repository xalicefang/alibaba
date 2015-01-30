/****** EXPERIMENT SETUP ******/
/****** Set conditions - tabs, redirect, and disable ctrl key ******/

/* 
set userID and groupID, for when user submits
set every page. - local storage doesn't persist between domains!
*/
chrome.runtime.sendMessage({getEssentials: true}, function(response) {
  //alert("response " + response.user);
  window.localStorage.setItem('userID', response.user);
  window.localStorage.setItem('group', response.group);
});


/* 
function for converting all links into anchored color tabs
*/
function colorsTab() {
  $( "a" ).unbind( "click", colorsLinks );
  $( "a" ).bind( "click", colorsLinks );
}

/* 
function for converting all links into background tab open
*/
function backgroundTab() {
  $( "a" ).unbind( "click", backgroundLinks );
  $( "a" ).bind( "click", backgroundLinks );
}

/* 
function for converting all links into same tab open
*/
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

/*
If is shopping experiment site, call function based on same/background/color tab condition
*/
if(document.URL.indexOf("aliexpress.com") != -1) {
  
  chrome.runtime.sendMessage({getTask: true}, function(response) {
    window.localStorage.setItem('task', response.task);
    if (response.condition=='s') {
      console.log("same tab");
      document.addEventListener('DOMNodeInserted', sameTab);
    } else if (response.condition=='b') {
      console.log("background tab");
      document.addEventListener('DOMNodeInserted', backgroundTab);
    } else if (response.condition=='c') {
      console.log("colors tab");
      document.addEventListener('DOMNodeInserted', colorsTab);
    } 

    window.localStorage.setItem('taskMsg', response.taskMsg);
    // set if already there
    if ($("#modal")) {
      $("#modal").innerHTML = response.taskMsg;
    }
  });
}

/* 
if is redirect URL, tell bg script to send to next task.
*/
if (document.URL.indexOf("stanford.edu/~fangx/cgi-bin/alibaba/redirect.html") != -1) {
  chrome.runtime.sendMessage({redirect: true});
}


/* 
deactivate ctrl-click for experiment, so not to tamper with user-initiated new tabs
*/
var cntrlIsPressed;
$(document).keydown(function(e){
  // match apple key for mac and ctrl key for pc
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