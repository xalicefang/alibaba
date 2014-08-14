var itemsViewed = [];
var pagesViewed = new Array(10);
var csvStringItems = '';
var csvStringPages = '';
var lastTime = '';
var lastInfo = '';

chrome.tabs.onActivated.addListener(activeTabCheckTime);
// for same tab link cases
chrome.tabs.onUpdated.addListener(tabUpdatedUrl);

function storeTime() {
	if (lastInfo) {
		var totalTime = Date.now() - lastTime;
		if (lastInfo.type == 'list') {
			if (pagesViewed[lastInfo.id-1]) {
				pagesViewed[lastInfo.id-1].time += totalTime;
			} else {
				pagesViewed[lastInfo.id-1] = {'count':1, 'time': totalTime};	
			}
			console.log("list " + lastInfo.id + " total time: " + pagesViewed[lastInfo.id-1].time);
		} else if (lastInfo.type =='details') {
			for (var i = 0; i < itemsViewed.length; i++) {
				if (itemsViewed[i].id == lastInfo.id) {
					itemsViewed[i].time += totalTime;
					console.log("details " + lastInfo.id + " total time: " + itemsViewed[i].time);
					break;
				}
			}
		}
	}
}

function countPageTime(url) {
	if (url.indexOf("s.taobao.com") != -1) {
		// list
		var pageNum = getParameterFromString(url, 's') / 44 + 1;
		storeTime();
		lastTime = Date.now();
		lastInfo = {'type':'list', 'id':pageNum};
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
	if(changeInfo.url && tab.openerTabId==tabId) {
		countPageTime(changeInfo.url);
	}
}

function clickedLinkSameTab(href) {
	//countPageTime(href);
}

function makeCSVItems() {
	for (var i = 0; i < itemsViewed.length; i++) {
		var csvRow = itemsViewed[i].id + ',' + itemsViewed[i].count + itemsViewed[i].time +"\r\n";
		csvStringItems += csvRow;
	}
	
	itemsViewed = [];
}

function makeCSVPages() {
	for (var i = 0; i < pagesViewed.length; i++) {
		if (pagesViewed[i]) {
			var csvRow = i + ',' + pagesViewed[i].count + pagesViewed[i].time + "\r\n";
			csvStringPages += csvRow;
		}
	}

	pagesViewed = new Array(10);
}

function downloadCSVPage () {
	makeCSVItems();
	makeCSVPages();

    var nameItems = window.localStorage.getItem('condition') + '-' + window.localStorage.getItem('userID') + '-' + window.localStorage.getItem('task') + '-' + 'items.csv';

    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/saveCsv.php', { csv: csvStringItems, filename: nameItems }, function(response) {
        console.log(response);
    });

    var namePages = window.localStorage.getItem('condition') + '-' + window.localStorage.getItem('userID') + '-' + window.localStorage.getItem('task') + '-' + 'pages.csv';

    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/saveCsv.php', { csv: csvStringPages, filename: namePages }, function(response) {
        console.log(response);
    });
    
	csvStringItems = '';
	csvStringPages = '';
}