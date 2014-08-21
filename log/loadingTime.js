startTime = Number.NEGATIVE_INFINITY;
csvStringLoading = '';

chrome.tabs.onActivated.addListener(checkLoading);

function startLoadingTime() {
	startTime = Date.now();
}

function stopLoadingTime(tabUrl,flag) {
	var loadingTime = Date.now() - startTime;
	makeRowLoading(loadingTime,tabUrl,flag);
	startTime = Number.NEGATIVE_INFINITY;
}

function checkLoading(activeInfo) {
	chrome.tabs.sendMessage(activeInfo.tabId, {get: "readyState"}, function(response) {
		if (response==null || response.readyState=="loading") {
	  		startLoadingTime();
		} else {
			if (startTime != Number.NEGATIVE_INFINITY) {
				chrome.tabs.get(activeInfo.tabId, function(tab) {
					stopLoadingTime(tab.url,'0');
				});
			}
		}
	});
}

function startLoadingOnUnload() {
	if (condition == 's') {
		startLoadingTime();
	}
}

function storeFinishedLoading(parentTabId) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs.length > 0) {
		 	var tab = tabs[0];
			if (tab.id==parentTabId) {
				stopLoadingTime(tab.url,'1');
		 	}
		}
	});
}

function makeRowLoading() {
  var csvRow = Date.now();
  for (var i = 0; i < arguments.length; i++) {
    csvRow += ',' + arguments[i];
  }
  csvRow += "\r\n";
  csvStringLoading += csvRow;
}

function downloadCSVLoading () {
	var name = condition + '_' + window.localStorage.getItem('group') + '_' + window.localStorage.getItem('userID') + '_' + task + '.csv';

	$.post('http://stanford.edu/~fangx/cgi-bin/alibaba/saveCsv.php', { csv: csvStringLoading, filename: name, type: 'loading' }, function(response) {
	});
}