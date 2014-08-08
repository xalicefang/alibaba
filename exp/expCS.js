function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

// if first time entering into task
if (getURLParameter('task')!= null) {
	window.localStorage.setItem('task', getURLParameter('task'));
	if (getURLParameter('task') == 1) {
		window.localStorage.setItem('taskMsg', "You're going on a hike next weekend. Look for a pair of Nike tennis shoes you would wear. Please search and browse as you would normally do and paste the URL of your selection in the box below. You may close this box at any time, and open it again by clicking on the orange Taobao icon to the upper right of your browser.");
	} else if (getURLParameter('task') == 2) {
		window.localStorage.setItem('taskMsg', 'You are looking for an iPhone 5c.');
	} else if (getURLParameter('task') == 3) {
		window.localStorage.setItem('taskMsg', 'It’s getting hot outside. Find a new summer outfit.');
	} else if (getURLParameter('task') == 4) {
		window.localStorage.setItem('taskMsg', "Your friend's birthday is next week. Find a present for him/ her.");
	} else if (getURLParameter('task') == 5) {
		window.localStorage.setItem('taskMsg', 'Your water kettle is in need of replacement. Please find one here. ');
	} else if (getURLParameter('task') == 6) {
		window.localStorage.setItem('taskMsg', 'Your child (or a friend’s child) is getting ready for school and needs to buy new notebooks. Please find an item you would be willing to buy.');
	} else if (getURLParameter('task') == 7) {
		window.localStorage.setItem('taskMsg', 'Task 7.');
	} else if (getURLParameter('task') == 8) {
		window.localStorage.setItem('taskMsg', 'Task 8.');
	}
	// save task to bg
	chrome.runtime.sendMessage({task: getURLParameter('task')});
} 
// else get task from bgMsg
else {
	chrome.runtime.sendMessage({getTask: true}, function(response) {
		window.localStorage.setItem('task', response.task);
		if (response.task == 1) {
			window.localStorage.setItem('taskMsg', "You're going on a hike next weekend. Look for a pair of Nike tennis shoes you would wear. Please search and browse as you would normally do and paste the URL of your selection in the box below. You may close this box at any time, and open it again by clicking on the orange Taobao icon to the upper right of your browser.");
		} else if (response.task == 2) {
			window.localStorage.setItem('taskMsg', 'You are looking for an iPhone 5c.');
		} else if (response.task == 3) {
			window.localStorage.setItem('taskMsg', 'It’s getting hot outside. Find a new summer outfit.');
		} else if (response.task == 4) {
			window.localStorage.setItem('taskMsg', "Your friend's birthday is next week. Find a present for him/ her.");
		} else if (response.task == 5) {
			window.localStorage.setItem('taskMsg', 'Your water kettle is in need of replacement. Please find one here. ');
		} else if (response.task == 6) {
			window.localStorage.setItem('taskMsg', 'Your child (or a friend’s child) is getting ready for school and needs to buy new notebooks. Please find an item you would be willing to buy.');
		} else if (response.task == 7) {
			window.localStorage.setItem('taskMsg', 'Task 7.');
		} else if (response.task == 8) {
			window.localStorage.setItem('taskMsg', 'Task 8.');
		}
	});
}

document.addEventListener("DOMContentLoaded", function(event) {
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

	var min = document.createElement('div');
	min.className = 'min';
	min.innerHTML = "<a id='minLink' href='#' title='Minimize modal'>&#8212;</a>"
	header.appendChild(min);

	var expand = document.createElement('div');
	expand.className = 'expand';
	expand.innerHTML = "<a id='exLink' href='#' title='Maximize modal'>+</a>"
	header.appendChild(expand);

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
	i2.setAttribute('size','100%');

	// submit as line above
	var submitButton = document.createElement("input"); //input element, Submit button
	submitButton.setAttribute('type',"submit");
	submitButton.setAttribute('value',"Submit");

	f.appendChild(i);
	f.appendChild(i2);
	f.appendChild(submitButton);

	modal.appendChild(f);


	if (getURLParameter('task')!= null) {
		modal.style.visibility = "visible";
		shade.style.visibility = "visible";
		min.style.display = "inline";
	} else if (window.localStorage.getItem('taskMsg')) {
		expand.style.display = "inline";
	}

	$(min).click(function(){
    	shade.style.visibility = "hidden";
    	$(modal).slideUp();
    	min.style.display = "none";
    	expand.style.display = "inline";
    	return false; 
    });

	$(expand).click(function(){
		modal.style.visibility = "visible";
		shade.style.visibility = "visible";
		$(modal).slideDown();
    	min.style.display = "inline";
    	expand.style.display = "none";
    	return false; 
    });

	$(f).submit(function(){
	   var formData = $(this).serialize();
	   console.log(formData);
	   var url = i2.value;
	   console.log(url);
		// $.ajax({
		//     url: window.localStorage.getItem('submitUrl'),
		//     type: "post",
		//     data: formData,
		//     success: function (data) {
		//         alert(data)
		//     }
		// });


		var currTime = new Date().getTime() / 1000;
		if (window.localStorage.getItem('lastTime') && (window.localStorage.getItem('lastTime') - currTime) < 60) {
			var r = confirm("Please take your time, and browse as you normally would! The experiment will take the same amount of time no matter your speed of completion. Are you sure you want to submit?");
			if (r == true) {
			    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/taskSubmit.php?number='+window.localStorage.getItem('task'), formData, function(response) {
					//alert(response);
				});
		        window.localStorage.setItem('lastTime', currTime); 
		        // call save csv files, open new window for new task
				chrome.runtime.sendMessage({finishedTask: window.localStorage.getItem('task')});
			} 
		} else {
			// check to make sure link field okay!!!
			$.post('http://stanford.edu/~fangx/cgi-bin/alibaba/taskSubmit.php?number='+window.localStorage.getItem('task'), formData, function(response) {
				//alert(response);
			});
			// save time of submit
			window.localStorage.setItem('lastTime', currTime); 

			// call save csv files, open new window for new task
			chrome.runtime.sendMessage({finishedTask: window.localStorage.getItem('task')});
		}

	    return false;
	});

});

