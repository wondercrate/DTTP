"use strict";
(function($) {
	$('.nav-burger').click(function() {
		$(this).addClass('downsize');
		$('.popout-nav').addClass('expand');
	});
	$('.popout-nav-top-exit').click(function() {
		$('.nav-burger').removeClass('downsize');
		$('.popout-nav').removeClass('expand');
	});
	$('.popout-nav-top a').click(function() {
		$('.nav-burger').removeClass('downsize');
		$('.popout-nav').removeClass('expand');
	});
})(jQuery);