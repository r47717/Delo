(function($) {

Drupal.behaviors.shelf = {

  attach: function(context, settings) {
    if (context !== document) return;

    if ($('#shelf-svg').length === 0) return;

    var draw = SVG('shelf-svg').size(300, 200);

    draw.rect(10, 100).attr({fill: "black"}).x(10).y(10);
    draw.rect(300, 10).attr({fill: "black"}).y(90);
    draw.rect(10, 100).attr({fill: "black"}).x(280).y(10);

    $.getJSON('/rest/delo/shelf', function(data) {
      var x = 30;
      _.each(data, function(delo) {
        draw.rect(20, 80).attr({stroke: 'black', fill: 'lightgray', title: delo.title}).x(x).linkTo('/delo/take-from-shelf/' + delo.delo_id);
        draw.text(delo.delo_id).x(x);
      });
    });
  }
}

})(jQuery);