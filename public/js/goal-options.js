"use strict";
(function($) {
	$('.goal-options-grid.yes').click(function() {
		$('.goal-option-slider').addClass('on');
	});
	$('.goal-options-grid.no').click(function() {
		$('.goal-option-slider').removeClass('on');
	})
})