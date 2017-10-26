"use strict";
(function($) {
	$('.nav-menu a').click(function() {
		$('.nav-menu a').removeClass('active');
		$(this).addClass('active');
	});
	$('.nav-menu a:nth-child(1)').click(function() {
		$('.nav-menu-underline').removeClass('d');
		$('.nav-menu-underline').removeClass('g');
		$('.nav-menu-underline').addClass('p');
	});
	$('.nav-menu a:nth-child(2)').click(function() {
		$('.nav-menu-underline').removeClass('p');
		$('.nav-menu-underline').removeClass('g');
		$('.nav-menu-underline').addClass('d');
	});
	$('.nav-menu a:nth-child(3)').click(function() {
		$('.nav-menu-underline').removeClass('p');
		$('.nav-menu-underline').removeClass('d');
		$('.nav-menu-underline').addClass('g');
	});
})(jQuery);