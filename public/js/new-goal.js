"use strict";
(function($) {
	$('.new-goal-holder').click(function() {
		$('.new-goal-modal-overlay').addClass('toggled');
		$('.new-goal-modal').addClass('toggled');
	});
	$('.new-goal-exit').click(function() {
		$('.new-goal-modal').removeClass('toggled');
		$('.new-goal-modal-overlay').removeClass('toggled');
	});
	$('.new-goal-modal-footer button').click(function() {
		$('.new-goal-modal').removeClass('toggled');
		$('.new-goal-modal-overlay').removeClass('toggled');
	});
	$('.goal-options-grid.yes').click(function() {
		$('.goal-option-slider').addClass('on');
		$('.goal-options-grid span').addClass('active');
	});
	$('.goal-options-grid.no').click(function() {
		$('.goal-option-slider').removeClass('on');
	})
})(jQuery);
