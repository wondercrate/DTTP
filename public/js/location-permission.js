"use strict";
(function($) {
	$('.location-permission-modal-footer button').click(function() {
		$('.location-permission-modal').removeClass('toggled');
		$('.location-permission-modal-overlay').removeClass('toggled');
	});
})(jQuery);
