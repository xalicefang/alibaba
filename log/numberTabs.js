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

function downloadCSVNumber() {
    var name = window.localStorage.getItem('condition') + '-' + window.localStorage.getItem('userID') + '-' + window.localStorage.getItem('task') + '-' + 'number.csv';

    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/saveCsv.php', { csv: csvStringNumber, filename: name }, function(response) {
        console.log(response);
    });
}

function clearNumber() {
  csvStringNumber='';
}