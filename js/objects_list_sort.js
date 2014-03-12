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
};

/**
 * ObjectList Object
 *
 */
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

	/**
	 * @todo Resolve
	 *
	 */
	url = '/' + url;
	var params = $(document).data('islandoraDssDateRangeFacetParams') || {};
	var sortParam = this.options.field + ' ' + this.options.order;

	/**
	 * Integrating List/Grid view widgets
	 * Refactor into a Global Object (accessed by multiple Modules)
	 * This resolves DSS-178
	 *
	 */
	var listGridParams = $(document).data('islandoraDssSolrResultsViewParams');
	$(document).data('islandoraDssSolrResultsSortParams', { sort: sortParam });

	params = $.extend(params, listGridParams, { sort: sortParam });
	$(document).data('islandoraDssDateRangeFacetParams', params);

	$.get(url, params, function(data) {

		$('.islandora-solr-search-results').removeClass('loading').append($(data).find('.islandora-solr-search-results').children());
	    });
	$('.islandora-solr-search-results').empty().addClass('loading');
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
	var objectList = new LafayetteDssObjectList($, $('.islandora-solr-search-result-list'));

	//$('.islandora-discovery-control.title-sort-control select').change(function() {
	$('.field-sort').click(function(e) {

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

	$('#field-sort-select option').click(function(e) {

		objectList.options.field = $(this).val();
		objectList.options.order = /field\-sort\-(.+)/.exec( $('.field-sort.active').attr('id'))[1];
		objectList.sort();
	    });
    };

    // @todo Refactor
    $(document).ready(function() {
	    
	    Drupal.theme('bootstrapDssObjectList');
	});

})(jQuery, Drupal, LafayetteDssObjectList);
