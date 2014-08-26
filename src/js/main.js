(function() {
	PocketHandler();

	function PocketHandler() {
		if (window.location.pathname.indexOf('/a/queue/') > -1) {
			// pageReader node is not present until the first article is loaded. Watch for it to be added.
			_initObserver();
		} else {
			// injected when already on an article page, handle article content
			ArticlesHandler();
		}

		function _initObserver() {
			var contentNode = document.querySelector('div#content');
			if (!contentNode) throw 'Could not calculate reading time - failed to parse content node';

			// create an observer instance
			var contentObserver;
			contentObserver = new MutationObserver(function (mutations) {
				var pageReaderAdded = false;
				for (m in mutations) {
					var addedNodes = mutations[m].addedNodes;
					for (n in addedNodes) {
						if (addedNodes[n].id === 'page_reader') pageReaderAdded = true;
					}
				}
				
				if (pageReaderAdded) {
					ArticlesHandler();
					contentObserver.disconnect();
				}
			});

			// pass in the target node, as well as the observer options
			contentObserver.observe(contentNode, { childList: true });
		}
	}

	function ArticlesHandler() {
		var AVG_WPM          = 200;
		var articlesObserver = _initObserver();
		var estNode;

		function _updateEstimate(estimate) {
			if (estimate && !isNaN(estimate)) {
				estNode.innerText =  parseInt(estimate) + ' minute read';	
			} else {
				throw 'Could not calculate reading time - improper estimate provided';
			}	
		}

		function _clearEstimate() {
			estNode.innerText = '';
		}

		function _initObserver() {
			var pageReaderNode  = document.querySelector('#page_reader');
			var articleBody;

			if (!pageReaderNode) throw 'Could not calculate reading time - failed to parse page_reader';

			// create an observer instance
			var articlesObserver = new MutationObserver(function(mutations) {
				if (typeof estNode === 'undefined')  estNode = _injectEstimateNode();

				if (typeof articleBody === 'undefined') {
					articleBody = document.querySelector('.text_body');
					if (!articleBody) throw 'Could not calculate reading time - failed to parse text_body';
				}

		  		if (!pageReaderNode.classList.contains('loading')) {
		  			var textContent = articleBody.textContent.trim();
		  			if (textContent.length > 0 ) {
		  				var words       = textContent.match(/\S+/g);
			  			var estimate    = parseInt(words.length / AVG_WPM);
			  			_updateEstimate(estimate);
		  			} else {
		  				_clearEstimate();
		  			}
		  		}
			});			

			// pass in the target node, as well as the observer options
			articlesObserver.observe(pageReaderNode, { attributes: true });
			return articlesObserver;
		}

		function _injectEstimateNode() {
			var refNode = document.querySelector('.reader_head h1');
			var newNode = document.createElement('h6');

			if (!refNode) throw 'Could not calculate reading time - failed to inject DOM node to hold estimate';

			_insertAfter(newNode, refNode);
			return newNode;
		}


		function _insertAfter(newNode, referenceNode) {
	    	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
		}
	}

})();