csvString = '';

chrome.tabs.onCreated.addListener(newTab);
chrome.tabs.onMoved.addListener(moved);
chrome.tabs.onActivated.addListener(activated);
chrome.tabs.onRemoved.addListener(removed);

function newTab(tab) {
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
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    makeRow("activated",activeInfo.tabId,activeInfo.windowId,tab.index,tab.url);
  });
}

function removed(tabId, removeInfo) {
  // can't get tab info here because already removed
  makeRow("removed",tabId,removeInfo.windowId,removeInfo.isWindowClosing);
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
    var name = window.localStorage.getItem('group') + '-' + window.localStorage.getItem('userID') + '-' + task + '-' + 'browser.csv';

    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/saveCsv.php', { csv: csvString, filename: name }, function(response) {
        console.log(response);
    });
    
    csvString='';
}