(function($) {
	var startPos,
		startElement,
		endPos,
		endElement,
		isFirstChoice = false;

	function debug() {
		// console.log('**************');
		console.log(debug.caller.name);
		// console.log(startPos);
		// console.log(startElement);
		// console.log(endPos);
		// console.log('compare result: ' + isPrevious());
		// console.log(endElement);
		// console.log('|||||||||||||||\n');
	}

	function getTextNode(element) {
		var domObj = $(element).first().get(0);

		if (window.getSelection && domObj.childNodes) {
			var nodes = domObj.childNodes;
			for (var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				if (node.nodeType === 3) {
					return node;
				}
			}
		} else if (document.selection) {
			return domObj;
		}
		return false;
	}

	function getElement(element) {
		return $(element).first().get(0);
	}

	function clear() {
		console.log('清除现有的选区');

		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection) { // IE
			document.selection.empty();
		}
	}

	function setRange(range) {

		clear();

		if (typeof range !== 'object') {
			return;
		}

		var startNode = false;
		var endNode = false;

		if (window.getSelection) {

			var selection = window.getSelection();
			var rangeObj = document.createRange();

			if (range.startElement !== undefined) {
				startNode = getTextNode(range.startElement);
			}

			if (range.endElement !== undefined) {
				endNode = getTextNode(range.endElement);
			}

			if (range.start !== undefined && startNode) {

				rangeObj.setStart(startNode, range.start);
			}

			if (range.end !== undefined && endNode) {
				rangeObj.setEnd(endNode, range.end);
			}

			selection.addRange(rangeObj);

		} else if (document.selection) { // IE

			var rangeObj = document.body.createTextRange();

			if (range.startElement !== undefined) {
				startNode = getElement(range.startElement);
			}

			if (range.endElement !== undefined) {
				endNode = getElement(range.endElement);
			}


			if (range.start && startNode) {
				var startRange = rangeObj.duplicate();
				startRange.moveToElementText(startNode);
				startRange.move('character', range.start);

				rangeObj.setEndPoint('StartToStart', startRange);
			}

			if (range.end && endNode) {
				var endRange = rangeObj.duplicate();
				endRange.moveToElementText(endNode);
				endRange.move('character', range.end);

				rangeObj.setEndPoint('EndToEnd', endRange);
			}

			rangeObj.select();
		}
		return this;
	}
	//判断起点是否在终点之前

	function isPrevious() {
		var result = false;
		//DOCUMENT_POSITION_FOLLOWING:	4
		if (startElement.compareDocumentPosition(endElement) === 4) {
			result = true;
		}
		if (startElement === endElement && startPos < endPos) {
			result = true;
		}
		return result;
	}

	//根据指定的起点和终点, 选择文本

	function selectText() {
		var isStartPrevious = isPrevious();

		setRange({
			start: isStartPrevious ? startPos : endPos,
			startElement: isStartPrevious ? startElement : endElement,
			end: isStartPrevious ? endPos : startPos,
			endElement: isStartPrevious ? endElement : startElement
		});

		// isFirstChoice = false;
	}

	//设置起点

	function setupStart() {
		// if (!isFirstChoice) {
		// 	start.collapseToStart();
		// }
		// $('.highlighted').remove();
		var start = window.getSelection();
		start.modify('extend', 'forward', 'character');
		if (start.type !== 'None') {
			//显示游标
			// var newNode = document.createElement('span');
			// newNode.setAttribute('class', 'highlighted');
			// newNode.appendChild(document.createTextNode('|||'));
			// start.getRangeAt(0).insertNode(newNode);

			startPos = start.baseOffset;
			startElement = start.baseNode.parentNode;
			console.log('begin: ' + ' is: #' + startPos + ' of ' + startElement.toString());
			console.log(start);

			// if (end !== undefined) {
			// 	selectText();
			// }
			debug();
		}
	}

	function setupEnd() {
		debug();
		// if (!isFirstChoice) {
		// 	start.collapseToEnd();
		// }
		// console.log('end选择前' +  ' is: #' + endPos + ' of ' + endElement.toString());
		var end = window.getSelection();
		end.modify('extend', 'backward', 'character');
		if (end.type !== 'None' && isFirstChoice === true /*&& end.isCollapsed !== true*/ ) {

			endPos = end.baseOffset;
			endElement = end.baseNode.parentNode;
			console.log('end' + ' is: #' + endPos + ' of ' + endElement.toString());
			console.log(end);
			debug();

			selectText();
			console.log('User select text: ' + $('body').getSelection().toString());
		}
		isFirstChoice = true;
	}

	$.fn.extend({
		startSelect: function(pivot, options) {
			console.log('进入选择模式：' + pivot);

			if (pivot !== 'begin' && pivot !== 'end') {
				return;
			}

			var defaults = {};
			options = $.extend(defaults, options);

			console.log('bind: ' + (pivot === 'begin' ? setupStart.name : setupEnd.name));
			this.bind('click', pivot === 'begin' ? setupStart : setupEnd);
		},

		endSelect: function(pivot, callback) {
			console.log('结束选择：' + pivot);

			if (pivot !== 'begin' && pivot !== 'end') {
				return;
			}

			console.log('unbind: ' + (pivot === 'end' ? setupStart.name : setupEnd.name));
			this.unbind('click', pivot === 'begin' ? setupStart : setupEnd);
		},

		getSelection: function() {
			console.log('获得选区');

			if (window.getSelection) {
				return window.getSelection();

			} else if (document.selection) { // IE
				return document.selection.createRange();
			}
		},

		clearSelection: function() {
			console.log('清除现有的选区');

			clear();
		},

		toString: function() {
			console.log('获得当前选区的文字');

			if (window.getSelection) {
				// var selRange = window.getSelection();
				return this.toString();
			} else if (document.selection) { // IE
				// var textRange = document.selection.createRange();
				return this.text;
			}
		}
	});
})(jQuery);