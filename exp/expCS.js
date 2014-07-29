function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

// on finish, self uninstall!
// chrome.management.uninstallSelf({showConfirmDialog: false}, callback);

document.addEventListener("DOMContentLoaded", function(event) {
	if (getURLParameter('task') == 1) {
		chrome.runtime.sendMessage({user: true}, function(response) {
			//alert("response " + response.user);
			window.localStorage.setItem('userID', response.user);
		});
		window.localStorage.setItem('task', 1);
		window.localStorage.setItem('submitUrl', 'http://stanford.edu/~fangx/cgi-bin/alibaba/task1submit.php');
		window.localStorage.setItem('taskMsg', 'Welcome! For your first task, imagine you are shopping for a new vacuum cleaner.');
	} else if (getURLParameter('task') == 2) {
		window.localStorage.setItem('task', 2);
		window.localStorage.setItem('submitUrl', 'http://stanford.edu/~fangx/cgi-bin/alibaba/task2submit.php');
		window.localStorage.setItem('taskMsg', 'Task 2.');
	}

	//alert("cs " + window.localStorage.getItem('userID'));

	modal = document.createElement('div');
	modal.innerHTML = window.localStorage.getItem('taskMsg');
	modal.className = "modal"; 
	document.body.appendChild(modal);

	var f = document.createElement("form");
	f.setAttribute('method',"post");
	f.setAttribute('id','taskFinish');

	var i = document.createElement("input"); //input element, text
	i.setAttribute('type',"text");
	i.setAttribute('name',"userid");
	i.style.visibility = "hidden";
	i.setAttribute('value', window.localStorage.getItem('userID'));

	var i2 = document.createElement("input"); //input element, text
	i2.setAttribute('type',"text");
	i2.setAttribute('name',"url");

	var submitButton = document.createElement("input"); //input element, Submit button
	submitButton.setAttribute('type',"submit");
	submitButton.setAttribute('value',"Submit");

	f.appendChild(i);
	f.appendChild(i2);
	f.appendChild(submitButton);

	modal.appendChild(f);

	var closeButton = document.createElement('button');
	closeButton.innerHTML = "Close"
	modal.appendChild(closeButton);

	console.log(getURLParameter('task'));
	if (getURLParameter('task')==1 || getURLParameter('task')==2) {
		console.log("make visible!");
		modal.style.visibility = "visible";
	}

	closeButton.onclick = function() {
		// add toggle functionality!!!
		modal.style.visibility = "hidden";
	}

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

		$.post(window.localStorage.getItem('submitUrl'), formData, function(response) {
			alert(response);
		});

		// call save csv files, open new window for new task
		chrome.runtime.sendMessage({finishedTask: window.localStorage.getItem('task')});

	    return false;
	});


});

