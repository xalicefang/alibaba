if (document.URL.indexOf("finished.html") == -1 && window.localStorage.getItem('finished')) {
	//alert("You have already completed this experiment!");
	alert("你已经完成了这个实验！");
	chrome.runtime.sendMessage({sendToUninstall:true});
}

if (!window.localStorage.getItem('started')) {
	if (document.URL.indexOf("aliexpress.com/category") != -1 || document.URL.indexOf("aliexpress.com/wholesale") != -1) {
		var expStartTime = Date.now();
		window.localStorage.setItem('expStartTime',expStartTime); 
		window.localStorage.setItem('started',true);
		chrome.runtime.sendMessage({expStartTime:expStartTime});
	} else if (document.URL.indexOf("aliexpress.com/item") != -1) {
		chrome.runtime.sendMessage({getStartTime:true}, function(response) {
		    window.localStorage.setItem('expStartTime',response.expStartTime);
		});
	}
}

function submitTask() {
	// call save csv files, open new window for new task
	chrome.runtime.sendMessage({finishedTask: true}, function(response) {
	    if (response.finished) {
	    	window.localStorage.setItem('finished', true);
	    }
	});

	var currTime = new Date().getTime() / 1000;
}

document.addEventListener("DOMContentLoaded", function(event) {
	// disable right click context menu !!!!asdf removed for testing
	// document.body.setAttribute("oncontextmenu","return false");

	if (document.URL.indexOf("aliexpress.com/") != -1 ) {
		// progress timer
		var timerUpdate = setInterval(function () {
			var date = new Date("1/1/1970");
			var secsPassedSinceStart = parseInt(Date.now() - window.localStorage.getItem('expStartTime'))/1000;
			date.setSeconds(secsPassedSinceStart);
			var minutes = date.getMinutes();
			// if (minutes < 10)
			// 	minutes = "0" + minutes;
			// var seconds = date.getSeconds();
			// if (seconds < 10)
			// 	seconds = "0" + seconds;
			//$("#timer")[0].innerHTML = minutes + ":" + seconds;
			$("#timer")[0].innerHTML = "任务 " + window.localStorage.getItem('task') + ", " + minutes + " 分钟";
			// if (minutes != 1)
			// 	$("#timer")[0].innerHTML += "s";

			if ((secsPassedSinceStart/60) > 8) {
				if (window.localStorage.getItem('task') > 4) {
					clearInterval(timerUpdate);
					//alert("Thanks! Time's up! Redirecting you to a quick wrap-up survey.");
					alert("谢谢！时间到了！重定向你到一个快速总结调查。");
					chrome.runtime.sendMessage({sendToFinish:true}, function(response) {
					    window.localStorage.setItem('finished', true);
					});	
				} else {
					chrome.runtime.sendMessage({minTimePassed:true});
				}
			}
		}, 1000);
	}


	// clean taobao search listings page
	if (document.URL.indexOf("aliexpress.com/category") != -1 || document.URL.indexOf("aliexpress.com/wholesale") != -1) {
		var keep = $("#main-wrap")[0];
		while (document.body.firstChild) {
		    document.body.removeChild(document.body.firstChild);
		}
		document.body.appendChild(keep);
		var keep2 = $("#hs-list-items")[0];
		var keep3 = $("#hs-below-list-items")[0];
		while (keep.firstChild) {
		    keep.removeChild(keep.firstChild);
		}
		keep.appendChild(keep2);
		keep.appendChild(keep3);
		keep.style.margin = "80px 0 0 50px";
		keep.style.width = "950px";

		//delete stuff from item boxes
		var allItemBoxes = document.getElementsByClassName("item");
		for (var i = 0; i < allItemBoxes.length; i++) {
			var item = allItemBoxes[i];
			var price = $(".price")[0];
			item.removeChild($(".info-more")[0]);
			item.className+=" smallItemHoverBox";
		}

		var infoBoxes = document.getElementsByClassName("info");

		for (var i = 0; i < infoBoxes.length; i++) {
			var info = infoBoxes[i];
			var infoChildren = info.childNodes;
			var price = infoChildren[3]
			while(infoChildren[0]) {
				info.removeChild(infoChildren[0]);
			}
			info.appendChild(price);
		}

		// remove discount
		var discount = $(".discount-rate");
		for (var i = 0; i < discount.length; i++) {
			discount[i].parentNode.removeChild(discount[i]);
		}

		// shorten column length
		var itemBox = $(".list-item");
		for (var i = 0; i < itemBox.length; i++) {
			itemBox[i].className+=" smallItemBox";
		}

		// remove report
		$(".item").mouseover(function(){
			var report = this.getElementsByClassName("report-item")[0];
			if (report)
				this.removeChild(report);
		});

	} 

	// clean tmall details page
	else if (document.URL.indexOf("aliexpress.com/item") != -1) {
		var base = $("#base")[0];
		while (document.body.firstChild) {
		    document.body.removeChild(document.body.firstChild);
		}
		document.body.appendChild(base);
		base.style.margin = "120px 0 0 80px";

		$(".main-wrap")[0].removeChild($(".seller-info-wrap")[0]);

		// remove stuff under product info
		var productInfo = $(".product-info")[0];
		var infoChildren = productInfo.childNodes;
		while(infoChildren[2]) {
			productInfo.removeChild(infoChildren[2]);
		}

		// remove stuff under photo
		var photoCol = $(".col-sub")[0];
		var photoChildren = photoCol.childNodes;
		while(photoChildren[2]) {
			photoCol.removeChild(photoChildren[2]);
		}

		// remove shipping
		$(".product-info-operation")[0].removeChild($(".product-info-shipping")[0]);

		// remove bulk info
		$(".price-sub-info")[0].parentNode.removeChild($(".price-sub-info")[0]);

		// remove total price
		$(".product-info-total-price")[0].parentNode.removeChild($(".product-info-total-price")[0]);

		//remove title
		$(".main-wrap")[0].removeChild($(".product-name")[0]);

		// remove wish list
		$(".product-info-action")[0].removeChild($(".add-to-wishlist")[0]);

		//remove buy now
		$(".buy-now")[0].removeChild($("#buy-now")[0]);

		// change add to cart
		//$("#add-to-cart")[0].innerHTML="<a href='#' rel='nofollow' style='margin: 20px 50px; line-height: 66px; height: 66px; min-width: 400px;'>Choose this item!</a>";
		$("#add-to-cart")[0].innerHTML= "&nbsp;&nbsp;选择这个！";
		$("#add-to-cart")[0].minWidth = "125px";
		$("#add-to-cart")[0].setAttribute('id',"expItemSelect");

	}

	var shade = document.createElement('div');
	shade.className = 'shade';

	var header = document.createElement('div');
	header.className = 'expHeader';
	header.style.padding = "10px 50px;"

	var logoBox = document.createElement('div');
	logoBox.className = 'logoBox';

	var logo = document.createElement('img');
	logo.className ='expLogo';
	logo.setAttribute('src',"http://www.stanford.edu/~fangx/uedlogo.png");
	logoBox.appendChild(logo);
	header.appendChild(logo);

	var timerContainer = document.createElement('div');
	timerContainer.setAttribute('class',"timer")
	var timer = document.createElement('div');
	timer.setAttribute('id',"timer")
	timerContainer.appendChild(timer);
	var belowTime = document.createElement('p');
	belowTime.style.fontSize = "10px";
	// belowTime.innerHTML = "(out of 4 tasks or 8 minutes)";
	belowTime.innerHTML = "(总共4个任务或8分钟)";
	timerContainer.appendChild(belowTime);
	if (document.URL.indexOf("aliexpress.com/") != -1) {
		header.appendChild(timerContainer);
	}

	document.body.appendChild(shade);
	document.body.appendChild(header);

	var modal = document.createElement('div');
	modal.innerHTML = window.localStorage.getItem('taskMsg');
	modal.className = "modal expText"; 
	modal.setAttribute('id','modal');
	document.body.appendChild(modal);

	if (document.URL.indexOf("aliexpress.com/category") != -1 || document.URL.indexOf("aliexpress.com/wholesale") != -1) {
		chrome.runtime.sendMessage({firstTimeTask:Date.now()}, function(response) {
			if (!response.taskSeen) {
				modal.style.visibility = "visible";
				shade.style.visibility = "visible";
			} 
		});
	}

	$(shade).click(function() {
		shade.style.visibility = "hidden";
    	$(modal).slideUp();
    	return false; 
	});

	$(header).click(function(){
		modal.style.visibility = "visible";
		shade.style.visibility = "visible";
		$(modal).slideDown();
    	return false; 
    });

	if (document.URL.indexOf("aliexpress.com/item") != -1) {
		$("#expItemSelect")[0].onclick = function() {
			submitTask();
		};
	}
	
});