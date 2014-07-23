function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

// on finish, self uninstall!
// chrome.management.uninstallSelf({showConfirmDialog: false}, callback);

document.addEventListener("DOMContentLoaded", function(event) {
	if (getURLParameter('task') == 1) {
		window.localStorage.setItem('task', 1);
		window.localStorage.setItem('submitUrl', 'http://stanford.edu/~fangx/cgi-bin/alibaba/task1submit.php');
		window.localStorage.setItem('taskMsg', 'Welcome! For your first task, imagine you are shopping for a new vacuum cleaner.');
	}

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
	i.setAttribute('value',3)

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

	    $.ajax({
	        url: window.localStorage.getItem('submitUrl'),
	        type: 'POST',
	        data: formData,
	        async: false,
	        success: function (data) {
	            alert(data)
	        },
	        cache: false,
	        contentType: false,
	        processData: false
	    });


		// call save csv files, open new window for new task
		chrome.runtime.sendMessage({finishedTask: window.localStorage.getItem('task')});

	    return false;
	});


});

