/**
 * @file A widget for sorting Islandora Objects within an ordered list (<ol>)
 * @author griffinj@lafayette.edu
 *
 */

"use strict";

    /*
    if(ASC) oldASC = ASC;
    if(DESC) oldDESC = DESC;
    */

    // Globals
    /*
    var ASC = true;
    var DESC = false;
    */

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
 * AJAX-integrated page browsing
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

    url = url.split('?').shift();

    /**
     * Resolves DSSSM-725
     *
     */
    if(/collections\/browse/.exec(url)) {
		    
	url = '/islandora/search/*:*';
    }

    $.get(url, params, function(data) {

	    $('.islandora-solr-search-results').removeClass('loading')
		.append($(data).find('.islandora-solr-search-results').children())
		.prev().find('.pagination-count').replaceWith($(data).find('.pagination-count'));
	    //.prev().find('.pagination-count').replaceWith($(data).find('.pagination-count'))
	    //.prev().find('.pagination-count-bottom').replaceWith($(data).find('.pagination-count-bottom'));

	    //.prev().find('.pagination-count-bottom').replaceWith($(data).find('.pagination-count-bottom'));
	    $('.pagination-count-bottom').last().replaceWith($(data).find('.pagination-count-bottom'));
	    $('.pagination li a').click(LafayetteDssObjectList.paginationLinkHandler);
	});
    
    $('.islandora-solr-search-results').empty().addClass('loading');
};

LafayetteDssObjectList.prototype = {

    constructor: LafayetteDssObjectList,

    sort: function(fieldSelector, order) {

	//fieldSelector = fieldSelector || this.fieldSelector;
	order = order || this.order;
	$ = this.$;
	var that = this;

	/*

	this._index = this.$element.children('.islandora-solr-search-result').sort(function(u, v) {
		
		return $(u).find(fieldSelector).text().localeCompare($(v).find(fieldSelector).text());
	    });

	if(order != this.order) {

	    this._index = $(this._index.get().reverse());
	    this.order = order;
	}

	this.$element.empty().append(this._index);
	*/

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

	    url = '/islandora/search/*:*';
	}

	/**
	 * @todo Resolve
	 *
	 */
	/*
	if(!/\browse/.exec(url)) {

	    url = '/' + url;
	}
	*/

	var params = $(document).data('islandoraDssDateRangeFacetParams') || {};
	
	/**
	 * Resolving issues related to pagination
	 *
	 */
	delete params['page'];

	var sortParam = this.options.field + ' ' + this.options.order;

	// This appears to create further issues within islandora_solr
	/*
	if(this.options.field != 'dc.title') {

	    sortParam += ',dc.title asc';
	}
	*/

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

	/**
	 * For integration with the TinySort jQuery plug-in
	 *
	 */
	/*
	if(listGridParams['display'] == 'grid') {

	    $('.islandora-basic-collection-object').tsort('dd.' + this.options.field.toLowerCase().replace(/\.sort/, '').replace('.', '-', 'g'), { order: this.options.order });
	} else {

	    $('.islandora-solr-search-result').tsort('dd.' + this.options.field.toLowerCase().replace(/\.sort/, '').replace('.', '-', 'g'), { order: this.options.order });
	}
	*/
	//$('.islandora-solr-search-results').empty().addClass('loading');
	
    }
};

/**
 * Drupal integration
 *
 */
(function($, Drupal, LafayetteDssObjectList) {

    Drupal.theme.prototype.bootstrapDssObjectList = function() {

	/*
	$('.field-sort').click(function(e) {

		e.preventDefault();
		$('.field-sort').toggleClass('active');
	    });
	*/

	//var objectList = new LafayetteDssObjectList($, $('.islandora-solr-search-result-list'), { order: $('#order-sort-select').val() });
	/*
	var objectList = new LafayetteDssObjectList($, $('.islandora-solr-search-result-list'), {

		order: Drupal.settings.islandoraDssSolrFacetPages.order,
		field: Drupal.settings.islandoraDssSolrFacetPages.field
	    });
	*/
	var objectList = new LafayetteDssObjectList($, $('.islandora-solr-search-result-list'));

	//$('.islandora-discovery-control.title-sort-control select').change(function() {

	/**
	 * Resolves DSSSM-652
	 *
	 */
	$('.field-sort').click(function(e) {
	//$('.field-sort').on('click change touchstart', function(e) {

		e.preventDefault();
		$('.field-sort.active').removeClass('active');
		$(this).addClass('active');

		//objectList.sort($(this).val(), $('#order-sort-select').val());
		//objectList.sort($(this).val(), preg_match('/field\-sort\-(.+)/', $('.field-sort.active').attr('id'))[1]);

		//objectList.sort($(this).val(), /field\-sort\-(.+)/.exec( $(this).attr('id'))[1] );
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
	//$('#field-sort-select option').click(function(e) {
	//$('#field-sort-select option').on('click change touchstart', function(e) {
	$('#field-sort-select').on('change', function(e) {

		objectList.options.field = $(this).val();

		/** Reset the sorting order
		 * This should always set the sort order to "asc"
		 * Resolves DSSSM-653
		 */
		//$('.field-sort.active').removeClass('active').siblings('.field-sort').addClass('active');
		$('.field-sort.active').removeClass('active').parent().children('#field-sort-asc').addClass('active');

		objectList.options.order = /field\-sort\-(.+)/.exec( $('.field-sort.active').attr('id'))[1];
		objectList.sort();
	    });

	$('.pagination li a').click(LafayetteDssObjectList.paginationLinkHandler);
    };

    // @todo Refactor
    $(document).ready(function() {
	    
	    Drupal.theme('bootstrapDssObjectList');
	});

})(jQuery, Drupal, LafayetteDssObjectList);
