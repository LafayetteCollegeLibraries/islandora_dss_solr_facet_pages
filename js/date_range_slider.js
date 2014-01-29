/**
 * @file Integration for the jQRangeSlider widget and Drupal
 * @author griffinj@lafayette.edu
 *
 */

/**
 * Class for handling Islandora Solr Queries
 *
 */

FIELD_MAP = { 'Date.Artifact.Lower' : 'eastasia.Date.Artifact.Lower',
	      'Date.Artifact.Upper' : 'eastasia.Date.Artifact.Lower',
	      'Date.Image.Lower' : 'eastasia.Date.Image.Lower',
	      'Date.Image.Upper' : 'eastasia.Date.Image.Lower',
	      'dc.date.accessioned' : 'ldr.dc.date.accessioned',
	      'dc.contributor.author' : 'ldr.dc.contributor.author',
	      'Date' : 'geology_slides.date.search', };
    
function fieldMap(field) {
	
    return FIELD_MAP[field];
};

var SolrQuery = function($, options) {

    this.$ = $;
    this.options = $.extend({
	    searchPath: '/islandora/search',
	    query: '',
	    fields: [],
	    params: {},
	    url: '',
	}, options);

    this.params = $.extend({}, this.options.params);
    this.searchPath = this.options.searchPath || '/islandora/search/';

    this.url = this.options.url || '/islandora/search/*:*';

    this.query = this.options.query || this.query(this.url);
};

SolrQuery.prototype = {

    FIELD_MAP: { 'Date.Artifact.Lower' : 'eastasia.Date.Artifact.Lower',
		 'Date.Artifact.Upper' : 'eastasia.Date.Artifact.Lower',
		 'Date.Image.Lower' : 'eastasia.Date.Image.Lower',
		 'Date.Image.Upper' : 'eastasia.Date.Image.Lower',
		 'dc.date.accessioned' : 'ldr.dc.date.accessioned',
		 'dc.contributor.author' : 'ldr.dc.contributor.author',
		 'Date' : 'geology_slides.date.search', },

    constructor: SolrQuery,

    fieldMap: function fieldMap(field) {

	return this.FIELD_MAP[field];
    },

    facet: function facet(index, value) {

	return 'f[' + index + ']=' + value;
    },

    dateRangeField: function dateRangeField(fieldName, initDate, termDate, searchPath) {

	return fieldName + ':[' + initDate + ' TO ' + termDate + '] AND ';
    },

    searchField: function searchField(name, value) {

	return name + ':' + value;
    },

    params: function params(paramsStr) {

	$.each(paramsStr.split('&'), function(param) {

		var paramName, paramValue = param.split('=');
		this.params[paramName] = paramValue;
	    });

	return this.params;
    },

    fields: function fields(fieldStr) {

	$.each(fieldStr.split(' AND '), function(fieldStr) {

		var fieldName, fieldValues = fieldStr.split(':');

		field = {};
		field['name'] = fieldName;

		/*
		if() {

		    field['type'] = 'dateRange';
		} else {
		    
		    field['type'] = 'searchField';
		}



		if() {

		    field['values'] = [];
		} else {

		    field['values'] = [];
		}
		*/

		this.fields.push(field);
	    });
    },

    query: function query(url) {

	// The arguments for the Drupal menu hook implementation
	var menuArgs = /islandora\/search\/(.+)/.exec(query)[1];

	var fieldStr, paramsStr = menuArgs.split('?');

	query += Array.join($.map(fields, function(field) {

		    switch(field['type']) {

		    case 'dateRange':

		    return dateRangeField(field['name'], field['values'][0], field['values'][1]);
		    break;

		    default:
		    
		    return searchField(field['name'], field['values'][0]);
		    break;
		    }
		}), ' AND ');
    },

    get: function get(callback) {

	return this.$.get(this.searchPath + this.query, this.params, callback);
    },

    post: function post(callback) {

	return this.$.post(this.searchPath + this.query, this.params, callback);
    }
};

(function($, Drupal) {

    Drupal.behaviors.islandoraDssDateRangeSlider = function(context) {

	/*
	$('.islandora-solr-facet-date').last().append($('<div class=".islandora-solr-facet-date-slider"></div>').dateRangeSlider( { bounds: [ new Date($('.islandora-facet-date').first().text()),
																	      new Date($(this).text()) ] } ));
	*/

	//max: +new Date($(this).text()) }));

	var facets = document.URL.split(/f\[\d\]/);

	$(document).data('islandoraDssDateRangeSlider', {
		query: /(\/islandora\/search\/.+)/.exec(document.URL)[1],
		maxFacet: (facets.length == 1 ? 0 : facets.length - 2),
	    });

	$('.islandora-solr-facet-date').each(function(i, e) {

		var $dateSlider = $('<div class="islandora-solr-facet-date-slider"></div>');
		//$(this).parent().parent().after( $dateSlider);

		$facetList = $(e);

		$facetList.after($dateSlider);
		$dateTerm = $('<div class="islandora-solr-facet-date-term">Terminal Date</div>').insertAfter($dateSlider);
		$dateInit = $('<div class="islandora-solr-facet-date-init">Initial Date</div>').insertAfter($dateSlider);

		//$facetListItems = $facetList.children('li').slice(0, -1);
		$facetListItems = $facetList.children('li').slice(0, -1).sort(function(u, v) {

			uDate = +new Date($(u).children('a').text());
			vDate = +new Date($(v).children('a').text());

			if( uDate > vDate ) {

			    return 1;
			} else if( uDate < vDate ) {

			    return -1;
			}

			return 0;
		    });

		options = {

		    // max: +new Date( $('.islandora-solr-facet-date').first().text()),
		    // min: +new Date( $('.islandora-solr-facet-date').last().text()),

		    // Restructure with styling
		    //max: +new Date( $facetList.children('li').first().children('a').text()),
		    //min: +new Date( $facetList.children('li').slice(-2,-1).children('a').text()),
		    //max: +new Date( $facetListItems.first().children('a').text()),
		    //min: +new Date( $facetListItems.last().children('a').text()),
		    min: +new Date( $facetListItems.first().children('a').text()),
		    max: +new Date( $facetListItems.last().children('a').text()),
		    range: true,
		    slide: function(e, ui) {

			//$(ui.handle);
		
			//$('.islandora-solr-facet-date-init').text((new Date(ui.values[0])).toString());
			//$('.islandora-solr-facet-date-term').text((new Date(ui.values[1])).toString());

			//$dateInit.text((new Date(ui.values[0])).toString());
			//$dateTerm.text((new Date(ui.values[1])).toString());

			var dateInit = $(ui.handle).parent().next();
			//$(ui.handle).parent().next().next();
			dateInit.text((new Date(ui.values[0])).toString());
			var dateTerm = dateInit.next();
			dateTerm.text((new Date(ui.values[1])).toString());
		    },
		    stop: function(e, ui) {
		
			//$('.islandora-solr-facet-date-init').text((new Date(ui.values[0])).toString());
			//$('.islandora-solr-facet-date-term').text((new Date(ui.values[1])).toString());

			var dateField = fieldMap($(ui.handle).parent().prev().prev().text());

			//var dateField = /f\[\d\]\=(.+?)\:/.exec();

			//var query = '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']';
			//var query = document.URL + ' AND ' + dateField + ':"' + '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']' + '"';

			// https://digital.dev.lafayette.edu/islandora/search/%2A%3A%2A?f[0]=geology_slides_esi.date.original%3A%221983-01-01T00%3A00%3A00Z%22&f[1]=geology_slides_esi.subject%3A%22Roth%2C%20Mary%20Joel%20S.%22
			var query = $(document).data('islandoraDssDateRangeSlider')['query'];
			var maxFacet = $(document).data('islandoraDssDateRangeSlider')['maxFacet'] + 1;

			var menuArgs = /islandora\/search\/(.+)/.exec(query)[1]

			// query += '&f[' + maxFacet + ']=' + dateField + ':' + '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']';

			if( (new RegExp(dateField + ':')).exec(query) ) {

			    query = query.replace( (new RegExp(dateField + '\\:\\[.+?\\]')), dateField + ':' + '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']');
			} else {

			    query = '/islandora/search/' + dateField + ':' + '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + '] AND ' + menuArgs;
			}

			$.get(query, function(data) {

				$(data).find('.islandora-solr-search-results').children().appendTo(
												   $('.islandora-solr-search-results').empty());
			    });
			
			$(document).data('islandoraDssDateRangeSlider', $.extend($(document).data('islandoraDssDateRangeSlider'), {query: query, maxFacet: maxFacet} ));
			
		    },
		};

		$dateSlider.slider(options);
		$facetList.children('li').hide();
	    });
    };

    // @todo: Refactor
    $(document).ready(function() {

	    Drupal.behaviors.islandoraDssDateRangeSlider();
	});

})(jQuery, Drupal);