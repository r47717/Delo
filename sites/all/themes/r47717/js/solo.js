;
(function($) {

Drupal.behaviors.solo = {
	attach: function(context, settings) {
		$("#svg-main-rect")
			.bind("mouseenter", function(){
				$(this).attr('fill', 'yellow');
			})
			.bind("mouseleave", function(){
				$(this).attr('fill', 'lightgray');
			});
	}
};

})(jQuery);