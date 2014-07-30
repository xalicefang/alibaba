// if first time, set user id for content pages
if (window.localStorage.getItem('userID')==null) {
  chrome.runtime.sendMessage({user: true}, function(response) {
    //alert("response " + response.user);
    window.localStorage.setItem('userID', response.user);
    
    // get condition
    var id = Math.ceil(response.user/2);
    if (id%3==1) {
        console.log('same tab!');
        document.addEventListener('DOMNodeInserted', sameTab);
        window.localStorage.setItem('condition',1);
    } else if (id%3==2) {
        window.localStorage.setItem('condition',2);
        console.log('background tab!');
        document.addEventListener('DOMNodeInserted', backgroundTab);
    } else {
        window.localStorage.setItem('condition',3);
    }

  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    if (request.get == "readyState") {
      //console.log(document.readyState);
      sendResponse({readyState: document.readyState});
  	} else if (request.browserAction == "clicked") {
      console.log("clicked!");
      var modal = document.getElementById('modal');
      modal.style.visibility = "visible";
    } 
  });

document.addEventListener("DOMContentLoaded", function(event) {
  chrome.runtime.sendMessage({domLoaded: true});
});

window.onbeforeunload = function() {
  chrome.runtime.sendMessage({unload: true});
};

// add onclick event for all links!
function nodeInsertedCallback(event) {
    // there's repeats with related node, but it covers everything
    var a = event.relatedNode.getElementsByTagName('a');
    for (i=0;i<a.length;i++) { 
        a[i].onclick = function() {
          // if not new tab
          if (history.length > 1)
            chrome.runtime.sendMessage({link: a[i].href});
        };
    }
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

function backgroundTab(event) {
    // there's repeats with related node, but it covers everything
    var a = event.relatedNode.getElementsByTagName('a');
    for (i=0;i<a.length;i++) { 
        a[i].target="_blank";
        a[i].onclick=function(){
          // prevent original link behavior
          a.preventDefault;
          var b = document.createElement('a');
          // copy original link over - need to have a separate element to dispatch event on or else will go into infinite loop of clicks
          b.href = a.href;
          var evt = document.createEvent("MouseEvents");    
          evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, false, 0, null);
          b.dispatchEvent(evt);
        };
    } 

    var b = event.relatedNode.getElementsByTagName('base'); 
    for (i=0;i<b.length;i++) { 
      b[i].parentNode.removeChild(b[i]);          
    }

}

document.addEventListener('DOMNodeInserted', nodeInsertedCallback);

if (window.localStorage.getItem('condition')==1) {
  console.log('same tab!');
  document.addEventListener('DOMNodeInserted', sameTab);
} else if (window.localStorage.getItem('condition')==2) {
  console.log('background tab!');
  document.addEventListener('DOMNodeInserted', backgroundTab);
} 