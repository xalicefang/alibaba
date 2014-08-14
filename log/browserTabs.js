function clickedLink(href) {
  chrome.tabs.query({"active":true, "lastFocusedWindow":true}, function(tabs) {
    var tab = tabs[0];
    //console.log("clicked link same tab");
    makeRow("clickedLinkSameTab",tab.id,tab.index,tab.windowId,tab.url);
    startTime = Date.now();
  });
}

csvString = '';

chrome.tabs.onCreated.addListener(newTab);
chrome.tabs.onMoved.addListener(moved);
chrome.tabs.onActivated.addListener(activated);
chrome.tabs.onRemoved.addListener(removed);
chrome.windows.onCreated.addListener(newWindow);
chrome.windows.onRemoved.addListener(removedWindow);
chrome.windows.onFocusChanged.addListener(windowFocus);
chrome.webNavigation.onCommitted.addListener(backButton);

// if create new tab or activate different tab, call change active tab to start activity timer
// chrome.tabs.onCreated.addListener(updateActivityMonitor);
// chrome.tabs.onActivated.addListener(updateActivityMonitor);

// chrome.tabs.onDetached.addListener(detached);
// chrome.tabs.onAttached.addListener(attached);
// chrome.tabs.onHighlighted.addListener(highlighted);

// tab url updated, refreshed, etc. but not time precise, one for loading, again for completed.
// also loads for newly created tabs - duplicated.
// ignore for now. use some on click function or webNav to store within tab navigation and  back button stuff. 
//chrome.tabs.onUpdated.addListener(updated); 


function newTab(tab) {
  // console.log("new");
  // console.log(tab);
  makeRow("new",tab.id,tab.index,tab.windowId,tab.openerTabId,tab.active,tab.url);
}

function moved(tabId,moveInfo) {
  makeRow("moved",tabId,moveInfo.windowId,moveInfo.fromIndex,moveInfo.toIndex);
}

function updated(tabId, changeInfo, tab) {
  if (changeInfo.url)
    makeRow("updated",tab.id,tab.index,tab.windowId,tab.openerTabId,tab.active,tab.url);
}

function activated(activeInfo) {
  console.log("active!");
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    makeRow("activated",activeInfo.tabId,activeInfo.windowId,tab.index,tab.url);
  });
}

function removed(tabId, removeInfo) {
  // can't get tab info here because already removed
  makeRow("removed",tabId,removeInfo.windowId,removeInfo.isWindowClosing);
}

function newWindow(window) {
  makeRow("newWindow",window.id);
}

function removedWindow(windowId) {
  makeRow("removedWindow",windowId);
}

function windowFocus(windowId) {
  makeRow("focusWindow",windowId);
}

function backButton(details) {
  if (details.transitionQualifiers.indexOf('forward_back') > -1) {
    chrome.tabs.query({"active":true, "lastFocusedWindow":true}, function(tabs) {
      var tab = tabs[0];
      makeRow("forwardBack",tab.id,tab.index,tab.windowId,tab.active,tab.url);
    });
  } 
}

// function detached(tabId,detachInfo) {
//   makeRow("detached",tabId,detachInfo.oldWindowId,detachInfo.oldPosition); 
// }

// function attached(tabId,attachInfo) {
//   makeRow("attached",tabId,attachInfo.newWindowId,attachInfo.newPosition); 
// }

// function highlighted(highlightInfo) {
//   makeRow("highlighted",highlightInfo.windowId,highlightInfo.tabIds); 
// }

// on active tab changed (new tab, activated), activate timer of active tab and deactivate timer of last tab
oldActive = null;
function updateActivityMonitor() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length==1) {
    var tab = tabs[0];
    console.log("new: " + tab.id);
      chrome.tabs.sendMessage(tab.id, {newActivate: true});
      if (oldActive) {
        console.log("old: " + oldActive.id);
        chrome.tabs.sendMessage(oldActive.id, {oldDeactivate:true})
      }
      oldActive = tab;
    }
  }); 
}

function makeRow() {
  var csvRow = Date.now();
  for (var i = 0; i < arguments.length; i++) {
    csvRow += ',' + arguments[i];
  }
  csvRow += "\r\n";
  csvString += csvRow;
}

function downloadCSV () {
    var name = window.localStorage.getItem('condition') + '-' + window.localStorage.getItem('userID') + '-' + window.localStorage.getItem('task') + '-' + 'browser.csv';

    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/saveCsv.php', { csv: csvString, filename: name }, function(response) {
        console.log(response);
    });
    
    csvString='';
}