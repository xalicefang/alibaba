csvString = '';

chrome.tabs.onCreated.addListener(newTab);
chrome.tabs.onMoved.addListener(moved);
chrome.tabs.onActivated.addListener(activated);
chrome.tabs.onRemoved.addListener(removed);
// for same tab link cases
chrome.tabs.onUpdated.addListener(updated);

function logAlert() {
  makeRow("AttemptedSubmitAlert");
}

function newTab(tab) {
  makeRow("new",tab.id,tab.index,tab.openerTabId,tab.active,tab.url);
}

function moved(tabId,moveInfo) {
  makeRow("moved",tabId,moveInfo.fromIndex,moveInfo.toIndex);
}

function updated(tabId, changeInfo, tab) {
  // if open link in same tab
  if (changeInfo.url && tab.openerTabId==null) {
    makeRow("sameTabUrlChanged",tab.id,tab.index,tab.url);
  }
}

function activated(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    makeRow("activated",activeInfo.tabId,tab.index,tab.url);
  });
}

function removed(tabId) {
  // can't get tab info here because already removed
  makeRow("removed",tabId);
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
    var name = condition + '_' + window.localStorage.getItem('group') + '_' + window.localStorage.getItem('userID') + '_' + task + '.csv';

    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/saveCsv.php', { csv: csvString, filename: name, type: 'browser'}, function(response) {
    });
}