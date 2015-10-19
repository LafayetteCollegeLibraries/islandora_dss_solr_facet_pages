/**
 * @file A widget for sorting Islandora Objects within an ordered list (<ol>)
 * @author griffinj@lafayette.edu
 *
 */

"use strict";

// Initialize the global Islandora and Islandora.DSS namespaces
var Islandora = Islandora || {};
Islandora.DSS = Islandora.DSS || {};

// Initialize the global Islandora.DSS.SolrSearch namespace
// @todo Refactor into a Class
Islandora.DSS.SolrSearch = Islandora.DSS.SolrSearch || { query: { params: {} } };

/**
 * Constructor
 *
 */
var LafayetteDssObjectList = function($, element, options) {

    this.$ = $;
    this.element = element;
    this.options = $.extend({
	    fieldSelector: '.islandora-inline-metadata dd.solr-value.dc-title',
	    order: 'asc',
	    field: 'dc.title'
	}, options);
    
    this.fieldSelector = this.options.fieldSelector;
    //this.order = this.options.order;
    //this.field = this.options.field;

    this.$element = $(element);
    this._index = [];

    /**
     * Ensure that sorting parameters are parsed from the GET request
     * Resolves DSSSM-683
     *
     */
    var sortMatch = /&sort=(.+)&?/.exec(document.URL);
    if(sortMatch) {

	$(document).data('islandoraDssSolrResultsSortParams', { sort: decodeURI(sortMatch[1]) });
    }
};

/**
 * ObjectList Object
 *
 */

/**
 * Static methods
 *
 */



/**
 * Paginated browsing functionality
 *
 */
LafayetteDssObjectList.paginationLinkHandler = function(e) {

    // Work-around, refactor
    var $ = jQuery;
    e.preventDefault();

    var params = $(document).data('islandoraDssDateRangeFacetParams') || {};
    var listGridParams = $(document).data('islandoraDssSolrResultsViewParams') || {};
    var sortParams = $(document).data('islandoraDssSolrResultsSortParams') || {};

    params = $.extend(params, listGridParams, sortParams);

    /**
     * Transmitting the GET request for the desired Solr results page
     *
     */

    /**
     * Attempt to parse the page number from the Islandora Solr Query URL
     * Delete the key outright from the parameters Object if no such argument exists within the GET request
     * Resolves DSS-249
     *
     */
    var url = $(e.target).attr('href');
    var pageMatch = /page\=(\d+)/.exec(url);
    if(pageMatch) {

	params['page'] = pageMatch[1];
    } else {

	delete params['page'];
    }

    // Retrieve the initial segment of the Islandora Solr Query URL
    url = url.split('?').shift();

    /**
     * Always default to the endpoint path "/islandora/search"
     * Resolves DSSSM-725
     * @todo Refactor
     *
     */
    if(/\/browse/.exec(url)) {
		    
	url = '/islandora/search/*:*';
    }

    /**
     * Clean URL encoding from certain fields
     * Resolves DSSSM-1037
     * @todo Refactor
     *
     */

    for(var facet in params) {

	var facetQuery = params[facet];
	
	if(/mdl_prints\.description\.series/.exec(facetQuery)) {

	    // This should fully resolve the issue
	    facetQuery = facetQuery.replace('%2C', ',');

	    facetQuery = facetQuery.replace('Portraits: Debucourt%2C', 'Portraits: Debucourt,');
	    facetQuery = facetQuery.replace('Portraits: Julien%2C', 'Portraits: Julien,');
	    facetQuery = facetQuery.replace('Portraits: Martinet%2C', 'Portraits: Martinet,');
	}

	params[facet] = facetQuery;
    }

    // Update the params Object before transmitting the GET request
    Islandora.DSS.SolrSearch.query.params = params;

    // This ensures that the browser's history state is updated with the latest result set
    // Resolves DSS-559
    if(window.history.pushState) {

	var historyUrl = url + '?' + $.param(params);
	window.history.pushState({'Islandora.DSS.SolrSearch' : { 'url': url, 'params': params } }, 'DSS Search Results | Digital Scholarship Services', historyUrl);
    }

    // Resolves DSS-609
    if( params.hasOwnProperty('sort') ) {

	params['sort'] = params['sort'].replace(/\+/, ' ');
    }

    // Submit the GET request to the Islandora Solr endpoint
    $.get(url, params, function(data) {

	    // Upon receiving the request...
	    $('.islandora-solr-search-results')
	    .removeClass('loading')
	    .append($(data).find('.islandora-solr-search-results').children())
	    .siblings('.islandora-discovery-controls').find('.pagination-count').replaceWith($(data).find('.pagination-count'));

	    $('.pagination-count-bottom').last().replaceWith($(data).find('.pagination-count-bottom'));
	    $('.pagination li a').click(LafayetteDssObjectList.paginationLinkHandler);
	});
    
    $('.islandora-solr-search-results').empty().addClass('loading');
};

/**
 * Integrating grid/list functionality from the (deprecated) islandora_dss_solr_infinite_scroll Module
 *
 */

LafayetteDssObjectList.viewListClickHandler = function(e) {

    e.preventDefault();

    /**
     * Integration for infinite scrolling functionality
     *
     */
    //infiniteList.unbind();
    //$.ias().unbind();

    // Set the Global display parameters to "list"
    Islandora.DSS.SolrSearch.query.params.display = 'list';
    
    // AJAX-integrated
    var url = $(document).data('islandoraDssDateRangeSlider')['query'] || '/islandora/search/*:*';
    
    /**
     * @todo Resolve
     *
     */
    if(/\/browse/.exec(document.URL)) {
	
    } else {
	
	url = '/' + url;
    }
    
    //var params = $(document).data('islandoraDssDateRangeFacetParams') || {};
    var params = $(document).data('islandoraDssSolrResultsViewParams') || {};
    
    /**
     * Integrating List/Grid view widgets
     * Refactor into a Global Object (accessed by multiple Modules)
     * This resolves DSS-178
     *
     */
    var sortParams = $(document).data('islandoraDssSolrResultsSortParams');
    
    params = $.extend(params, sortParams, { display: 'list' });
    $(document).data('islandoraDssSolrResultsViewParams', params);
    
    var facetQueries = $(document).data('islandoraDssDateRangeFacetQueries') || {};
    
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
    params = $.extend(params, facetParams);
    
    /**
     * Attempting to resolve issues related to GET parameter parsing
     *
     */
    url = url.split('?').shift();

    // Update the query URL
    Islandora.DSS.SolrSearch.query.url = url;

    // Further, attempt to override or integrate the other GET parameters
    params = $.extend(params, Islandora.DSS.SolrSearch.query.params);

    // This ensures that the browser's history state is updated with the latest result set
    // Resolves DSS-559
    if(window.history.pushState) {
	
	var historyUrl = url + '?' + $.param(params);
	window.history.pushState({'Islandora.DSS.SolrSearch' : { 'url': url, 'params': params } }, 'DSS Search Results | Digital Scholarship Services', historyUrl);
    }

    // Resolves DSS-609
    if( params.hasOwnProperty('sort') ) {

	params['sort'] = params['sort'].replace(/\+/, ' ');
    }
    
    $.get(url, params, function(data) {
	    
	    $('.islandora-solr-search-results').removeClass('loading').append($(data).find('.islandora-solr-search-results').children());
	});

    $('.islandora-solr-search-results').empty().addClass('loading');
};

/**
 * 
 *
 */
LafayetteDssObjectList.viewGridClickHandler = function(e) {

    e.preventDefault();
    //infiniteList.unbind();
    //$.ias().unbind();

    // AJAX-integrated
    var url = $(document).data('islandoraDssDateRangeSlider')['query'] || '/islandora/search/*:*';

    /**
     * @todo Resolve
     *
     */
    if(/\/browse/.exec(document.URL)) {
		    
    } else {
	
	url = '/' + url;
    }
    
    var params = $(document).data('islandoraDssSolrResultsViewParams') || {};
    
    /**
     * Integrating List/Grid view widgets
     * Refactor into a Global Object (accessed by multiple Modules)
     * This resolves DSS-178
     *
     */
    var sortParams = $(document).data('islandoraDssSolrResultsSortParams');
    
    params = $.extend(params, sortParams, { display: 'grid' });
    $(document).data('islandoraDssSolrResultsViewParams', params);
    
    var facetQueries = $(document).data('islandoraDssDateRangeFacetQueries') || {};
    
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
    params = $.extend(params, facetParams);
    
    /**
     * Attempting to resolve issues related to GET parameter parsing
     *
     */
    url = url.split('?').shift();

    // Update the query URL
    Islandora.DSS.SolrSearch.query.url = url;

    // Further, attempt to override or integrate the other GET parameters
    params = $.extend(params, Islandora.DSS.SolrSearch.query.params);

    // This ensures that the browser's history state is updated with the latest result set
    // Resolves DSS-559
    if(window.history.pushState) {
	
	var historyUrl = url + '?' + $.param(params);
	window.history.pushState({'Islandora.DSS.SolrSearch' : { 'url': url, 'params': params } }, 'DSS Search Results | Digital Scholarship Services', historyUrl);
    }

    // Resolves DSS-609
    if( params.hasOwnProperty('sort') ) {

	params['sort'] = params['sort'].replace(/\+/, ' ');
    }

    $.get(url, params, function(data) {
	    
	    $('.islandora-solr-search-results').removeClass('loading').append($(data).find('.islandora-solr-search-results').children());
	});

    $('.islandora-solr-search-results').empty().addClass('loading');
};

/**
 *
 */
LafayetteDssObjectList.displaySwitch = function() {

    $('.islandora-view-list').click(LafayetteDssObjectList.viewListClickHandler);

    // Transition for visibility
    $('.islandora-view-list').toggleClass('shown');

    $('.islandora-view-grid').click(LafayetteDssObjectList.viewGridClickHandler);

    // Transition for visibility
    $('.islandora-view-grid').toggleClass('shown');

    // Abstract and refactor
    //var infiniteList = new IslandoraDssSolrInfinite($, Drupal.settings.dssSolrInfinite);
};

/**
 * Sorting functionality
 *
 */
LafayetteDssObjectList.prototype = {

    constructor: LafayetteDssObjectList,

    sort: function(fieldSelector, order) {

	//fieldSelector = fieldSelector || this.fieldSelector;
	order = order || this.order;
	$ = this.$;
	var that = this;

	// AJAX-integrated
	var url = $(document).data('islandoraDssDateRangeSlider')['query'] || '/islandora/search/*:*';

	// Work-around for GET parameters
	url = url.replace('&sort=dc.date.sort asc', '');

	/**
	 * Resolves DSSSM-725
	 *
	 */
	if(/\/browse/.exec(url)) {
	    
	    url = '/islandora/search/*:*';
	} else {

	    url = document.URL.split('?').shift();
	}

	var params = $(document).data('islandoraDssDateRangeFacetParams') || {};
	
	/**
	 * Resolving issues related to pagination
	 *
	 */
	delete params['page'];

	var sortParam = this.options.field + ' ' + this.options.order;

	/**
	 * Integrating List/Grid view widgets
	 * Refactor into a Global Object (accessed by multiple Modules)
	 * This resolves DSS-178
	 *
	 */
	var listGridParams = $(document).data('islandoraDssSolrResultsViewParams') || {};
	$(document).data('islandoraDssSolrResultsSortParams', { sort: sortParam });

	params = $.extend(params, listGridParams, { sort: sortParam });
	$(document).data('islandoraDssDateRangeFacetParams', params);

 	/**
	 * For AJAX-integration, this assumes that the Solr results are NOT paginated
	 * Given that this is unsupported until the AJAX-integrated theme is released, this has been disabled
	 *
	 */

	// This ensures that the browser's history state is updated with the latest result set
	// Resolves DSS-559
	if(window.history.pushState) {
	
	    var historyUrl = url + '?' + $.param(params);
	    window.history.pushState({'Islandora.DSS.SolrSearch' : { 'url': url, 'params': params } }, 'DSS Search Results | Digital Scholarship Services', historyUrl);
	}

	// Resolves DSS-609
	if( params.hasOwnProperty('sort') ) {

	    params['sort'] = params['sort'].replace(/\+/, ' ');
	}

	$.get(url, params, function(data) {

		$('.islandora-solr-search-results').removeClass('loading')
		    .append($(data).find('.islandora-solr-search-results').children())
		    .prev().find('.pagination-count').replaceWith($(data).find('.pagination-count'));

		/**
		 * Resolves DSS-249
		 *
		 */
		$('.pagination-count-bottom').last().replaceWith($(data).find('.pagination-count-bottom'));
		$('.pagination li a').click(LafayetteDssObjectList.paginationLinkHandler);
	    });

	$('.islandora-solr-search-results').empty().addClass('loading');
    }
};



/**
 * Drupal integration
 *
 */
(function($, Drupal, LafayetteDssObjectList) {

    /**
     * This should invoke the constructor for the Object
     *
     */
    Drupal.theme.prototype.bootstrapDssObjectList = function() {

	var objectList = new LafayetteDssObjectList($, $('.islandora-solr-search-result-list'));

	/**
	 * Resolves DSSSM-652
	 *
	 */
	$('.field-sort').click(function(e) {

		e.preventDefault();
		$('.field-sort.active').removeClass('active');
		$(this).addClass('active');

		objectList.options.field = $('#field-sort-select').val();
		objectList.options.order = /field\-sort\-(.+)/.exec( $(this).attr('id'))[1];
		objectList.sort();
	    });

	/**
	 * Handler for sorting by a new field
	 *
	 */

	/**
	 * Resolves DSSSM-652
	 *
	 */
	$('#field-sort-select').on('change', function(e) {

		objectList.options.field = $(this).val();

		/** Reset the sorting order
		 * This should always set the sort order to "asc"
		 * Resolves DSSSM-653
		 */
		$('.field-sort.active').removeClass('active').parent().children('#field-sort-asc').addClass('active');

		objectList.options.order = /field\-sort\-(.+)/.exec( $('.field-sort.active').attr('id'))[1];
		objectList.sort();
	    });

	$('.pagination li a').click(LafayetteDssObjectList.paginationLinkHandler);

	// @todo Refactor
	LafayetteDssObjectList.displaySwitch();
    };

    // @todo Refactor
    $(document).ready(function() {
	    
	    Drupal.theme('bootstrapDssObjectList');
	});

})(jQuery, Drupal, LafayetteDssObjectList);
