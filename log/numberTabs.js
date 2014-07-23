csvStringNumber = '';

chrome.tabs.onCreated.addListener(countTabs);
chrome.tabs.onRemoved.addListener(countTabs);

function countTabs() {
	chrome.windows.getLastFocused({"populate" : true}, focusedWindowTabCount);
}

function focusedWindowTabCount(window) {
	makeRowNumber(window.id,window.tabs.length);
}

function makeRowNumber() {
  var csvRow = Date.now();
  for (var i = 0; i < arguments.length; i++) {
    csvRow += ',' + arguments[i];
  }
  csvRow += "\r\n";
  csvStringNumber += csvRow;
}

function downloadCSVNumber () {
  var a = document.createElement('a');
  a.href     = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvStringNumber);
  a.target   = '_blank';
  a.click();
}

function clearNumber() {
  csvStringNumber='';
}