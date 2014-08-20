startTime = Number.NEGATIVE_INFINITY;
csvStringLoading = "";

chrome.tabs.onActivated.addListener(checkLoading);

function startLoadingTime() {
	startTime = Date.now();
	console.log(startTime);
}

function stopLoadingTime(tabUrl) {
	var loadingTime = Date.now() - startTime;
	console.log("yes, current tab is loaded!" + loadingTime);
	makeRowLoading(loadingTime,tabUrl,'l');
	startTime = Number.NEGATIVE_INFINITY;
}

function checkLoading(activeInfo) {
	chrome.tabs.sendMessage(activeInfo.tabId, {get: "readyState"}, function(response) {
		if (response==null || response.readyState=="loading") {
	  		startLoadingTime();
		} else {
			if (startTime != Number.NEGATIVE_INFINITY) {
				stopLoadingTime();
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
				stopLoadingTime(tab.url);
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
	var name = window.localStorage.getItem('group') + '-' + window.localStorage.getItem('userID') + '-' + task + '-' + 'loading.csv';

	$.post('http://stanford.edu/~fangx/cgi-bin/alibaba/saveCsv.php', { csv: csvStringLoading, filename: name }, function(response) {
		console.log(response);
	});

	csvStringLoading = '';
}