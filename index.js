$(document).ready(function() {
	$('#begin').click(function() {
		$('#content').endSelect('end');
		$('#content').startSelect('begin');
	});

	$('#end').click(function() {
		$('#content').endSelect('begin');
		$('#content').startSelect('end');
	});

	$('#finish').click(function() {
		$('#content').endSelect('finish', function(){
			window.alert('This is callback');
		});
	});

	$('#text').click(function() {
		window.alert($('#content').getSelection().toString());
	});

	$('#clear').click(function() {
		$('#content').clearSelection();
	});
});