startTime = Number.NEGATIVE_INFINITY;
csvStringLoading = "";

chrome.tabs.onActivated.addListener(checkLoading);

function checkLoading() {
	// match with manifest permission
	chrome.tabs.query({active: true, currentWindow: true, url: "http://*/*"}, function(tabs) {
		if (tabs.length==1) {
			var tab = tabs[0];

			chrome.tabs.sendMessage(tab.id, {get: "readyState"}, function(response) {
		  		console.log("sent message");
				if (response==null || response.readyState=="loading") {
			  		startTime = Date.now();
			  		console.log(startTime);
				}
			});

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
  var a = document.createElement('a');
  a.href     = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvStringLoading);
  a.target   = '_blank';
  a.click();
}

function clearLoading() {
  csvString='';
}

// from click case

function domLoaded(details) {
	// only if it's the parent frame!
	console.log("dom content loaded");
	console.log(details.url);
}

function completed(details) {
	console.log("completed!");
	console.log(details.url);
}