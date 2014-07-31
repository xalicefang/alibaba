chrome.windows.create({
    url: '/exp/intro.html'
  });

function openModal() {
	console.log("clicked!");
	// match URL!!!!
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs.length==1) {
			var tab = tabs[0];
			console.log(tab.id);
			chrome.tabs.sendMessage(tab.id, {browserAction: 'clicked'}, function(response) {
			});
		}
	});	
}

chrome.browserAction.onClicked.addListener(openModal);

//chrome.browserAction.onClicked.addListener(function() {console.log("click";)});