var listTime = [];
var itemsViewed = {};
var csvStringList = '';
var csvStringItems = '';
var lastTime = '';
var lastInfo = '';

// when open tabs activated
chrome.tabs.onActivated.addListener(activeTabCheckTime);
// for same tab link cases
chrome.tabs.onUpdated.addListener(tabUpdatedUrl);

function storeTime() {
	if (lastInfo) {
		var totalTime = Date.now() - lastTime;
		if (lastInfo.type == 'list') {
			listTime.push(totalTime);
		} else if (lastInfo.type =='details') {
			if (!itemsViewed[lastInfo.id]) {
				itemsViewed[lastInfo.id] = [];
			}
			itemsViewed[lastInfo.id].push(totalTime);
		}
	}
}

function countPageTime(url) {	
	if (url.indexOf("s.taobao.com") != -1) {
		// list
		storeTime();
		lastTime = Date.now();
		lastInfo = {'type':'list'};
	} else if (url.indexOf("detail.tmall.com") != -1) {
		// detail
		var id = getParameterFromString(url, 'id');
		storeTime();
		lastTime = Date.now();
		lastInfo = {'type':'details', 'id':id};
	}
}

function activeTabCheckTime() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs.length==1) {
			var tab = tabs[0];
			countPageTime(tab.url);
		}
	});	
}

function tabUpdatedUrl(tabId, changeInfo, tab) {
	// if open link in same tab
	if (changeInfo.url && tab.openerTabId==null) {
		countPageTime(changeInfo.url);
	}
}

function makeCSVItems() {
	for (var id in itemsViewed) {
		var timeArray = itemsViewed[id];
		var csvRow = id;
		for (var i = 0; i< timeArray.length; i++) {
			csvRow += "," + timeArray[i];
		}
		csvRow += "\r\n";
		csvStringItems += csvRow;
	}
}

function makeCSVList() {
	for (var i = 0; i< listTime.length; i++) {
		csvStringList += listTime[i] + ",";
	}
	csvStringList += "\r\n";
}

function downloadCSVItems() {
	makeCSVItems();
	makeCSVList();

	var nameList = window.localStorage.getItem('group') + '-' + window.localStorage.getItem('userID') + '-' + task + '-' + 'list.csv';

    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/saveCsv.php', { csv: csvStringList, filename: nameList }, function(response) {
    });

    var nameItems = window.localStorage.getItem('group') + '-' + window.localStorage.getItem('userID') + '-' + task + '-' + 'items.csv';

    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/saveCsv.php', { csv: csvStringItems, filename: nameItems }, function(response) {
    });

    itemsViewed = {};
	listTime = [];
	csvStringItems = '';
	csvStringList = '';
}