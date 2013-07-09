(function($) {

	var internal = {
		startPos: undefined,
		startElement: undefined,
		endPos: undefined,
		endElement: undefined,
		// isFirstChoice: true,

		//清除现有的选区
		clear: function() {
			if (window.getSelection) {
				var selection = window.getSelection();
				selection.removeAllRanges();
			} else if (document.selection.createRange) { // IE
				document.selection.empty();
			}
		},

		getTextNode: function(element) {
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
		},

		getElement: function(element) {
			return $(element).first().get(0);
		},

		//判断起点是否在终点之前
		isPrevious: function() {
			var result = false;
			//DOCUMENT_POSITION_FOLLOWING:	4
			if (internal.startElement.compareDocumentPosition(internal.endElement) === 4) {
				result = true;
			}
			if (internal.startElement === internal.endElement && internal.startPos < internal.endPos) {
				result = true;
			}
			return result;
		},

		debug: function() {
			console.log('**************');
			console.log(internal.debug.caller);
			console.log(internal.startPos);
			// console.log(startElement);
			console.log(internal.endPos);
			console.log('compare result: ' + internal.isPrevious());
			// console.log(endElement);
			console.log('|||||||||||||||\n');
		},

		//设置起点
		setupStart: function() {
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

				internal.startPos = start.baseOffset;
				internal.startElement = start.baseNode.parentNode;
				console.log(start.toString() + ' is: #' + internal.startPos + ' of ' + internal.startElement.toString());

				// if (end !== undefined) {
				// 	selectText();
				// }
				internal.debug();
			}
		},

		setupEnd: function() {
			internal.debug();
			// if (!isFirstChoice) {
			// 	start.collapseToEnd();
			// }
			var end = window.getSelection();
			end.modify('extend', 'backward', 'character');
			if (end.type !== 'None' /*&& end.isCollapsed !== true*/ ) {

				internal.endPos = end.baseOffset;
				internal.endElement = end.baseNode.parentNode;
				console.log(end.toString() + ' is: #' + internal.endPos + ' of ' + internal.endElement.toString());
				internal.debug();

				methods.selectText();
			}
		}
	};

	var methods = {
		setRange: function(range) {

			internal.clear();

			if (typeof range !== 'object') {
				return;
			}

			var startNode = false;
			var endNode = false;

			if (window.getSelection) {

				var selection = window.getSelection();
				var rangeObj = document.createRange();

				if (range.startElement !== undefined) {
					startNode = internal.getTextNode(range.startElement);
				}

				if (range.endElement !== undefined) {
					endNode = internal.getTextNode(range.endElement);
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
					startNode = internal.getElement(range.startElement);
				}

				if (range.endElement !== undefined) {
					endNode = internal.getElement(range.endElement);
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
		},

		clear: function() {
			internal.clear();
			return this;
		},

		//获取选区内文字
		toString: function() {
			if (window.getSelection) {
				var selRange = window.getSelection();
				return selRange.toString();
			} else if (document.selection) { // IE
				var textRange = document.selection.createRange();
				return textRange.text;
			}

		},

		//进入选择起点模式
		selectEnd: function() {
			console.log('end');
			this.unbind('click', internal.setupStart);
			this.bind('click', internal.setupEnd);
		},

		//进入选择终点模式
		selectBegin: function() {
			console.log('start');
			this.bind('click', internal.setupStart);
			this.unbind('click', internal.setupEnd);
		},

		//根据指定的起点和终点， 选择文本

		selectText: function() {
			var isStartPrevious = internal.isPrevious(),
				startPos = internal.startPos,
				endPos = internal.endPos,
				startElement = internal.startElement,
				endElement = internal.endElement;


			methods.setRange({
				start: isStartPrevious ? startPos : endPos,
				startElement: isStartPrevious ? startElement : endElement,
				end: isStartPrevious ? endPos : startPos,
				endElement: isStartPrevious ? endElement : startElement
			});

			console.log('User select text: ' + this.toString());
			// isFirstChoice = false;
		}
	};

	$.textSelect = $.fn.textSelect = function(method) {
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this,
				Array.prototype.slice.call(arguments, 1));
		} else {
			return methods['toString'].apply(this,
				Array.prototype.slice.call(arguments, 1));
		}
	};

})(jQuery);