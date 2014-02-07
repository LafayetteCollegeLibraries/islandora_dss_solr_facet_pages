/**
 * @file Integration for the jQRangeSlider widget and Drupal
 * @author griffinj@lafayette.edu
 *
 */


/**
 * Class for handling Islandora Solr Queries
 *
 */

var SolrQuery = function($, options) {

    this.$ = $;
    this.options = $.extend({}, options);

    /*
    this.options = $.extend({
	    searchPath: '/islandora/search',
	    query: '',
	    fields: [],
	    params: {},
	    url: '',
	}, options);

    this.params = $.extend({}, this.options.params);
    this.searchPath = this.options.searchPath || '/islandora/search/';

    this.url = this.options.url || '/islandora/search/ *:*';

    this.query = this.options.query || this.query(this.url);
    */
};

/**
 * Constants
 *
 */

SolrQuery.FIELD_MAP = {

    'Subject.OCM' : 'eastasia.Subject.OCM',
    'Contributors.Digital' : 'eastasia.Contributors.Digital',
    'Coverage.Location.Country' : 'eastasia.Coverage.Location.Country',
    'Format.Medium' : 'eastasia.Format.Medium',
    'Coverage.Location' : 'eastasia.Coverage.Location',
    'Description.Ethnicity' : 'eastasia.Description.Ethnicity',
    
    'Subject' : 'geology_slides_esi.subject',
    'Vantage Point' : 'geology_slides_esi.description.vantagepoint',

    'Date.Artifact.Lower' : 'eastasia.Date.Artifact.Lower',
    'Date.Artifact.Upper' : 'eastasia.Date.Artifact.Upper',
    'Date.Image.Lower' : 'eastasia.Date.Image.Lower',
    'Date.Image.Upper' : 'eastasia.Date.Image.Upper',

    'dc.date.accessioned' : 'ldr.dc.date.accessioned',
    'dc.contributor.author' : 'ldr.dc.contributor.author',

    'Date' : 'geology_slides_esi.date.original',

    'eastasia.Date.Artifact.Lower' : 'Date.Artifact.Lower',
    'eastasia.Date.Artifact.Upper' : 'Date.Artifact.Upper',
    'eastasia.Date.Image.Lower' : 'Date.Image.Lower',
    'eastasia.Date.Image.Upper' : 'Date.Image.Upper',

    'ldr.dc.date.accessioned' : 'dc.date.accessioned',
    'ldr.dc.contributor.author' : 'dc.contributor.author',

    'geology_slides_esi.date.original' : 'Date'
};

/**
 * Static methods
 *
 */

SolrQuery.fieldMap = function(field) {
	
    return SolrQuery.FIELD_MAP[field];
};

SolrQuery.getQuery = function(url, $) {

    var $ = $ || jQuery;

    url = decodeURI(url);
    url = url.replace(/.+?islandora\/search\//, '');

    var out = {};

    //return $.map(url.split(' AND '), function(e, i) {
    var _queryParams = $.map(url.split(' AND '), function(e, i) {

	    var paramSegments = e.split(/\:|%3A/);
		    
	    var obj = {};
	    obj[paramSegments[0]] = paramSegments[1];
	    return obj;
	});

    $.each(_queryParams, function(i, e) {

	    for(var key in e) {

		out[key] = e[key];
	    }
	});

    return out;
};

SolrQuery.getFacets = function getFacets(url, $) {

    url = url || document.URL;
    $ = $ || jQuery;

    url = decodeURI(url);
    var urlSegments = url.split(/\??&?f\[\d\]\=/);
    var query = urlSegments[0];

    var out = {};
	    
    var _facetParams = $.map(urlSegments.slice(1), function(e, i) {
		    
	    var facetId = 'f[' + i + ']';

	    var obj = {};
	    // Detecting date range facets
	    if(/(\:|%3A)\[[\d-]+T/.exec(e)) {

		var paramName = /(.+?)(\:|%3A)/.exec(e)[1];

		// new Date(/\[(.+?)\sT/.exec(decodeURI('geology_slides_esi.date.original%3A[1967-12-01T00%3A00%3A00Z TO 1968-06-01T00%3A00%3A00Z]'))[1].replace('%3A',':','g'))
		var paramMin = +new Date(/\[(.+?)\sT/.exec(e)[1].replace('%3A',':','g'));
		var paramMax = +new Date(/TO\s(.+?)\]/.exec(e)[1].replace('%3A',':','g'));

		obj[paramName] = [paramMin, paramMax];
	    } else {

		var paramSegments = e.split(/\:|%3A/);

		/*
		  var fieldName = paramSegments[0];
		  //return { facetId : { fieldName : paramSegments[1] }};
		  
		  return { fieldName : paramSegments[1] };
		*/
		var paramValue = paramSegments[1].replace(/#$/, '', 'g');
		
		if(typeof(obj[paramSegments[0]]) === 'undefined') {

		    obj[paramSegments[0]] = [paramValue];
		} else {

		    obj[paramSegments[0]].concat(paramValue);
		}
	    }
		
	    return obj;
	});
    
    $.each(_facetParams, function(i, e) {
	    
	    for(key in e) {
		
		out[key] = e[key];
	    }
	});
    
    return out;
};

SolrQuery.getFacetTokenUrl = function getFacetTokenUrl(token, $) {

    var $ = $ || jQuery;

    $token = $(token);
    //facetQuery = decodeURI($(token).attr('href'));
    facetQuery = $(token).attr('href');

    //facetQueryField = facetQuery.split(/\??f\[\d\]\=?/).pop();
    //return '/islandora/search/' + query + facets;

    return facetQuery.replace(new RegExp("(\\?|&)f\\[\\d\\]\\=" + facetQuery.split(/\??f\[\d\]\=?/).pop()), '');
};

SolrQuery.removeFacet = function removeFacet(facetToken, removedFacetToken, $) {

    var $ = $ || jQuery;

    $facetToken = $(facetToken);
    facetQuery = $(facetToken).attr('href');
    facets = facetQuery.split(/\??&?f\[\d\]\=?/);
    facets.sort();

    $removedFacetToken = $(removedFacetToken);
    removedFacetQuery = $(removedFacetToken).attr('href');
    removedFacets = removedFacetQuery.split(/\??&?f\[\d\]\=?/);
    removedFacets.sort();

    removedFacet = null;

    for(var i=0;i<facets.length;i++) {

	if(removedFacets.indexOf(facets[i]) == -1) {

	    removedFacet = facets[i];
	    break;
	}
    }

    return facetQuery.replace(new RegExp('(\\?|&)f\\[\\d\\]\\=' + removedFacet), '');
};

SolrQuery.updateFacetTokenUrl = function updateFacetTokenUrl(facetToken, newFacetToken, $) {

    var $ = $ || jQuery;

    $facetToken = $(facetToken);
    facetQuery = $(facetToken).attr('href');

    if(facetQuery.split(/\?f\[\d\]/).length > 1) {

	facetQuery += '&';
    } else {

	facetQuery += '?';
    }

    $newFacetToken = $(newFacetToken);
    newFacetQuery = $(newFacetToken).attr('href');

    return facetQuery + 'f[' + (parseInt(newFacetQuery.split(/\??f\[/).pop()[0]) - 1).toString() + ']=' + newFacetQuery.split(/\??f\[\d\]\=?/).pop();
};

SolrQuery.prototype = {

    constructor: SolrQuery,

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

	var $ = this.$;
	$.each(paramsStr.split('&'), function(param) {

		var paramName, paramValue = param.split('=');
		this.params[paramName] = paramValue;
	    });

	return this.params;
    },

    facets: function facets(queryUrl) {

	var $ = this.$;

	/*
	facetSubString = queryUrl.split(/f\[0\]/).splice(1);
	$.each(.split(' AND '), function(i, ) {

	    });
	*/
	
	//queryUrl2.split(/(\?|&)f\[\d\]\=/)

	$.each(queryUrl.split(/(\?|&)f\[\d\]\=/).splice(1), function(i, facet) {

		/*
		facets = {};
		if(facet != '?' && facet != '&') {

		    var fieldSubStr = fieldStr.split(/\:|%3A/);
		    var fieldName = fieldSubStr[0];
		    var fieldValues = fieldSubStr[1];

		    facets['name'] = fieldName;
		}
		*/
	    });
    },

    fields: function fields(fieldStr) {

	var $ = this.$;
	$.each(fieldStr.split(' AND '), function(i, fieldStr) {

		var fieldSubStr = fieldStr.split(/\:|%3A/);
		var fieldName = fieldSubStr[0];
		var fieldValues = fieldSubStr[1];

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

    url: function url(params, url) {

	url = '/islandora/search/' || url;

	for(var key in params) {
	    
	    for(var i in params[key]) {

		url += params[key][i];
	    }
	}

	return url;
    },

    query: function query(url) {

	$ = this.$;

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

	var _query = SolrQuery.getQuery(document.URL);
	var _facets = SolrQuery.getFacets(document.URL);

	/**
	 * Global variables
	 *
	 */

	// Handled by Drupal instead
	//$('#block-islandora-solr-facet-pages-islandora-solr-facet-pages h2.block-title').after('<ul class="islandora-solr-facet-token-list"></ul>');

	var currentQuery = document.URL.split(/\?f\[0\]/)[0];
	currentQuery = /(\/islandora\/search\/.+)/.exec(document.URL)[1];

	// For sorting/filtering by facet value
	$(document).data('islandoraDssDateRangeSlider', {

		query: currentQuery,
		maxFacet: (facets.length == 1 ? 0 : facets.length - 2),
	    });

	// For storing the initial values of the date range sliders
	$(document).data('islandoraDssDateRangeInitValues', {});

	// For facetQueries
	var facetQueries = SolrQuery.getFacets();
	$(document).data('islandoraDssDateRangeFacetQueries', facetQueries);

	// For facetParams
	// Refactor
	var facetParams = {};
	var facetIndex = 0;
	for(var key in facetQueries) {

	    for(var k in facetQueries[key]) {

		var facetKey = 'f[' + facetIndex + ']';
		facetParams[ facetKey ] = key + ":" + facetQueries[key][k];
		facetIndex++;
	    }
	}
	$(document).data('islandoraDssDateRangeFacetParams', facetParams);

	var that = this;
	this.tokenList = function tokenList(params, $tokenList, url) {

	    $tokenList = $tokenList || $('.islandora-solr-facet-token-list');
	    url = url || document.URL;

	    //var facetIndex = 0;
	    for(var field in params) {

		var otherFields = Object.keys(params).filter(function(key) { return key != field && params[key].length > 0; }).map(function(otherField, facetIndex) {

			return params[otherField].map(function(u, v) {

				return '&f[' + facetIndex + ']=' + otherField + ':"' + u + '"';
			    }).reduce(function(u, v) {
				    
				    return Array.prototype.concat(u, v);
				});
		    });

		var facetIndex = otherFields.length;

		for(var i in params[field]) {

		    var sameFieldValues = params[field].slice(0, i).concat(params[field].slice(i)).map(function(j, offset) {

			    //return params[field][j];
			    return '&f[' + (facetIndex + offset) + ']=' + field + ':' + j;
			}).reduce(function(u, v) {
				    
				return Array.prototype.concat(u, v);
			    });

		    var tokenUrl = url + otherFields + sameFieldValues;
		    $tokenList.append(
				      $('<a class="" href="' + tokenUrl + '"></a>').wrap('<li></li>')
				      );
		    
		    //facetIndex++;
		}
	    }
	};

	/**
	 * For updating page contents
	 * @todo Refactor into a Class
	 *
	 */
	this.updatePage = function(data, tokenCallback, activeToken, tokens) {

	    //var facetParams = $(document).data('islandoraDssDateRangeFacetParams') || {};

	    if($(data).find('#page-header p.lead a.active').text() != ('0' + '\xA0' + 'Items Found')) {

		$(data).find('#block-islandora-solr-facet-pages-islandora-solr-facet-pages').appendTo($('.region-slide-panel').empty());
		$(data).find('.main-container').children().appendTo($('.main-container').empty());

		// Abstract and refactor
		Drupal.theme('bootstrapDssObjectList');
		//var infiniteList = new IslandoraDssSolrInfinite($, Drupal.settings.dssSolrInfinite);
		Drupal.behaviors.islandoraDssSolrInfinite();
		that.facetDateHandler();
		that.facetModalHandler();
		that.dateSliderResetHandler()

		$('.islandora-solr-facet-list li a, .islandora-solr-facet-token-list li a').filter(function(i, e) {

			return $(e).text() != 'Show more...' && $(e).text() != 'View all values...' }).click(that.facetLinkHandler);
	    } else {

		$(data).find('.main-container').children().appendTo($('.main-container').empty());
	    }
	};

	/**
	 * For the Islandora Solr Facet form
	 * Please note that this widget merely populates the facet parameters for GET requests transmitted to the Solr endpoint
	 *
	 */
	this.facetFormHandler = function() {
	    
	    // Work-around
	    /*
	    $('#islandora-dss-solr-facet-pages-facets-form').click(function(e) {

		    e.stopImmediatePropagation();
		});
	    */

	    //$('#islandora-dss-solr-facet-pages-facets-form').submit(function(event) {
	    $('#islandora-dss-solr-facet-pages-facets-form .form-submit').click(function(event) {

		    event.preventDefault();

		    facetQueries = $(document).data('islandoraDssDateRangeFacetQueries') || {};

		    var formValues = $('#islandora-dss-solr-facet-pages-facets-form').serializeArray();
		    $.each(formValues.filter(function(e, i) {

				return e.name != 'form_build_id' && e.name != 'form_id' && e.name != 'form_token';
			    }), function(i, e) {

			    var solrField = $(document).data('islandoraDssBrowsingField');

			    //facetQueries[solrField] = e.value;
			    facetQueries[solrField] = facetQueries[solrField] || [];
			    facetQueries[solrField] = facetQueries[solrField].concat(e.value);
			});

		    $(document).data('islandoraDssDateRangeFacetQueries', facetQueries);
		    //$.fancybox.close();
		    //$('.fancy-box-container').remove();

		    var url = $(document).data('islandoraDssDateRangeSlider')['query'];
		    facetParams = {};

		    var facetIndex = 0;
		    for(key in facetQueries) {

			for(k in facetQueries[key]) {

			    var facetKey = 'f[' + facetIndex + ']';
			    facetParams[ facetKey ] = key + ":" + facetQueries[key][k];
			    facetIndex++;

			    //var parentUrl = facetedSearchAnchor.attr('href');
			    //parentUrl = getFacetTokenUrl(facetedSearchAnchor);

			    var parentUrl = url;
			    var linkText = '';

			    /**
			     * Work-around
			     *
			     */

			    parentUrl += /f\[\d\]/.exec(parentUrl) ? '&' : '?';
			    var facetedSearchAnchor = $("<a href='" + parentUrl + 'f[' + (i - 1) + ']=' + key + ':"' + facetQueries[key][k] + '"\' class="islandora-solr-facet-token">' + facetQueries[key][k] + '</a>');
			    //var facetedSearchAnchor = $("<a href='" + parentUrl + '"\' class="islandora-solr-facet-token">' + facetQueries[key][k] + '</a>');

			    $('.islandora-solr-facet-token-list').append( $('<li></li>').append( facetedSearchAnchor.click(function(e) {

					    that.facetLinkHandler(e, $(this));
					})
				    ));

			    var $facetTokens = $('.islandora-solr-facet-token-list li');

			    $facetTokens.children().each(function(i, facetToken) {

				    $facetToken = $(facetToken);
				    $facetToken.attr('href', SolrQuery.updateFacetTokenUrl( $facetToken, facetedSearchAnchor));
				});
			    
			}
		    }

		    $('.fancy-box-container').dialog('close');

		    $(document).data('islandoraDssDateRangeFacetParams', facetParams);
		    $.get(url, facetParams, that.updatePage);
		});
	};

	/**
	 * For the modal dialog window
	 *
	 */
	this.facetModalHandler = function() {

	    $('.islandora-solr-facet-list .last a').each(function(i, e) {

		    $(e).click(function(event) {

			    event.preventDefault();

			    var solrField = SolrQuery.fieldMap($(e).parent().parent().prev().text());
			    $(document).data('islandoraDssBrowsingField', solrField);

			    var fancyBoxContainer = $('<div class="fancy-box-container"></div>').appendTo($('body')).load('/islandora/facets/' + solrField, function() {

				    $(this).dialog({ title: solrField,
						     modal: true,
						     minHeight: 280,
						     minWidth: 392,
						     beforeClose: function(event, ui) {

						this.$parent = $(this);
						
						var fieldObjects = $(this).find('#islandora-dss-solr-facet-pages-facets-form').serializeArray().filter(function (fieldObj) {

							return fieldObj.name != 'form_build_id' && fieldObj.name != 'form_id';
						    });
						if(fieldObjects.length == 0) {

						    var that = this;
						    $('<div class="islandora-facet-modal-alert">You have not selected any facets.</div>').appendTo($('body')).dialog({

							    title: 'Warning',
							    modal: true,
							    resizable: false,
							    height: 140,
							    buttons: {
								Close: function() {

								    $( this ).dialog( "close" );
								    $('.fancy-box-container').dialog('destroy');
								},
								Cancel: function() {

								    $( this ).dialog( "close" );
								}
							    }
							});
						}

						return fieldObjects.length > 0;
					    }
					});

				    that.facetFormHandler();
				});
			});
		});
	};

	this.facetModalHandler();

	this.dateSliderResetHandler = function() {

	$('.islandora-solr-date-reset').click(function(e) {

		var $dateSlider = $($(this).attr('data-target'));
		$dateSlider.slider('values', [ $dateSlider.slider('option', 'min'), $dateSlider.slider('option', 'max') ]);

		//that.dateSliderStop();

		var url = $(document).data('islandoraDssDateRangeSlider')['query'];
		var facetParams = {};

		var dateField = SolrQuery.fieldMap( $dateSlider.prev().prev().text() );
		var facetQueries = $(document).data('islandoraDssDateRangeFacetQueries') || {};
		delete facetQueries[dateField];
		$(document).data('islandoraDssDateRangeFacetQueries', facetQueries);

		var facetIndex = 0;
		for(key in facetQueries) {

		    for(k in facetQueries[key]) {

			var facetKey = 'f[' + facetIndex + ']';
			facetParams[ facetKey ] = key + ":" + facetQueries[key][k];
			facetIndex++;
		    }
		}
		$(document).data('islandoraDssDateRangeFacetParams', facetParams);

		$.get(url, facetParams, that.updatePage);
	    });
	};

	this.dateSliderResetHandler();

	/**
	 * For the Date slider widget
	 *
	 */
	this.facetDateHandler = function() {

	    $('.islandora-solr-facet-date').each(function(i, e) {

		    var $dateSlider = $('<div class="islandora-solr-facet-date-slider"></div>');
		    //$(this).parent().parent().after( $dateSlider);

		    var $facetList = $(e);

		    $facetList.after($dateSlider);
		    var $dateTerm = $('<div class="islandora-solr-facet-date-term"></div>').insertAfter($dateSlider);
		    var $dateInit = $('<div class="islandora-solr-facet-date-init"></div>').insertAfter($dateSlider);

		    //$facetListItems = $facetList.children('li').slice(0, -1);
		    var $facetListItems = $facetList.children('li').slice(0, -1).sort(function(u, v) {

			    var uDate = +new Date($(u).children('a').text());
			    var vDate = +new Date($(v).children('a').text());

			    if( uDate > vDate ) {

				return 1;
			    } else if( uDate < vDate ) {

				return -1;
			    }

			    return 0;
			});

		    // Work-around
		    if($facetListItems.length == 0) {

			return;
		    }

		    // Retrieve the Solr field name for the <li> element
		    var dateField = SolrQuery.fieldMap($facetList.prev().text());

		    // Store the initial min and max
		    var minMax = $(document).data('islandoraDssDateRangeInitValues');

		    if(typeof(minMax[dateField]) == 'undefined') {

			minMax[dateField] = {};
			minMax[dateField]['min'] = +new Date($facetListItems.first().children('a').text());

			// If there is only one facet value for the range, create a second by incrementing 10 years
			if($facetListItems.length == 1) {

			    var maxDate = new Date($facetListItems.first().children('a').text());
			    maxDate.setUTCFullYear( maxDate.getUTCFullYear() + 10 );

			    minMax[dateField]['max'] = +maxDate;
			} else {

			    minMax[dateField]['max'] = +new Date( $facetListItems.last().children('a').text());
			}

			$(document).data('islandoraDssDateRangeInitValues', minMax);
		    }

		    //var minDate = +new Date( $facetListItems.first().children('a').text());
		    //var maxDate = +new Date( $facetListItems.first().children('a').text());
		    var minDate = minMax[dateField]['min'];
		    var maxDate = minMax[dateField]['max'];

		    /**
		     * Options for the jQuery UI Slider widget
		     *
		     */
		    options = {

			// Restructure with styling
			//min: +new Date( $facetListItems.first().children('a').text()),
			//max: +new Date( $facetListItems.last().children('a').text()),

			min: minDate,
			max: maxDate,
			range: true,
			slide: function(e, ui) {

			    var dateInit = $(ui.handle).parent().next();
			    //dateInit.text((new Date(ui.values[0])).toLocaleDateString());
			    //dateInit.text((new Date(ui.values[0])).toGMTString());

			    dateInit.text( moment(ui.values[0]).format("MMM. DD YYYY"));

			    var dateTerm = dateInit.next();
			    //dateTerm.text((new Date(ui.values[1])).toLocaleDateString());
			    //dateTerm.text((new Date(ui.values[1])).toGMTString());

			    dateTerm.text( moment(ui.values[1]).format("MMM. DD YYYY"));
			},

			stop: function(e, ui) {
		
			    //$('.islandora-solr-facet-date-init').text((new Date(ui.values[0])).toString());
			    //$('.islandora-solr-facet-date-term').text((new Date(ui.values[1])).toString());

			    var dateField = SolrQuery.fieldMap($(ui.handle).parent().prev().prev().text());

			    //var dateField = /f\[\d\]\=(.+?)\:/.exec();

			    //var query = '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']';
			    //var query = document.URL + ' AND ' + dateField + ':"' + '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']' + '"';

			    // https://digital.dev.lafayette.edu/islandora/search/%2A%3A%2A?f[0]=geology_slides_esi.date.original%3A%221983-01-01T00%3A00%3A00Z%22&f[1]=geology_slides_esi.subject%3A%22Roth%2C%20Mary%20Joel%20S.%22
			    var url = $(document).data('islandoraDssDateRangeSlider')['query'];
			    var maxFacet = $(document).data('islandoraDssDateRangeSlider')['maxFacet'] + 1;
			    var menuArgs = /islandora\/search\/(.+)/.exec(url)[1];

			    // query += '&f[' + maxFacet + ']=' + dateField + ':' + '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']';

			    /*
			    if((new RegExp(dateField + ':')).exec(query) ) {

				//query = query.replace( (new RegExp(dateField + '\\:\\[.+?\\]')), dateField + ':' + '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']');
			    } else {

				//query = '/islandora/search/' + dateField + ':' + '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + '] AND ' + menuArgs;
			    }
			    */

			    // Retrieve the Solr field name for the <li> element
			    var dateField = SolrQuery.fieldMap($facetList.prev().text());

			    // Store the initial min and max
			    var minMax = $(document).data('islandoraDssDateRangeInitValues');
			    var minDate = minMax[dateField]['min'];
			    var maxDate = minMax[dateField]['max'];

			    facetQueries = $(document).data('islandoraDssDateRangeFacetQueries') || {};

			    if(ui.values[0] <= minDate && ui.values[1] >= maxDate) {

				delete facetQueries[dateField];
			    } else {

				//facetQueries[dateField] = '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']';
				facetQueries[dateField] = facetQueries[dateField] || [];
				//facetQueries[dateField] = facetQueries[dateField].concat('[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']');
				facetQueries[dateField][0] = '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']';
			    }

			    $(document).data('islandoraDssDateRangeFacetQueries', facetQueries);

			    facetParams = {};

			    var i = 0;
			    for(key in facetQueries) {

				for(k in facetQueries[key]) {

				    var facetKey = 'f[' + i + ']';
				    facetParams[ facetKey ] = key + ":" + facetQueries[key][k];
				    i++;
				}
				//i++;
			    }

			    /*
			    $.get(query, facetParams, function(data) {

				    console.log(query);
				    console.log(facetParams);
				    console.log(facetQueries);

				    /**
				     * Only update the facet panel if there are more than 0 results returned (otherwise, no facets shall be present)
				     *
				     * /

				    $facetTokens = $('.islandora-solr-facet-token-list li').detach();
				    $(data).find('#block-islandora-solr-facet-pages-islandora-solr-facet-pages').appendTo($('.region-slide-panel').empty());
				    $('.islandora-solr-facet-token-list').append($facetTokens);
				    //that.facetDateHandler();

				    //$(data).find('.islandora-solr-search-results').children().appendTo($('.islandora-solr-search-results').empty());
				    $(data).find('.main-container').children().appendTo($('.main-container').empty());

				    that.facetDateHandler();

				    //$('.islandora-solr-facet-list li a').click(that.facetLinkHandler);
				    $('.islandora-solr-facet-list li a').filter(function(i, e) {

					    return $(e).text() != 'Show more...' && $(e).text() != 'View all values...' }).click(that.facetLinkHandler);
				});
			    */

			    $(document).data('islandoraDssDateRangeFacetParams', facetParams);
			    $.get(url, facetParams, that.updatePage);

			    //$(document).data('islandoraDssDateRangeSlider', $.extend($(document).data('islandoraDssDateRangeSlider'), {query: query, maxFacet: maxFacet} ));
			},
		    };

		    /**
		     * Prepropulate the slider with the appropriate value
		     * Retrieve the values either from the facet queries or queries passed in the GET request
		     *
		     */
		    var solrFieldName = SolrQuery.fieldMap($facetList.prev().text());

		    facetQueries = $(document).data('islandoraDssDateRangeFacetQueries') || {};
		    /*
		    facetParams = {};

		    var i = 0;
		    for(key in facetQueries) {

			var facetKey = 'f[' + i + ']';
			facetParams[ facetKey ] = key + ":" + facetQueries[key];

			i++;
		    }
		    */

		    //console.log( facetQueries );

		    // Populate from the facet queries first...
		    if(typeof(_facets[solrFieldName]) !== 'undefined') {

			options['values'] = _facets[solrFieldName];
		    } else if(typeof(_query[solrFieldName]) !== 'undefined') {

			options['values'] = _query[solrFieldName];
		    } else if(typeof( facetQueries[solrFieldName] ) !== 'undefined') {

			// Work-around
			// There can only ever be one element within an array of values for Date fields
			var minValue = +new Date(facetQueries[solrFieldName][0].split(' TO ')[0].slice(1));
			var maxValue = +new Date(facetQueries[solrFieldName][0].split(' TO ')[1].slice(0, -1));
			options['values'] = [minValue, maxValue];
		    } else {

			options['values'] = [ options['min'], options['max'] ];
		    }

		    //$dateTerm.text( new Date(options['values'][1]).toLocaleDateString());
		    //$dateInit.text( new Date(options['values'][0]).toLocateDateString());
		    //$dateTerm.text( new Date(options['values'][1]).toGMTString());
		    //$dateInit.text( new Date(options['values'][0]).toGMTString());

		    $dateTerm.text( moment(options['values'][1]).format("MMM. DD YYYY"));
		    $dateInit.text( moment(options['values'][0]).format("MMM. DD YYYY"));

		    $dateSlider.slider(options);
		    $facetList.children('li').hide();
		});

	};
	this.facetDateHandler();

	/**
	 * Transmit the GET request with the appropriate parameters
	 *
	 */
	this.tokenHandler = function(facetedSearchAnchor, $facetTokens) {

	    /**
	     * For Islandora Solr tokens (Solr facets actively applied)
	     *
	     */
	    if(facetedSearchAnchor.hasClass('islandora-solr-facet-token')) {

		/**
		 * @todo Refactor
		 *
		 */
		if($facetTokens.length > 1) {
			
		    $facetTokens.children().each(function(i, facetToken) {

			    $facetToken = $(facetToken);
			    if(! $facetToken.is(facetedSearchAnchor) ) {

				$facetToken.attr('href', SolrQuery.removeFacet( $facetToken, facetedSearchAnchor));
			    }
			});
		}

		// Remove the parent <li> element
		facetedSearchAnchor.parent().remove();

	    } else {

		var parentUrl = facetedSearchAnchor.attr('href');

		    /**
		     * Terrible work-around, must refactor this
		     *
		     * Scope the other token links for this new filter...
		     */
		$facetTokens.children().each(function(i, facetToken) {

			$facetToken = $(facetToken);
			$facetToken.attr('href', SolrQuery.updateFacetTokenUrl( $facetToken, facetedSearchAnchor));
		    });

		/**
		 * ...and ensure that the link for this anchor is scoped properly:
		 *
		 */
		parentUrl = SolrQuery.getFacetTokenUrl(facetedSearchAnchor);

		$('.islandora-solr-facet-token-list').append( $('<li></li>').append($('<a href="' + parentUrl + '" class="islandora-solr-facet-token">' + facetedSearchAnchor.text() + '</a>').click(function(e) {
				
				that.facetLinkHandler(e, $(this));
			    })
			));
	    }
	};

	this.facetLinkHandler = function(e, element) {

	    e.preventDefault();

	    var facetedSearchAnchor = element || $(this);

	    var facets = facetedSearchAnchor.attr('href').split(/f\[\d\]/);

	    /*
	    $(document).data('islandoraDssDateRangeSlider', {

		        query: /(\/islandora\/search\/.+)/.exec( facetedSearchAnchor.attr('href') )[1],
			maxFacet: (facets.length == 1 ? 0 : facets.length - 2),
			});
	    */

	    var url = facetedSearchAnchor.attr('href');

	    var facetParams = {};
	    var facetQueries = $(document).data('islandoraDssDateRangeFacetQueries') || {};

	    /*
	    //facetParams = $(document).data('islandoraDssFacetQueryParams') || {};
	    var facetParams = {};

	    var i = 0;

	    //queryUrl.split(/(\?|&)f\[\d\]\=/).splice(1).filter(function(e, i) { return e != '?' && e != '&'; })

	      facetQueries[dateField] = facetQueries[dateField] || [];
	      facetQueries[dateField] = facetQueries[dateField].concat( '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']');
	      
	      $(document).data('islandoraDssDateRangeFacetQueries', facetQueries);

	      facetParams = {};
	    */

	    /*

	    $.each(queryUrl.split(/(\?|&)f\[\d\]\=/).splice(1).filter(function(e, i) { return e != '?' && e != '&' }), function(j, e) {

		    var queryExpr = decodeURI(e);

		    var fieldSubStr = queryExpr.split(/\:|%3A/);

		    if(fieldSubStr.length == 2) {

			var fieldName = fieldSubStr[0];
			var fieldValues = fieldSubStr[1];
		    } else {

			fieldSubStr = queryExpr.split(/(\:|%3A)\[/).filter(function(e, i) { return e != ':' && e != '%3A' });
			var fieldName = fieldSubStr[0];
			var fieldValues = '[' + fieldSubStr[1].replace('%3A', ':', 'g');
		    }

		    //facetQueries[fieldName] = fieldValues;
		    facetQueries[fieldName] = facetQueries[fieldName] || [];
		    facetQueries[fieldName] = facetQueries[fieldName].concat(fieldValues);

		    //var facetKey = 'f[' + i + ']';
		    //facetParams[facetKey] = fieldName + ':' + fieldValues;

		    i++;
		});
	    */

	    // Update the active facet queries
	    // Refactor for efficiency
	    for(var fieldName in facetQueries) {

		//if(facetQueries[fieldName] == facetedSearchAnchor.text() || facetQueries[fieldName] == '"' + facetedSearchAnchor.text() + '"') {
		if(facetQueries[fieldName].filter(function(e) {

			    return e == facetedSearchAnchor.text() || facetQueries[fieldName] == '"' + facetedSearchAnchor.text() + '"';
			}).length > 0) {

		    if(facetedSearchAnchor.hasClass('islandora-solr-facet-token')) {

			delete facetQueries[fieldName];
		    }
		}
	    }

	    var fieldName = SolrQuery.fieldMap(facetedSearchAnchor.parent().parent().prev().text());

	    if(typeof(facetQueries[fieldName]) === 'undefined') {

		facetQueries[fieldName] = ['"' + facetedSearchAnchor.text() + '"'];
	    } else {

		facetQueries[fieldName] = facetQueries[fieldName].concat(['"' + facetedSearchAnchor.text() + '"']);
	    }

	    $(document).data('islandoraDssDateRangeFacetQueries', facetQueries);

	    /*
	    queryUrl = queryUrl.split('?')[0];

	    for(key in facetQueries) {

		for(k in facetQueries[key]) {

		    var facetKey = 'f[' + (i - 1) + ']';
		    //facetParams[ facetKey ] = key + ":" + facetQueries[key];
		    facetParams[ facetKey ] = key + ":" + facetQueries[key][k];
		    i++;
		}

		//queryUrl += key + ":" + facetQueries[key];
		//i++;
	    }
	    */

	    //$(document).data('islandoraDssDateRangeFacetParams', facetParams);

	    //queryUrl += $(document).data('islandoraDssDateRangeSlider')['query'];

	    //$(document).data('islandoraDssFacetQueryParams', facetParams);

	    //$.get(facetedSearchAnchor.attr('href'), function(data) {

	    /*
	    $.get(queryUrl, facetParams, function(data) {

		    console.log(queryUrl);
		    console.log(facetParams);
		    console.log(facetQueries);

		    /*
		    //$facetTokens = $('.islandora-solr-facet-token').detach();
		    $facetTokens = $('.islandora-solr-facet-token-list li');

		    // tokenCallback: that.tokenHandler(facetedSearchAnchor, $facetTokens);
		    that.updatePage(data, that.tokenHandler, facetedSearchAnchor, $facetTokens);
		    * /

		    if($(data).find('#page-header p.lead a.active').text() != ('0' + '\xA0' + 'Items Found')) {

			$(data).find('#block-islandora-solr-facet-pages-islandora-solr-facet-pages').appendTo($('.region-slide-panel').empty());
			$(data).find('.main-container').children().appendTo($('.main-container').empty());

			// Abstract and refactor
			var infiniteList = new IslandoraDssSolrInfinite($, Drupal.settings.dssSolrInfinite);
			that.facetDateHandler();
			that.facetModalHandler();

			$('.islandora-solr-facet-list li a').filter(function(i, e) {

				return $(e).text() != 'Show more...' && $(e).text() != 'View all values...' }).click(that.facetLinkHandler);
		    } else {

			$(data).find('.main-container').children().appendTo($('.main-container').empty());
		    }
		});
	    */

	    $.get(url, facetParams, that.updatePage);
	};

	//$('.islandora-solr-facet-list li a').click(that.facetLinkHandler);
	$('.islandora-solr-facet-list li a, .islandora-solr-facet-token-list li a').filter(function(i, e) {

		return $(e).text() != 'Show more...' && $(e).text() != 'View all values...' }).click(that.facetLinkHandler);
	
    };

    // @todo: Refactor
    $(document).ready(function() {

	    Drupal.behaviors.islandoraDssDateRangeSlider();
	});

})(jQuery, Drupal);