$(document).ready(function() {
	$('#begin').click(function() {
		$('#content').endSelect('end');
		$('#content').startSelect('begin');
	});

	$('#end').click(function() {
		$('#content').endSelect('begin');
		$('#content').startSelect('end');
	});

	$('#text').click(function() {
		alert($('#content').getSelection().toString());
	});

	$('#clear').click(function() {
		$('#content').clearSelection();
	});
});