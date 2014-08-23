if (document.URL.indexOf("finished.html") == -1 && window.localStorage.getItem('finished')) {
	//alert("You have already completed this experiment!");
	alert("你已经完成了这个实验！");
	chrome.runtime.sendMessage({sendToUninstall:true});
}

if (!window.localStorage.getItem('started')) {
	if (document.URL.indexOf("s.taobao.com") != -1) {
		var expStartTime = Date.now();
		window.localStorage.setItem('expStartTime',expStartTime); 
		window.localStorage.setItem('started',true);
		chrome.runtime.sendMessage({expStartTime:expStartTime});
	} else if (document.URL.indexOf("detail.tmall.com") != -1) {
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

	if (document.URL.indexOf("s.taobao.com") != -1 || document.URL.indexOf("detail.tmall.com") != -1 ) {
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
	if (document.URL.indexOf("s.taobao.com") != -1) {
		document.body.removeChild($(".tb-side")[0]);
		document.body.removeChild($(".site-nav")[0]);
		$("#page")[0].removeChild($(".tb-wrapper")[0]);
		$("#page")[0].removeChild($(".tb-bottom")[0]);
		$("#page")[0].removeChild($(".search-panel")[0]);
		$("#page")[0].removeChild($(".tb-footer")[0]);
		$(".tb-supplement-tbalink")[0].removeChild($(".tbalink")[0]);
		$(".tb-wrapper-main")[0].removeChild($(".tb-navi")[0]);
		$(".tb-wrapper-main")[0].removeChild($(".supplement-relate")[0]);
		$(".tb-wrapper-main")[0].removeChild($(".tb-sortbar")[0]);
		$(".tb-wrapper-main")[0].removeChild($(".tb-filter")[0]);
		$(".tb-container")[0].removeChild($(".tb-wrapper-sub")[0]);
		$(".tb-container")[0].style.margin = "80px 0";

		//delete stuff from item boxes
		var allItemBoxes = document.getElementsByClassName("item-box");
		for (var i = 0; i < allItemBoxes.length; i++) {
			var item = allItemBoxes[i];
			var itemChildren = item.childNodes;
			while(itemChildren[2]) {
				item.removeChild(itemChildren[2]);
			}
		}

		//shorten column length
		var allItems = document.getElementsByClassName("item");
		for (var i = 0; i < allItems.length; i++) {
			var item = allItems[i];
			item.style.height="233px";
		}

		var allPics = document.getElementsByClassName("pic");
		for (var i = 0; i < allPics.length; i++) {
			var pic = allPics[i];
			var picChild = allPics[i].childNodes;
			while(picChild[2]) {
				pic.removeChild(picChild[2]);
			}
		}

		$(".tb-pagination")[0].parentNode.removeChild($(".tb-pagination")[0]);

	} 

	// clean tmall details page
	else if (document.URL.indexOf("detail.tmall.com") != -1) {
		var keep = $("#detail")[0];
		while (document.body.firstChild) {
		    document.body.removeChild(document.body.firstChild);
		}
		document.body.appendChild(keep);
		document.getElementsByTagName('html')[0].classList.remove("w1190");
		var addCart = $(".tb-btn-basket")[0];
		$(".tb-wrap")[0].removeChild($(".tb-key")[0]);
		$(".tb-wrap")[0].appendChild(addCart);
		//addCart.innerHTML="<a href='#' rel='nofollow' style='margin: 20px 50px; line-height: 66px; height: 66px; min-width: 400px;'>Choose this item!</a>";
		addCart.innerHTML="<a href='#' rel='nofollow' style='margin: 20px 50px; line-height: 66px; height: 66px; min-width: 400px;'>选择这个！</a>";
		
		$("#J_DetailMeta")[0].style.margin = "80px 0 0 0";
		$(".tm-detail-meta")[0].style.minHeight	= "560px"
		$(".tm-action")[0].parentNode.removeChild($(".tm-action")[0]);
		$(".tb-meta")[0].parentNode.removeChild($(".tb-meta")[0]);
		if ($(".tm-ind-emPointCount")[0])
			$(".tm-ind-emPointCount")[0].parentNode.removeChild($(".tm-ind-emPointCount")[0]);
		$(".tm-ser")[0].parentNode.removeChild($(".tm-ser")[0]);

		//remove link from photo
		var picDivChildren = $(".tb-booth")[0].childNodes[1];
		var pic = picDivChildren.childNodes[1];
		$(".tb-booth")[0].removeChild($(".tb-booth")[0].childNodes[1]);
		$(".tb-booth")[0].appendChild(pic);
	}

	var shade = document.createElement('div');
	shade.className = 'shade';

	var header = document.createElement('div');
	header.className = 'header';
	header.style.padding = "10px 50px;"

	var logoBox = document.createElement('div');
	logoBox.className = 'logoBox';

	var logo = document.createElement('img');
	logo.className ='logo';
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
	if (document.URL.indexOf("s.taobao.com") != -1 || document.URL.indexOf("detail.tmall.com") != -1) {
		header.appendChild(timerContainer);
	}

	document.body.appendChild(shade);
	document.body.appendChild(header);

	var modal = document.createElement('div');
	modal.innerHTML = window.localStorage.getItem('taskMsg');
	modal.className = "modal expText"; 
	modal.setAttribute('id','modal');
	document.body.appendChild(modal);

	if (document.URL.indexOf("s.taobao.com") != -1) {
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

	if (document.URL.indexOf("detail.tmall.com") != -1) {
		$(".tb-btn-basket")[0].onclick = function() {
			chrome.runtime.sendMessage({getstartTaskTime:true}, function(response) {
				if ((Date.now() - response.startTaskTime)/1000 < 30) {
					//alert("You're going too fast! Please go back and consider some other items! The study requires a minimum of 8 minutes.");
					alert("你做的太快了！请回去考虑一些其他的产品！");
					chrome.runtime.sendMessage({sentAlert:true});
				} else {
					submitTask();
				}
			});
		};
	}
	
});