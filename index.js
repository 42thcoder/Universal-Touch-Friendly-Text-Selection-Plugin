//清除现有的选区

function clear() {
	if (window.getSelection) {
		var selection = window.getSelection();
		selection.removeAllRanges();
	} else if (document.selection.createRange) { // Internet Explorer
		document.selection.empty();
	}
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


//设置选区范围

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

	} else if (document.selection) { // Internet Explorer

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

//获取选区内文字

function getSelectedText() {
	if (window.getSelection) {
		var selRange = window.getSelection();
		return selRange.toString();
	} else if (document.selection) { // Internet Explorer
		var textRange = document.selection.createRange();
		return textRange.text;
	}
}
var start, end,
	startPos, endPos,
	startElement, endElement;

//确定起点

function selectBegin() {
	console.log('start');
	// $('.highlighted').remove();
	start = window.getSelection();
	start.modify('extend', 'forward', 'character');
	//显示游标
	// var newNode = document.createElement('span');
	// newNode.setAttribute('class', 'highlighted');
	// newNode.appendChild(document.createTextNode('|||'));
	// start.getRangeAt(0).insertNode(newNode);
	if(start.type !== 'None'){
		startPos = start.baseOffset;
		startElement = start.baseNode.parentNode;
		console.log(start.toString() + ' is: #' + startPos + ' of ' + startElement.toString());
	}
}

//确定终点

function selectEnd() {
	console.log('end');
	end = window.getSelection();
	end.modify('extend', 'backward', 'character');
	endPos = end.baseOffset;
	endElement = start.baseNode.parentNode;
	console.log(end.toString() + ' is: #' + endPos + ' of ' + endElement.toString());

	setRange({
		start: startPos,
		startElement: startElement,
		end: endPos,
		endElement: endElement
	});

	console.log('User select text: ' + getSelectedText());
}

function selectText() {

	//选择文本
	setRange({
		start: startPos,
		startElement: startElement,
		end: endPos,
		endElement: endElement
	});

	console.log('User select text: ' + getSelectedText());
}

$(document).ready(function() {
	$('#begin').click(function() {
		$('body').unbind('click', selectEnd);
		$('body').bind('click', selectBegin);
	});

	$('#end').click(function() {
		$('body').unbind('click', selectBegin);
		$('body').bind('click', selectEnd);
	});
});