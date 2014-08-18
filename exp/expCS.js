if (document.URL.indexOf("exp/finished.html") == -1 && window.localStorage.getItem('finished')) {
	alert("You have already completed this experiment!");
	chrome.runtime.sendMessage({sendToUninstall:true});
}

if (!window.localStorage.getItem('started')) {
	var expStartTime = Date.now();
	window.localStorage.setItem('expStartTime',expStartTime); 

	window.localStorage.setItem('started',true);
	var firstTime = {stopTime: window.localStorage.getItem('startTime'), userID: window.localStorage.getItem('userID'), condition: window.localStorage.getItem('condition')};
	chrome.runtime.sendMessage({started:firstTime});
}

var timerUpdate = setInterval(function () {
	var date = new Date("1/1/1970");
	var secsPassedSinceStart = parseInt(Date.now() - window.localStorage.getItem('expStartTime'))/1000;
	date.setSeconds(secsPassedSinceStart);
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	$("#timer")[0].innerHTML = minutes + ":" + seconds;
	if ((secsPassedSinceStart/60) > 8) {
		if (window.localStorage.getItem('task') > 4) {
			clearInterval(timerUpdate);
			alert("Thanks! Time's up! Redirecting you to a quick wrap-up survey.");
			chrome.runtime.sendMessage({sendToFinish:true}, function(response) {
			    window.localStorage.setItem('finished', true);
			});	
		} else {
			chrome.runtime.sendMessage({minTimePassed:true});
		}
	}
}, 1000);

document.addEventListener("DOMContentLoaded", function(event) {
	// disable right click context menu
	document.body.setAttribute("oncontextmenu","return false");

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

	}
	// clean taobao items page
	else if(document.URL.indexOf("item.taobao.com") != -1) {
		var keep = $("#detail")[0];
		// // don't remove scripts!
		var child = document.body.firstChild;
		while (child) {
			console.log(child);
			var oldChild = child;
			child = oldChild.nextSibling;
			if(oldChild.tagName!='SCRIPT') {
			    document.body.removeChild(oldChild);
			}
		}
		document.body.appendChild(keep);
		// var keep2 = $(".tb-detail-bd")[0];
		// while (keep2.firstChild) {
		//     keep2.removeChild(keep2.firstChild);
		// }
		// keep.appendChild(keep2);
		$(".tb-detail-bd")[0].removeChild($(".tb-sidebar")[0]);
		$(".tb-wrap")[0].removeChild($(".tb-key")[0]);
		$(".tb-wrap")[0].removeChild($(".tb-extra")[0]);
		$("#J_Social")[0].parentNode.removeChild($("#J_Social")[0]);
		$(".tb-detail-bd")[0].style.margin = "80px 0 0 0";
	} else if (document.URL.indexOf("detail.tmall.com") != -1) {
		var keep = $("#detail")[0];
		while (document.body.firstChild) {
		    document.body.removeChild(document.body.firstChild);
		}
		document.body.appendChild(keep);
		document.getElementsByTagName('html')[0].classList.remove("w1190");
		var addCart = $(".tb-btn-basket")[0];
		$(".tb-wrap")[0].removeChild($(".tb-key")[0]);
		$(".tb-wrap")[0].appendChild(addCart);
		addCart.innerHTML="<a href='#' rel='nofollow' style='margin: 20px 50px; line-height: 66px; height: 66px; min-width: 400px;'>Choose this item!</a>";
		
		$("#J_DetailMeta")[0].style.margin = "80px 0 0 0";
		$(".tm-detail-meta")[0].style.minHeight	= "560px"
		$(".tm-action")[0].parentNode.removeChild($(".tm-action")[0]);
		$(".tb-meta")[0].parentNode.removeChild($(".tb-meta")[0]);
		if ($(".tm-ind-emPointCount")[0])
			$(".tm-ind-emPointCount")[0].parentNode.removeChild($(".tm-ind-emPointCount")[0]);
		$(".tm-ser")[0].parentNode.removeChild($(".tm-ser")[0]);

		$(".tb-btn-basket")[0].onclick=function(){
			console.log($("#taskFinish"));
			$("#taskFinish").submit();
		};
		//remove link from photo
		var picDivChildren = $(".tb-booth")[0].childNodes[1];
		console.log(picDivChildren.childNodes);
		var pic = picDivChildren.childNodes[1];
		$(".tb-booth")[0].removeChild($(".tb-booth")[0].childNodes[1]);
		$(".tb-booth")[0].appendChild(pic);
	}

	//var iframe = document.createElement('iframe');

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

	// var min = document.createElement('div');
	// min.className = 'min';
	// min.innerHTML = "<a id='minLink' href='#' title='Minimize modal'>&#8212;</a>"
	// header.appendChild(min);

	// var expand = document.createElement('div');
	// expand.className = 'expand';
	// expand.innerHTML = "<a id='exLink' href='#' title='Maximize modal'>+</a>"
	// header.appendChild(expand);

	var timer = document.createElement('div');
	timer.setAttribute('id',"timer")
	timer.setAttribute('class',"timer")
	header.appendChild(timer);

	document.body.appendChild(shade);
	document.body.appendChild(header);

	var modal = document.createElement('div');
	modal.innerHTML = '<p>' + window.localStorage.getItem('taskMsg') + '</p>';
	modal.className = "modal expText"; 
	modal.setAttribute('id','modal');
	document.body.appendChild(modal);

	var f = document.createElement("form");
	f.setAttribute('method',"post");
	f.setAttribute('id','taskFinish');

	var i = document.createElement("input"); //input element, text
	i.setAttribute('type',"text");
	i.setAttribute('name',"userid");
	// alert("ecs.js: " + window.localStorage.getItem('userID'));
    i.setAttribute('value', window.localStorage.getItem('userID'));
	i.style.visibility = "hidden";

	var i2 = document.createElement("input"); //input element, text
	i2.setAttribute('type',"text");
	i2.setAttribute('name',"url");
	i2.setAttribute('value', document.URL);
	// i2.setAttribute('size','100%');
	i2.style.visibility = "hidden";

	// submit as line above
	// var submitButton = document.createElement("input"); //input element, Submit button
	// submitButton.setAttribute('type',"submit");
	// submitButton.setAttribute('value',"Submit");

	f.appendChild(i);
	f.appendChild(i2);
	// f.appendChild(submitButton);

	modal.appendChild(f);


	if (getURLParameter('task')!= null) {
		modal.style.visibility = "visible";
		shade.style.visibility = "visible";
		// min.style.display = "inline";
	} else if (window.localStorage.getItem('taskMsg')) {
		// expand.style.display = "inline";
	}

	$(shade).click(function() {
		shade.style.visibility = "hidden";
    	$(modal).slideUp();
    	// min.style.display = "none";
    	// expand.style.display = "inline";
    	return false; 
	});

	// $(min).click(function(){
 //    	shade.style.visibility = "hidden";
 //    	$(modal).slideUp();
 //    	min.style.display = "none";
 //    	expand.style.display = "inline";
 //    	return false; 
 //    });

	$(header).click(function(){
		modal.style.visibility = "visible";
		shade.style.visibility = "visible";
		$(modal).slideDown();
    	// min.style.display = "inline";
    	// expand.style.display = "none";
    	return false; 
    });

	// $(expand).click(function(){
	// 	modal.style.visibility = "visible";
	// 	shade.style.visibility = "visible";
	// 	$(modal).slideDown();
 //    	min.style.display = "inline";
 //    	expand.style.display = "none";
 //    	return false; 
 //    });

	$(f).submit(function(){
	   var formData = $(this).serialize();
	   console.log(formData);
	   //var url = i2.value;
	   //console.log(url);
		// $.ajax({
		//     url: window.localStorage.getItem('submitUrl'),
		//     type: "post",
		//     data: formData,
		//     success: function (data) {
		//         alert(data)
		//     }
		// });


		function submitTask() {
			$.post('http://stanford.edu/~fangx/cgi-bin/alibaba/taskSubmit.php?number='+window.localStorage.getItem('task'), formData, function(response) {
				//alert(response);
			});
			// save time of submit
			window.localStorage.setItem('lastTime', currTime); 

			// call save csv files, open new window for new task
			chrome.runtime.sendMessage({finishedTask: window.localStorage.getItem('task')}, function(response) {
			    console.log(response.finished);	
			    if (response.finished) {
			    	window.localStorage.setItem('finished', true);
			    }   
			});
		}

		var currTime = new Date().getTime() / 1000;
		if (window.localStorage.getItem('lastTime') && (window.localStorage.getItem('lastTime') - currTime) < 60) {
			var r = confirm("Please take your time, and browse as you normally would! The experiment will take the same amount of time no matter your speed of completion. Are you sure you want to submit?");
			if (r == true) {
			   submitTask();
			} 
		} else {
			submitTask();
		}

	    return false;
	});

});

