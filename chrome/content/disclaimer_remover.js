/* DisclaimerRemover namespace */

if (typeof DisclaimerRemover == "undefined") {
	var DisclaimerRemover = {};

	// Running an actual regex over the whole thing didn't work because 
	// there are newlines in the disclaimer. This finds the beginning and 
	// end parts and strips out whats in between. Might be some 
	// side-effects I didn't think about, but oh well.
	DisclaimerRemover.runRegex = function(text) {
		var result;
		var start_text ="The Alan Turing Institute is a limited liability company, registered in England";
		var reg = RegExp(start_text, "g");
		var res = reg.exec(text);
		if (res === null)
			return text;
		var idx1 = res.index;
		var end_text = "data and it explains your rights and how to raise concerns with us.";
		var reg = RegExp(end_text, "g");
		var res = reg.exec(text);
		if (res === null)
			return text;
		var idx2 = res.index;
		idx2 += end_text.length;
		return text.replace(text.substring(idx1, idx2), "");
	}

	/* READING MESSAGES */

	DisclaimerRemover.contentLoaded = function(event) {
		var body = event.originalTarget.body;
		if (!body.innerHTML)
			return;
		var clean = DisclaimerRemover.runRegex(body.innerHTML);
		body.innerHTML = clean;
	}

	DisclaimerRemover.onWindowLoad = function(event) {
		var mp = document.getElementById('messagepane');
		mp.addEventListener("DOMContentLoaded", DisclaimerRemover.contentLoaded, true);
	};

	/* COMPOSING MESSAGES */

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
		DisclaimerRemover.doComposeFixups(currentEditorDom);
	};

	DisclaimerRemover.initCompose = function() {
		document.addEventListener("load", DisclaimerRemover.onLoadComposePane, true);
	};
}
