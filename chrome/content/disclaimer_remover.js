/* DisclaimerRemover namespace */

if (typeof DisclaimerRemover == "undefined") {
	var DisclaimerRemover = {};

	DisclaimerRemover.runRegex = function(text) {
		var result;
		var start_text ="The Alan Turing Institute is a limited liability company, registered in England";
		var reg = RegExp(start_text, "g");
		var idx1 = reg.exec(text).index;
		var end_text = "data and it explains your rights and how to raise concerns with us.";
		var reg = RegExp(end_text, "g");
		var idx2 = reg.exec(text).index;
		idx2 += end_text.length;
		return text.replace(text.substring(idx1, idx2), "");
	}

	DisclaimerRemover.removeDisclaimer = function(contentDocument) {
		console.log(contentDocument);
		console.log(contentDocument.body.innerHTML);
		var html = contentDocument.getElementsByTagName("html")[0];
		//var html = contentDocument.documentElement.innerHTML;
		var clean = DisclaimerRemover.runRegex(html.innerHTML);
		contentDocument.documentElement.innerHTML = clean;
		console.log("Replaced innerHTML");
	}

	DisclaimerRemover.onLoadMessagePane = function(event) {
		/* Only process when there is a message present */
		if (!gMessageDisplay) {
			console.log("No message display.");
			return;
		}
		if (!gMessageDisplay.displayedMessage) {
			console.log("No displayed message.");
			return;
		}
		document.removeEventListener("load", DisclaimerRemover.onLoadMessagePane, true);
		var mp = document.getElementById('messagepane');
		DisclaimerRemover.removeDisclaimer(mp.contentDocument);
		document.addEventListener("load", DisclaimerRemover.onLoadMessagePane, true);
	};


	DisclaimerRemover.doComposeFixups = function(currentEditorDom) {
		(function iterate_node(node) {
			if (node.nodeType == 3) {
				var text = DisclaimerRemover.runRegex(node.data);
				node.data = text;
			} else if (node.nodeType == 1) {
				for (var i=0; i<node.childNodes.length; i++) {
					iterate_node(node.childNodes[i]);
				}
			}
		})(currentEditorDom);
	}

	DisclaimerRemover.init = function() {
		document.addEventListener("load", DisclaimerRemover.onLoadMessagePane, true);
	};

	/* for the compose window */
	DisclaimerRemover.onLoadComposePane = function(event) {
		var type = GetCurrentEditorType();
		if (type != "htmlmail") {
			return;
		}

		var currentEditor = GetCurrentEditor();
		if (currentEditor === null)
			return;

		var currentEditorDom = currentEditor.rootElement;
		//DisclaimerRemover.doFixups(currentEditorDom);
		DisclaimerRemover.doComposeFixups(currentEditorDom);
	};

	DisclaimerRemover.initCompose = function() {
		document.addEventListener("load", DisclaimerRemover.onLoadComposePane, true);
	};
}
