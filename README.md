Gmail Sender
=======

Sends emails by a given Gmail account.

Installation
-------

	npm install gmail-sender

Usage
-------

	var Gmailer = require("gmail-sender");

	// any options can be set here...
	Gmailer.options({
		smtp: {
			service: "Gmail",
			user: "yourname@gmail.com",
			pass: "yourpassword"
		}
	});

	// any options set here, will overwrite options from above...
	Gmailer.send({
    	subject: "Demo Mail",
    	template: "./assets/templates/demo.html",
    	from: "'Gmail Sender'",
    	to: {
        	email: "someone@someone.com",
        	name: "Five",
        	surname: "Johnny"
    	},
    	data: {
        	name: "Five",
        	surname: "Johnny",
        	id: "28329m82198j"
    	},
    	attachments: [
        	{
            	fileName: "html5.png",
            	filePath: "./assets/attachments/html5.png",
            	cid: "html5@demo"
        	}
    	]
	});

Options
-------

Any options can be set by both methods `options()` and `send()`. With `options()` you can define default configuration, e.g. from an extra local file, that is not in a repository. All options to `send()` will overwrite default.

The folder assets holds HTML mail template and attached files.

Use option `text` to set a message text instead of using a template.