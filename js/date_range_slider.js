/**
 * @file Integration for the jQRangeSlider widget and Drupal
 * @author griffinj@lafayette.edu
 *
 */

(function($, Drupal) {

    Drupal.behaviors.islandoraDssDateRangeSlider = function(context) {

	/*
	$('.islandora-solr-facet-date').last().append($('<div class=".islandora-solr-facet-date-slider"></div>').dateRangeSlider( { bounds: [ new Date($('.islandora-facet-date').first().text()),
																	      new Date($(this).text()) ] } ));
	*/

	//max: +new Date($(this).text()) }));

	var $dateSlider = $('<div class="islandora-solr-facet-date-slider"></div>');

	$('.islandora-solr-facet-list li').last().after( $dateSlider);
	$dateSlider.after('<div class="islandora-solr-facet-date-term"></div>');
	$dateSlider.after('<div class="islandora-solr-facet-date-init"></div>');

	options = { max: +new Date( $('.islandora-solr-facet-date').first().text()),
		    min: +new Date( $('.islandora-solr-facet-date').last().text()),
		    range: true,
		    slide: function(e, ui) {
		
		$('.islandora-solr-facet-date-init').text((new Date(ui.values[0])).toString());
		$('.islandora-solr-facet-date-term').text((new Date(ui.values[1])).toString());
	    },
		    stop: function(e, ui) {

		
		
		//$('.islandora-solr-facet-date-init').text((new Date(ui.values[0])).toString());
		//$('.islandora-solr-facet-date-term').text((new Date(ui.values[1])).toString());

		var dateField = /f\[\d\]\=(.+?)\:/.exec();
		var query = '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']';
	    },
	};

	$dateSlider.slider(options);
    };

    // @todo: Refactor
    $(document).ready(function() {

	    Drupal.behaviors.islandoraDssDateRangeSlider();
	});

})(jQuery, Drupal);