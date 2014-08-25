function getParameterFromString(url, name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null;
}

// clean this up and make methods!!

var sendToPostSurvey = false;
var sendToUninstall = false;
var minTimePassed = false;
var task = 0;
var taskSeen = false;
var expStartTime;
var windowId;
var startTaskTime = 0;
var condition;
var listTabId;

function deleteAllOtherTabs(tabId) {
	chrome.tabs.query({windowId: windowId}, function(tabs) {
		for (var i = 0; i < tabs.length; i++) {
			if (tabs[i].id != tabId)
				chrome.tabs.remove(tabs[i].id);
		}
		csvStringLoading = '';
	    csvString='';
	    itemsViewed = {};
		listTime = [];
		csvStringItems = '';
		csvStringList = '';
	});
}

function uninstall() {
	chrome.windows.create({url: "http://stanford.edu/~fangx/cgi-bin/alibaba/finished.html"}, function() {
		chrome.windows.remove(windowId);
		chrome.management.uninstallSelf();
	});
}

// calculate loading time for same tab address bar, back, refresh, etc. 
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	function postSurvey() {
		var finishData = "task=" + task + "&id=" + window.localStorage.getItem('userID');

		// id and number of tasks finished
		$.post('http://stanford.edu/~fangx/cgi-bin/alibaba/finish.php', finishData, function(r) {
		});

		sendToUninstall = true;

		sendResponse({finished: true});

		// chrome.tabs.create({windowId:windowId, url: "https://stanforduniversity.qualtrics.com/SE/?SID=SV_bryIOKOEekjMm8Z&userID=" + window.localStorage.getItem('userID')}, function(tab) {
		// 	deleteAllOtherTabs(tab.id);
		// });

		chrome.tabs.create({windowId:windowId, url: "https://stanforduniversity.qualtrics.com/SE/?SID=SV_7WJUmQZX9y75GMB&userID=" + window.localStorage.getItem('userID')}, function(tab) {
			deleteAllOtherTabs(tab.id);
		});
	}

    // if active tab dom loaded
    if (request.domLoaded) {
		storeFinishedLoading(sender.tab.id);
	}

	// if click back/ forward/ refresh/ address bar change/ close
    else if (request.unload) {
    	// start loading time!
    	startLoadingOnUnload();
	}

	// store task on start and task message
	else if (request.task) {
		task = request.task;
	}

	// get task
	else if (request.getTask) {
	    if (task==1) {
	    	var taskMsg = "你想买一个能在上班时间用来喝水的杯子。由于你的工作需要来回走动，所以你希望买个不容易洒水出来的。";
	    } else if (task==2) {
	    	var taskMsg = "最近经常下雨，你想买一把伞给家里人用。你希望买到一把结实耐用，而且足够显眼以防丢失的。";
	    } else if (task==3) {
	    	var taskMsg = "你的钱包已经很旧了所以你想换个新的。新钱包款式要时尚并且看上去耐用，里面要能装下硬币、现金、信用卡等其他你想放的东西。";
	    } else if (task==4) {
	    	var taskMsg = "你家里的木质地板踩上去很凉，你想买一双拖鞋让来家里玩的朋友用，最好是一双比较特别、设计很有趣的。";
	    } else if (task==5) {
	    	var taskMsg = "你想买一个笔记本作为礼物，送给一名6岁的即将上学念书的小朋友。";
	    } else if (task==6) {
	    	var taskMsg = "请再替刚才的那个小朋友选购一块橡皮。橡皮最好能让小朋友舒适的使用（比如够大），同时再有一些趣味性能让小孩子喜欢。";
	    } else if (task==7) {
	    	var taskMsg = "你新买了一盆仙人掌，想给它换个更舒适的花盆。你的仙人掌大概有手掌那么大，你希望能把它放在桌子上观赏。";
	    } else if (task==8) {
	    	var taskMsg = "You just purchased an iPad and are looking for a case. You would like it to be sturdy and elegant.";
	    } else if (task==9) {
	    	var taskMsg = "Your earphones get tangled often and you are looking for a product that can .";
	    } else if (task==10) {
	    	var taskMsg = "Your pens get lost often, and you are looking for some pens that will stand out.";
	    } 
	    taskMsg = "<b>任务 " + task + ": </b><p>" + taskMsg + "</p></br><p>请按照您平常的习惯自由浏览以下商品，并从中选择一个您认为价格合适的。在您完成4个任务（用时超过8分钟），或继续操作满8分钟后，浏览器会自动带您到一个总结问卷，然后结束。</p>";

	    // if (task==1) {
	    // 	var taskMsg = "You're in need of a mug to drink tea at work. Your work involves moving around a lot, and you would like to buy a product that will prevent you from spilling your tea.";
	    // } else if (task==2) {
	    // 	var taskMsg = "It's the rainy season, and you need to buy a new umbrella for use in your family. You hope to use this umbrella for many years and also want it to stand out to prevent getting lost.";
	    // } else if (task==3) {
	    // 	var taskMsg = "Your wallet is falling apart and you're looking for a new one. You would like to find a product that is sturdy and fashionable. It should be able to hold coins, cards, and cash.";
	    // } else if (task==4) {
	    // 	var taskMsg = "It's winter and the hardwood floors of your home are getting cold. You're hosting a friend next week and you would like to buy a pair of slippers for him to use. Your friend is funny and appreciate a good joke.";
	    // } else if (task==5) {
	    // 	var taskMsg = "You are looking for a notebook as a small present for a six year old girl as she gets ready for school.";
	    // } else if (task==6) {
	    // 	var taskMsg = "Please look for a pack of eraser for the same six year old girl. The erasers should be big enough to be comfortably used, but also different and fun.";
	    // } else if (task==7) {
	    // 	var taskMsg = "You just bought a new cactus plant and are looking for a suitable flower pot to hold it. Your cactus is about the size of a hand and you hope to put it on your desk.";
	    // } else if (task==8) {
	    // 	var taskMsg = "You just purchased an iPad and are looking for a case. You would like it to be sturdy and elegant.";
	    // } else if (task==9) {
	    // 	var taskMsg = "Your earphones get tangled often and you are looking for a product that can .";
	    // } else if (task==10) {
	    // 	var taskMsg = "Your pens get lost often, and you are looking for some pens that will stand out.";
	    // } 
	    // taskMsg = "<b>Task " + task + ": </b><p>" + taskMsg + "</p></br><p>Please browse the items and select an appropriate item that is reasonable in price. <i>Please browse as you normally would.</i> The study will end when you have completed 4 tasks or when 8 minutes is reached, whichever is longer.</p>";
	 //    if (window.localStorage.getItem('group')==1) {
		
		// FOR TESTING ONLY!!!! asdf
		condition = 'c';

		// if (task==1 || task==4 || task==7) 
		//     condition = 's';
		//   else if (task==2 || task==5 || task==8) 
		//     condition = 'b';
		//   else 
		//     condition = 'f';
		// } else if (window.localStorage.getItem('group')==2) {
		//     if (task==2 || task==5 || task==8) 
		//     condition = 's';
		//   else if (task==3 || task==6 || task==9) 
		//     condition = 'b';
		//   else 
		//     condition = 'f';
		// } else if (window.localStorage.getItem('group')==3) {
		//   if (task==3 || task==6 || task==9) 
		//     condition = 's';
		//   else if (task==1 || task==4 || task==7) 
		//     condition = 'b';
		//   else 
		//     condition = 'f';
		// }
	    sendResponse({task:task, taskMsg:taskMsg, condition:condition});
	}

	else if (request.minTimePassed) {
		minTimePassed = true;
	}

	else if (request.sentAlert) {
		logAlert();
	}

	// experimental actions
	else if (request.finishedTask) {
		// mark time for choosing page on browser log
		makeRow("chose!");
		// store time on last items page
		storeTime();

		// check if min conditions reached, set finished
		if (task>=4 && minTimePassed) {
			sendToPostSurvey = true;
	    	sendResponse({finished: true});
	    } else {
	    	sendResponse({finished: false}); 
	    }

	    var url;
	    if (condition=='s')
		    url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_2m1kN6BHD8aLzlH";
		else if (condition=='f')
		    url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_6Aue1omKsDzY8DP";
		else if (condition=='b')
		    url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_etImcqJ4datp1K5";
		else if (condition=='c')
		    url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_9EqBN8483xUVACp";

	   	var urlParameters = "&task=" + task + "&userID=" + window.localStorage.getItem('userID') + '&group=' + window.localStorage.getItem('group') + '&condition=' + condition; 

		chrome.tabs.create({windowId:windowId, url: url + urlParameters}, function(tab) {
			deleteAllOtherTabs(tab.id);
		});

		downloadCSVItems();
		downloadCSVLoading();
		downloadCSV();
	} 

	// send userID to content page
	else if (request.getEssentials) {
	    sendResponse({user: window.localStorage.getItem('userID'), group: window.localStorage.getItem('group')});
	} 

	else if (request.expStartTime) {
		expStartTime = request.expStartTime;
	}

	else if (request.getStartTime) {
		sendResponse({expStartTime:expStartTime});
	}

	else if (request.firstTimeTask) {
		sendResponse({taskSeen:taskSeen});
		if (!taskSeen) {
			saveListTabId();
			startTaskTime = request.firstTimeTask;
			taskSeen = true;
		}
	}

	else if (request.getstartTaskTime) {
		sendResponse({startTaskTime:startTaskTime});
	}

	else if (request.sendToUninstall) {
		uninstall();
	}

	else if (request.sendToFinish) {
		postSurvey();		
	}

	else if (request.redirect) {
		if (sendToPostSurvey) {
			sendToPostSurvey = false;
			postSurvey();
		} else if (sendToUninstall) {
			uninstall();
		} else {
			// if (task==0) {
			// 	var url = "http://s.taobao.com/search?q=%BF%C9%B0%AE%B1%AD%D7%D3%B4%B4%D2%E2%B4%F8%B8%C7&tianmao=1";
			// } else if (task==1) {
			// 	var url = "http://s.taobao.com/search?q=%D3%EA%C9%A1%BA%AB%B9%FA&tianmao=1"
	  //   	} else if (task==2) {
	  //   		var url = "http://s.taobao.com/search?q=%C7%AE%B0%FC%B4%B4%D2%E2+&tianmao=1";
	  //   	} else if (task==3) {
	  //   		var url = "http://s.taobao.com/search?q=%CD%CF%D0%AC%B4%B4%D2%E2+&tianmao=1"
	  //   	} else if (task==4) {
			// 	var url = "http://s.taobao.com/search?q=%D0%A1%B1%BE%D7%D3%BF%C9%B0%AE&tianmao=1";
	  //   	} else if (task==5) {
	  //   		var url = "http://s.taobao.com/search?q=%CF%F0%C6%A4%B0%FC%D3%CA+%BF%C9%B0%AE+%D1%A7%C9%FA&tianmao=1";
	  //   	} else if (task==6) {
	  //   		var url = "http://s.taobao.com/search?q=%D0%A1%B1%BE%D7%D3%BF%C9%B0%AE&tianmao=1";
	  //   	} else if (task==7) {
	  //   		var url = "http://s.taobao.com/search?q=ipad%BF%C7&tianmao=1&filter=reserve_price[0.0,21]#J_relative";
	  //   	} else if (task==8) {
			// 	var url = "http://s.taobao.com/search?q=%B6%FA%BB%FA%BC%AF%CF%DF&tianmao=1";
	  //   	} else if (task==9) {
	  //   		var url = "http://s.taobao.com/search?q=%D4%B2%D6%E9%B1%CA%BF%C9%B0%AE&tianmao=1";
	  //   	} 

	  		if (task==0) {
				var url = "http://www.aliexpress.com/wholesale?SearchText=slippers";
			} else if (task==1) {
				var url = "http://www.aliexpress.com/category/152405/wallets.html"
	    	} else if (task==2) {
	    		var url = "http://www.aliexpress.com/category/40601/bedding-sets.html?site=glo&g=y&shipCountry=us&pvId=326-97&isrefine=y";
	    	} else if (task==3) {
	    		var url = "http://www.aliexpress.com/w/wholesale-solid-color-t-shirt.html?g=y&SearchText=solid%2Bcolor%2Bt%2Bshirt&CatId=100003071&pvId=200000457-200003574&shipCountry=us&isrefine=y"
	    	} else if (task==4) {
				var url = "http://www.aliexpress.com/w/wholesale-bath-towel.html?g=y&SearchText=bath%2Btowel&CatId=0&shipCountry=us";
	    	} else if (task==5) {
	    		var url = "http://s.taobao.com/search?q=%CF%F0%C6%A4%B0%FC%D3%CA+%BF%C9%B0%AE+%D1%A7%C9%FA&tianmao=1";
	    	} else if (task==6) {
	    		var url = "http://s.taobao.com/search?q=%D0%A1%B1%BE%D7%D3%BF%C9%B0%AE&tianmao=1";
	    	} else if (task==7) {
	    		var url = "http://s.taobao.com/search?q=ipad%BF%C7&tianmao=1&filter=reserve_price[0.0,21]#J_relative";
	    	} else if (task==8) {
				var url = "http://s.taobao.com/search?q=%B6%FA%BB%FA%BC%AF%CF%DF&tianmao=1";
	    	} else if (task==9) {
	    		var url = "http://s.taobao.com/search?q=%D4%B2%D6%E9%B1%CA%BF%C9%B0%AE&tianmao=1";
	    	} 
	    	else {
	    		postSurvey();
	    	}
	    	task++;
	    	taskSeen = false;
	    	// chrome.tabs.update(sender.tab.id, {url: url});
			chrome.tabs.create({windowId:windowId, url: url}, function(tab) {
				deleteAllOtherTabs(tab.id);
			});
	    }
	} 
	else if (request.activateTab) {
		chrome.tabs.update(request.activateTab, {active:true});
	}
	else if (request.closeTab) {
		chrome.tabs.remove(request.closeTab);
	}

});

chrome.runtime.onConnect.addListener(function(port) {
	console.assert(port.name == "getOpenedTab");
	port.onMessage.addListener(function(msg) {
	  	function newBackgroundTab(tab) {
	  		console.log(tab.url);
			port.postMessage({gotIt: tab.id});
			chrome.tabs.highlight({tabs:[0,tab.index],windowId:windowId}, function(){});
			chrome.tabs.onCreated.removeListener(newBackgroundTab);
		}
	    if (msg.openedTab) {
	    	chrome.tabs.onCreated.addListener(newBackgroundTab);
	    } 
	    else if (msg.keepGoing)
	    	port.postMessage({notThereYet: true});
	});
});

// chrome.runtime.onConnect.addListener(function(port) {
// 	console.assert(port.name == "getOpenedTab");
// 	port.onMessage.addListener(function(msg) {
// 		var tabUrl;
// 	  	function newBackgroundTab(tab) {
// 	  		console.log("new tab found: " + tab.url);
// 	  		console.log("new tab id: " + tab.id);
// 	  		if (tab.url == tabUrl) {
// 				port.postMessage({gotIt: tab.id});
// 				chrome.tabs.onCreated.removeListener(newBackgroundTab);
// 			}
// 		}
// 	    if (msg.openedTab) {
// 	    	tabUrl = msg.openedTab;
// 	    	console.log("opened port finding tab with this url: " + tabUrl);
// 	    	chrome.tabs.onCreated.addListener(newBackgroundTab);
// 	    } 
// 	    else if (msg.keepGoing)
// 	    	port.postMessage({notThereYet: true});
// 	});
// });