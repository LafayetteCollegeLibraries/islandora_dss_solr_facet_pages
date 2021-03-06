/**
 * @file Integration for the jQRangeSlider widget and Drupal
 * @author griffinj@lafayette.edu
 *
 */

var Drupal = Drupal || {};

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

    // Specialized for top-level collections
    'Choose a Collection' : 'cdm.Relation.IsPartOf',

    'Relation.IsPartOf' : 'cdm.Relation.IsPartOf',

    // McKelvy, and Newspaper
    'Date' : 'dc.date.sort',
    'Publisher' : 'dc.publisher',

    // McKelvy
    'Date.Original' : 'mdl_prints.date.original',

    // EAIC
    'Subject.OCM' : 'eastasia.Subject.OCM',
    'Coverage.Location.Country' : 'eastasia.Coverage.Location.Country',
    'Coverage.Location' : 'eastasia.Coverage.Location',

    'Creator.Maker' : 'eastasia.Creator.Maker',
    'Creator.Company' : 'eastasia.Creator.Company',
    'Description.Ethnicity' : 'eastasia.Description.Ethnicity',
    'Date.Artifact.Lower' : 'eastasia.Date.Artifact.Lower',
    'Date.Artifact.Upper' : 'eastasia.Date.Artifact.Upper',
    'Date.Image.Lower' : 'eastasia.Date.Image.Lower',
    'Date.Image.Upper' : 'eastasia.Date.Image.Upper',

    // MDL
    'Subject.LCSH' : 'mdl_prints.subject.lcsh',
    'Description.Series' : 'mdl_prints.description.series',
    'Creator' : 'mdl_prints.creator',

    // Geology
    'Subject' : 'geology_slides_esi.subject',
    'Coverage' : 'geology_slides_esi.coverage.location',
    'Vantage Point' : 'geology_slides_esi.description.vantagepoint',

    // LDR
    'dc.date.accessioned' : 'ldr.dc.date.accessioned',
    'dc.contributor.author' : 'ldr.dc.contributor.author',

    // War Casualties
    'Graduating Class' : 'war_casualties.description.class',
    'Honors' : 'war_casualties.description.honors',
    'Military Branch' : 'war_casualties.description.military.branch',
    'Military Rank' : 'war_casualties.description.military.rank',
    'Military Unit' : 'war_casualties.contributor.military.unit',

    // Alumni
    'Series' : 'MODS.mods.relatedItem.titleInfo.title_s',
    'Volume' : 'MODS.mods.relatedItem.part.detail.volume.number_i',

    // Refactor: labels

    'cdm.Relation.IsPartOf' : 'Relation.IsPartOf',

    'dc.publisher' : 'Publisher',
    'dc.date.sort' : 'Publication Date',

    // EAIC
    'eastasia.Subject.OCM' : 'Subject.OCM',
    'eastasia.Coverage.Location.Country' : 'Coverage.Location.Country',
    'eastasia.Coverage.Location' : 'Coverage.Location',
    'eastasia.Format.Medium' : 'Format.Medium',
    'eastasia.Creator.Maker' : 'Creator.Maker',
    'eastasia.Creator.Company' : 'Creator.Company',
    'eastasia.Description.Ethnicity' : 'Description.Ethnicity',
    'eastasia.Date.Artifact.Lower' : 'Date.Artifact.Lower',
    'eastasia.Date.Artifact.Upper' : 'Date.Artifact.Upper',
    'eastasia.Date.Image.Lower' : 'Date.Image.Lower',
    'eastasia.Date.Image.Upper' : 'Date.Image.Upper',

    // MDL
    'mdl_prints.subject.lcsh' : 'Subject.LCSH',
    'mdl_prints.format.medium' : 'Format.Medium',
    'mdl_prints.description.series' : 'Description.Series',
    'mdl_prints.creator' : 'Creator',
    'mdl_prints.date.original' : 'Date.Original',

    // LDR
    'ldr.dc.date.accessioned' : 'dc.date.accessioned',
    'ldr.dc.contributor.author' : 'dc.contributor.author',

    // War Casualties
    'war_casualties.description.class' : 'Graduating Class',
    'war_casualties.description.honors' : 'Honors',
    'war_casualties.description.military.branch' : 'Military Branch',
    'war_casualties.description.military.rank' : 'Military Rank',
    'war_casualties.contributor.military.unit' : 'Military Unit',

    // Geology
    'geology_slides_esi.subject' : 'Subject',
    'geology_slides_esi.coverage.location' : 'Coverage',
    'geology_slides_esi.description.vantagepoint' : 'Vantage Point',
    'geology_slides_esi.date.original' : 'Publication Date',

    'mckelvy.date.original.display' : 'Publication Date',

    // Alumni
    'MODS.mods.originInfo.publisher_s' : 'Publisher',
    'MODS.mods.relatedItem.date.w3cdtf_dts' : 'Date',
    'MODS.mods.relatedItem.titleInfo.title_s' : 'Series',
    'MODS.mods.relatedItem.part.detail.volume.number_i' : 'Volume'
};

SolrQuery.COLLECTION_FIELD_MAP = {

    
};

/**
 * Static methods
 *
 */

/**
 * Deprecated
 * @todo Remove
 * Work-around for MARC relators inserted into metadata
 * @todo Resolve by reindexing 
 *
 */
SolrQuery.marcRelatorFilter = function(fieldValue, fieldName) {

    /*
    if(fieldName == 'eastasia.Format.Medium') {

	var MARC_RELATOR_MAP = {

	    '"Photographic negative"': '"photonegative"',
	    '"Photographic print"': '"photoprint"',
	    '"Photographic slide"': '"slide"',
	    '"Picture postcard"': '"picture postcard"'
	};	

	return MARC_RELATOR_MAP[fieldValue];

	/*
    } else if(fieldName == 'mdl_prints.format.medium') {

	var MARC_RELATOR_MAP = {

	    '"lithograph"': '"photoprint"'
	};

	return MARC_RELATOR_MAP[fieldValue];
    }

    }
    */

    return fieldValue;
};

/**
 * Terrible work-around
 * @todo Refactor for a more complex mapping between collection names, Solr field names, and field labels
 *
 */
SolrQuery.fieldMap = function(field) {

    // Work-around
    var $ = jQuery;
    var facetQueries = jQuery(document).data('islandoraDssDateRangeFacetQueries');
    var collection = facetQueries['cdm.Relation.IsPartOf'] || [''];
    collection = collection[0];

    /*
    if(typeof(facetQueries['cdm.Relation.IsPartOf']) !== 'undefined') {

	collection = facetQueries['cdm.Relation.IsPartOf'];
    }
    */

    if(field == 'cdm.Relation.IsPartOf') {

	// For the top-level collections
	//if(/collections\/browse/.exec(document.URL)) {
	if(/collections\/browse/.exec(collection) || /collections\/browse/.exec(document.URL) ) {
	    
	    return 'Choose a Collection';
	} else {

	    return SolrQuery.FIELD_MAP[field];
	}
    } else if(field == 'Date') {

	if(/magazine/i.exec(collection) || /magazine/i.exec(document.URL) ) {

	    return 'MODS.mods.relatedItem.date.w3cdtf_dts';
	} else if(/sbarchive/i.exec(collection) || /sbarchive/i.exec(document.URL) ) {

	    return 'MODS.mods.relatedItem.date.w3cdtf_dts';
	} else if(/geology/i.exec(collection) || /geology/i.exec(document.URL) ) {

	    return 'geology_slides_esi.date.original';
	} else {

	    return 'dc.date.sort';
	}
    } else if(field == 'Format.Medium') {

	// Simply parse for 'Marquis' within the Solr query in the URL
	//if(/Marquis/.exec(document.URL) || /lafayetteprints/.exec(document.URL) ) {
	if(/Marquis/.exec(collection) || /lafayetteprints/.exec(document.URL)) {
	    
	    return 'mdl_prints.format.medium';
	} else {

	    return 'eastasia.Format.Medium';
	}
    } else if(field == 'Medium') {  // Resolves DSSSM-756

	//if(/newspaper/i.exec(document.URL) || /historical/i.exec(document.URL) ) {
	if(/newspaper/i.exec(collection) || /historical/i.exec(collection) ||
	   /newspaper/i.exec(document.URL) || /historical/i.exec(document.URL) ||
	   /mckelvy/i.exec(collection) || /mckelvy/i.exec(document.URL)) {

	    return 'dc.type';
	} else {

	    return 'mdl_prints.format.medium';
	}
    } else if(field == 'Subject') {

	// Simply parse for 'Historical' within the Solr query in the URL
	/**
	 * Resolves DSS-258
	 *
	 */
	//if(/historical/i.exec(document.URL) || /newspaper/i.exec(document.URL) ) {
	//if(/newspaper/i.exec(document.URL) ) {
	if(/newspaper/i.exec(collection) || /newspaper/i.exec(document.URL) ||
	   /mckelvy/i.exec(collection) || /mckelvy/i.exec(document.URL) ||
	   /historical/i.exec(collection) || /historical/i.exec(document.URL)) {
	    
	    return 'dc.subject';
	} else {

	    return 'geology_slides_esi.subject';
	}
    } else if(field == 'Date.Original') {

	// Simply parse for 'Marquis' within the Solr query in the URL
	//if(/Marquis/.exec(document.URL) || /lafayetteprints/.exec(document.URL) ) {
	if(/Marquis/.exec(collection) ||
	   /lafayetteprints/.exec(document.URL) ) {
	    
	    return 'mdl_prints.date.original';
	} else {

	    return 'mckelvy.date.original.display';
	}
    } else if(field == 'Publication Date') {

	//if(/mckelvy/i.exec(document.URL)) { // Resolves DSSSM-756
	if(/mckelvy/i.exec(collection) ||
	   /mckelvy/i.exec(document.URL)) { // Resolves DSSSM-756
	    
	    return 'mckelvy.date.original.display';
	    //} else if(/geology/i.exec(document.URL)) { // Resolves DSSSM-757
	} else if(/geology/i.exec(collection) ||
		  /geology/i.exec(document.URL)) { // Resolves DSSSM-757

	    return 'geology_slides_esi.date.original';
	    //} else if(/historical/i.exec(document.URL)) { // Resolves DSS-261
	} else if(/historical/i.exec(collection) ||
		  /historical/i.exec(document.URL)) { // Resolves DSS-261

	    //return 'mdl_prints.date.original';
	    return 'dc.date.sort';
	} else {

	    return 'dc.date.sort';
	}
    } else if(field == 'Publisher') {
	if(/alumni/i.exec(collection) ||
	   /alumni/i.exec(document.URL)) {

	    return 'MODS.mods.originInfo.publisher_s';
	} else if(/sbarchive/i.exec(collection) ||
		  /sbarchive/i.exec(document.URL)) {

	    return 'MODS.mods.originInfo.publisher_s';
	} else {

	    return 'dc.publisher';
	}
    } else {
	
	return SolrQuery.FIELD_MAP[field];
    }
};

SolrQuery.getQuery = function(url, $, query) {

    $ = $ || jQuery;

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

SolrQuery.getFacets = function getFacets(url, $, facets, query) {

    url = url || document.URL;
    $ = $ || jQuery;

    url = decodeURI(url);
    
    /**
     * Resolves DSSSM-725
     *
     */
    if(facets) {

	//var urlSegments = facets.split(/\??&?\d\=/).map(function(e, i) { return decodeURI(e).replace('+', ' ', 'g'); });
	/**
	 * This must be a RegExp Object for v8 Core based browsers
	 * Resolves DSSSM-790
	 */
	var urlSegments = facets.split(/\??&?\d\=/).map(function(e, i) { return decodeURI(e).replace(/\+/g, ' ', 'g'); });
    } else {

	var urlSegments = url.split(/\??&?f\[\d\]\=/);
	var query = urlSegments[0];
    }

    var _facetParams = $.map(urlSegments.slice(1), function(e, i) {
		    
	    var facetId = 'f[' + i + ']';
	    var obj = {};

	    // Detecting date range facets
	    if(/(\:|%3A)\[[\d-]+T/.exec(e)) {

		var paramName = /(.+?)(\:|%3A)/.exec(e)[1];

		// new Date(/\[(.+?)\sT/.exec(decodeURI('geology_slides_esi.date.original%3A[1967-12-01T00%3A00%3A00Z TO 1968-06-01T00%3A00%3A00Z]'))[1].replace('%3A',':','g'))
		var paramValueStr = e.split(/(\s|\+)TO(\s|\+)/);
		var paramMinStr = paramValueStr[0];

 		/**
		 * RegExp Objects must be utilized within String.prototype.replace() invocations
		 * (Specific to V8 engine)
		 * Resolves DSS-271
		 *
		 */
		paramMinStr = /\[(.+)/.exec(paramMinStr)[1].replace(/%3A/g,':','g');

		var paramMaxStr = paramValueStr.pop();

 		/**
		 * RegExp Objects must be utilized within String.prototype.replace() invocations
		 * (Specific to V8 engine)
		 * Resolves DSS-271
		 *
		 */
		paramMaxStr = /(.+?)\]/.exec(paramMaxStr)[1].replace(/%3A/g, ':', 'g');

		//var paramMin = +new Date(/\[(.+?)\sT/.exec(e)[1].replace('%3A',':','g'));
		//var paramMax = +new Date(/TO\s(.+?)\]/.exec(e)[1].replace('%3A',':','g'));
		var paramMin = +new Date(paramMinStr);
		var paramMax = +new Date(paramMaxStr);
		obj[paramName] = [paramMin, paramMax];

		var paramMin = new Date(paramMinStr).toISOString();

		/**
		 * Ensures that Solr/Lucene constant NOW is parsed as the current time
		 * Resolves DSSSM-549
		 */
		if(paramMaxStr === 'NOW') {

		    var paramMax = new Date().toISOString();
		} else {

		    var paramMax = new Date(paramMaxStr).toISOString();
		}

		obj[paramName] = ["[" + paramMin + " TO " + paramMax + "]"];
	    } else {

		/*
		var paramSegments = e.split(/\:|%3A/);

		/*
		  var fieldName = paramSegments[0];
		  //return { facetId : { fieldName : paramSegments[1] }};
		  
		  return { fieldName : paramSegments[1] };
		* /

		var paramValue = paramSegments[1].replace(/#$/, '', 'g');
		
		if(typeof(obj[paramSegments[0]]) === 'undefined') {

		    obj[paramSegments[0]] = [paramValue];
		} else {

		    obj[paramSegments[0]].concat(paramValue);
		}
		*/

		var paramName = /(.+?)(\:|%3A)/.exec(e)[1];
		//var paramSegments = e.split(/\:|%3A/);
		//var paramValue = paramSegments[1].replace(/#$/, '', 'g');
		var paramValue = e.split(/\:|%3A/).slice(1).join(':');

		/**
		 * This resolves URL fragments
		 *
		 */
		paramValue = paramValue.replace(/#/, '');

		/**
		 * This resolves arguments
		 *
		 */
		paramValue = paramValue.split('&').shift();

		/**
		 * This decodes URI-encoded characters
		 * Resolves DSSSM-460
		 */
		paramValue = paramValue.replace(/%26/g, '&', 'g');
		paramValue = paramValue.replace(/%2F/g, '/', 'g');

		/*
		var paramValue = '';
		for(var i in paramSegments) {

		    if(typeof(paramSegments[i + 1]) !== 'undefined') {

			paramValue = paramSegments[i + 1].replace(/#$/, '', 'g');
		    }
		}
		*/

		if(typeof(obj[paramName]) === 'undefined') {

		    obj[paramName] = [paramValue];
		} else {

		    obj[paramName].concat(paramValue);
		}

	    }

	    return obj;
	});

    var out = {};
    $.each(_facetParams, function(i, e) {

	    for(key in e) {
		
		if(typeof(out[key]) === 'undefined') {

		    out[key] = e[key];
		} else {

		    out[key] = out[key].concat(e[key]);
		}
	    }
	});

    return out;

    /*
    return _facetParams.reduce(function(u, v) {
	    
	    for(key in u) {

		if(typeof(v[key]) !== 'undefined') {

		    u[key] = u[key].concat(v[key]);
		}
	    }

	    return u;
	});
    */
};

/**
 * Deprecated
 * @todo Remove
 *
 */
SolrQuery.getFacetTokenUrl = function getFacetTokenUrl(token, $) {

    var $ = $ || jQuery;

    $token = $(token);
    //facetQuery = decodeURI($(token).attr('href'));
    facetQuery = $(token).attr('href');

    //facetQueryField = facetQuery.split(/\??f\[\d\]\=?/).pop();
    //return '/islandora/search/' + query + facets;

    return facetQuery.replace(new RegExp("(\\?|&)f\\[\\d\\]\\=" + facetQuery.split(/\??f\[\d\]\=?/).pop()), '');
};

/**
 * Deprecated
 * @todo Remove
 *
 */
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

/**
 * Deprecated
 * @todo Remove
 *
 */
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


SolrQuery.getQueries = function(facetQueries) {

    var facetParams = {};

    var i = 0;
    for(key in facetQueries) {

	for(k in facetQueries[key]) {

	    var facetKey = 'f[' + i + ']';
	    //facetParams[ facetKey ] = key + ":" + facetQueries[key][k];

	    //if(/"(.+?)"/.exec(facetQueries[key][k])) {
	    if(true) {

		//facetParams[ facetKey ] = key + ":" + facetQueries[key][k].replace('%26', '&');
		facetParams[ facetKey ] = key + ":" + facetQueries[key][k];
	    } else {

		facetParams[ facetKey ] = key + ":" + facetQueries[key][k].replace('%26', '&').replace('%2F', '/');
	    }
	    i++;
	}
	//i++;
    }

    return facetParams;
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

	if(Drupal.settings.islandoraDssSolrFacetPages) {

	    var _query = SolrQuery.getQuery(document.URL, $, Drupal.settings.islandoraDssSolrFacetPages.query);
	    var _facets = SolrQuery.getFacets(document.URL, $, Drupal.settings.islandoraDssSolrFacetPages.facets, Drupal.settings.islandoraDssSolrFacetPages.query);
	} else {

	    var _query = SolrQuery.getQuery(document.URL);
	    var _facets = SolrQuery.getFacets(document.URL);
	}

	/**
	 * Global variables
	 *
	 */

	// Handled by Drupal instead
	//$('#block-islandora-solr-facet-pages-islandora-solr-facet-pages h2.block-title').after('<ul class="islandora-solr-facet-token-list"></ul>');

	var currentQuery = decodeURI(document.URL).split(/\?f\[0\]/)[0];
	//currentQuery = /(islandora\/search\/.+)/.exec(document.URL)[1];
	var m = /(islandora\/search\/.+)/.exec(currentQuery);
	if(m) {

	    currentQuery = m[1];
	}

	// For sorting/filtering by facet value
	$(document).data('islandoraDssDateRangeSlider', {

		query: currentQuery,
		maxFacet: (facets.length == 1 ? 0 : facets.length - 2),
	    });

	// For storing the initial values of the date range sliders
	$(document).data('islandoraDssDateRangeInitValues', {});

	// For facetQueries
	//var facetQueries = SolrQuery.getFacets();
	var facetQueries = _facets;
	$(document).data('islandoraDssDateRangeFacetQueries', facetQueries);

	// For facetParams
	// Refactor
	var facetParams = SolrQuery.getQueries(facetQueries);

	/*
	var facetParams = {};
	var facetIndex = 0;

	for(var key in facetQueries) {

	    for(var k in facetQueries[key]) {

		var facetKey = 'f[' + facetIndex + ']';
		//facetParams[ facetKey ] = key + ":" + facetQueries[key][k];

		/**
		 * Resolves DSSSM-533
		 *
		 * /
		//facetParams[ facetKey ] = key + ":" + facetQueries[key][k].replace('%26', '&');
		facetParams[ facetKey ] = key + ":" + facetQueries[key][k].replace('%26', '&').replace('%2F', '/');
		facetIndex++;
	    }
	}
	*/

	/**
	 * Ensures that the sorted field is preserved for URL aliases
	 * Resolves 
	 */
	var sortMatch = /sort\=(.+?) (asc|desc)/i.exec(decodeURI(document.URL));
	if(sortMatch) {

	    //facetParams['sort'] = sortMatch[1] + ' ' + sortMatch[2];
	    var sortParams = $(document).data('islandoraDssSolrResultsSortParams') || {};
	    $(document).data('islandoraDssSolrResultsSortParams', $.extend({sort: sortMatch[1] + ' ' + sortMatch[2] }, sortParams));
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
	    var snapTriggerHandler = $(document).data('snapTriggerHandler');

	    if($(data).find('#page-header p.lead a.active').text() != ('0' + '\xA0' + 'Items Found')) {

		$(data).find('#block-islandora-solr-facet-pages-islandora-solr-facet-pages').appendTo($('.region-slide-panel').empty());
		$(data).find('.main-container').children().appendTo($('.main-container').empty().removeClass('loading'));

		$('.snap-trigger').parent().toggleClass('loaded').children().toggleClass('shown').children('img').toggleClass('shown');

		// Only if the query has returned results for the query
		if($('.snap-trigger').html()) {

		    $('.snap-trigger').html( $('.snap-trigger').html().replace('Refine', 'Hide'));
		}

		// Abstract and refactor
		Drupal.theme('bootstrapDssObjectList');
		//var infiniteList = new IslandoraDssSolrInfinite($, Drupal.settings.dssSolrInfinite);
		Drupal.behaviors.islandoraDssSolrInfinite();
		that.facetDateHandler();
		that.facetModalHandler();
		that.dateSliderResetHandler();

		/**
		 * @todo Decouple and refactor
		 *
		 */
		snapTriggerHandler();
		$('.snap-trigger').parent().toggleClass('loaded').children().toggleClass('shown').children('img').toggleClass('shown');
		
		$('.islandora-solr-facet-list li a, .islandora-solr-facet-token-list li a').filter(function(i, e) {

			return $(e).text() != 'Show more...' && $(e).text() != 'View all values...' }).click(that.facetLinkHandler);
	    } else {

		$('.islandora-solr-facet-token-list').remove();
		$('#block-islandora-solr-facet-pages-islandora-solr-facet-pages .block-title').after($(data).find('#block-islandora-solr-facet-pages-islandora-solr-facet-pages .islandora-solr-facet-token-list'));

		//$(data).find('#block-islandora-solr-facet-pages-islandora-solr-facet-pages').appendTo($('.region-slide-panel').empty());
		$(data).find('.main-container').children().appendTo($('.main-container').empty().removeClass('loading'));
		//that.facetDateHandler();
		//that.facetModalHandler();
		that.dateSliderResetHandler();

		/**
		 * @todo Decouple and refactor
		 *
		 */
		snapTriggerHandler();
		$('.snap-trigger').parent().toggleClass('loaded').children().toggleClass('shown').children('img').toggleClass('shown');

		$('.islandora-solr-facet-list li a, .islandora-solr-facet-token-list li a').filter(function(i, e) {
			
			return $(e).text() != 'Show more...' && $(e).text() != 'View all values...' }).click(that.facetLinkHandler);
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

	    /**
	     * Implementing functionality to restrict facet selection
	     * Resolves DSSSM-804
	     */
	    $('.ui-dialog .fancy-box-container #islandora-dss-solr-facet-pages-facets-form').find('.form-checkbox').click(function(e) {
	    //	    $('#islandora-dss-solr-facet-pages-facets-form').find('.form-checkbox').click(function(e) {

		    //$(this).parents('.form-type-checkbox').siblings().find('.form-checkbox').prop('disabled', true);
		    var siblingCheckboxes = $(this).parents('.form-type-checkbox').siblings().find('.form-checkbox');
		    siblingCheckboxes.prop('disabled', !siblingCheckboxes.prop('disabled'));
		});

	    //$('#islandora-dss-solr-facet-pages-facets-form').submit(function(event) {
	    $('#islandora-dss-solr-facet-pages-facets-form .form-submit').click(function(event) {

		    event.preventDefault();
		    facetQueries = $(document).data('islandoraDssDateRangeFacetQueries') || {};

		    //var formValues = $('#islandora-dss-solr-facet-pages-facets-form').serializeArray();
		    //var formValues = $('.ui-dialog .fancy-box-container #islandora-dss-solr-facet-pages-facets-form').serializeArray();
		    var formValues = $('.ui-dialog .fancy-box-container #islandora-dss-solr-facet-pages-facets-form').filter(':visible').serializeArray();
		    var fieldObjects = formValues.filter(function (fieldObj) {
		    
			    return fieldObj.name != 'form_build_id' && fieldObj.name != 'form_id' && fieldObj.name != 'form_token';
			});

		    if(fieldObjects.length > 0) {

			//$.each(formValues.filter(function(e, i) {
			//
			//return e.name != 'form_build_id' && e.name != 'form_id' && e.name != 'form_token';
			$.each(fieldObjects, function(i, e) {

				var solrField = $(document).data('islandoraDssBrowsingField');

				//facetQueries[solrField] = e.value;

				var facetValues = facetQueries[solrField] || [];
				//facetQueries[solrField] = facetQueries[solrField] || [];
				//facetQueries[solrField] = facetQueries[solrField].concat(e.value);

				var facetValue = e.value;
				/*
				if(m = /"(.+?)"/.exec(e.value)) {

				    facetValue = m[1];
				}
				*/
				facetValue = '"' + facetValue + '"';

				if(facetValues.indexOf(facetValue) == -1) {

				    facetValues = facetValues.concat(facetValue);
				}

				facetQueries[solrField] = facetValues;
			    });

			$(document).data('islandoraDssDateRangeFacetQueries', facetQueries);
			//$.fancybox.close();
			//$('.fancy-box-container').remove();

			var url = $(document).data('islandoraDssDateRangeSlider')['query'];

			// Cannot locate the source of this bug
			url = '/' + url;
			
			facetParams = SolrQuery.getQueries(facetQueries);

			/*
			  facetParams = {};

			var facetIndex = 0;
			for(key in facetQueries) {

			    for(k in facetQueries[key]) {

				var facetKey = 'f[' + facetIndex + ']';

				/**
				 * For handling MARC relator issues
				 * @todo Remove after re-indexing
				 *
				 */
				//facetParams[ facetKey ] = key + ":" + facetQueries[key][k];
				//facetParams[ facetKey ] = key + ":" + SolrQuery.marcRelatorFilter(facetQueries[key][k], key);

			/*
				facetParams[ facetKey ] = key + ":" + SolrQuery.marcRelatorFilter(facetQueries[key][k], key).replace('%26', '&').replace('%2F', '/');
				facetIndex++;
			*/

				//var parentUrl = facetedSearchAnchor.attr('href');
				//parentUrl = getFacetTokenUrl(facetedSearchAnchor);

			/*
				var parentUrl = url;
				var linkText = '';
			*/

			    /*
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
			    */

			/**
			 * Work-around for removing improperly serialized facets
			 * @todo Properly address within other scripts
			 * Resolves DSSSM-813
			 *
			 */
			var i = 0;
			for(key in facetQueries) {

			    for(k in facetQueries[key]) {
				
				var facetKey = 'f[' + i + ']';
				var resultsViewParams = $(document).data('islandoraDssSolrResultsViewParams');
				
				if(resultsViewParams) {

				    delete resultsViewParams[facetKey];
				    $(document).data('islandoraDssSolrResultsViewParams', resultsViewParams);
				}

				var dateRangeParams = $(document).data('islandoraDssDateRangeFacetParams');

				if(dateRangeParams) {
				    
				    delete dateRangeParams[facetKey];
				    $(document).data('islandoraDssDateRangeFacetParams', dateRangeParams);
				}

				var sortParams = $(document).data('islandoraDssSolrResultsSortParams');
				if(sortParams) {
				    
				    delete sortParams[facetKey];
				    $(document).data('islandoraDssSolrResultsSortParams', sortParams);
				}
				
				i++;
			    }
			}
		    
			$('.fancy-box-container').dialog('close');

			$(document).data('islandoraDssDateRangeFacetParams', facetParams);

			var params = $(document).data('islandoraDssSolrResultsViewParams') || {};
			params = $.extend(params, facetParams);

			/**
			 * @todo Refactor
			 * Resolves DSSSM-666
			 *
			 */
			var sortParams = $(document).data('islandoraDssSolrResultsSortParams') || {};
			params = $.extend(params, sortParams);

			/**
			 * Resolves pagination issues
			 * @todo Refactor
			 *
			 */
			delete params['page'];
			url = url.replace(/page=\d+&/, '');

			/**
			 * Resolves DSSSM-725
			 *
			 */
			if(/\/browse/.exec(url)) {

			    url = '/islandora/search/*:*';
			}

			$.get(url, params, that.updatePage);
			$('.main-container').empty().addClass('loading');
		    } else {

			$('.fancy-box-container').dialog('close');
		    }
		});
	};

	/**
	 * For the modal dialog window
	 *
	 */
	this.facetModalHandler = function() {

	    $('.islandora-solr-facet-list .last a').filter(function(i, e) { return $(e).text() == 'Show more...' }).each(function(i, e) {

		    $(e).click(function(event) {

			    event.preventDefault();

			    var solrField = SolrQuery.fieldMap($(e).parent().parent().prev().text());
			    $(document).data('islandoraDssBrowsingField', solrField);

			    /*
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
			    */

			    //var facetParams = $(document).data('islandoraDssDateRangeFacetParams');
			    /**
			     * Retrieve and parse the GET parameters
			     *
			     */
			    $(document).data('islandoraDssDateRangeFacetQueries', facetQueries);

			    facetParams = SolrQuery.getQueries(facetQueries);

			    /*
			    facetParams = {};

			    var facetIndex = 0;
			    for(key in facetQueries) {

				for(k in facetQueries[key]) {

				    var facetKey = 'f[' + facetIndex + ']';
				    //facetParams[ facetKey ] = key + ":" + facetQueries[key][k];

				    /**
				     * Resolves DSSSM-533
				     *
				     * /
				    facetParams[ facetKey ] = key + ":" + facetQueries[key][k].replace('%26', '&').replace('%2F', '/');
				    facetIndex++;
				}
			    }
			    */

			    /**
			     * Parse the Solr query from the URL
			     * Resolves DSS-203
			     */
			    //var last_url_segment = decodeURI(document.URL).split('/').pop().split('?').shift().replace('%3A', ':');
			    var last_url_segment = decodeURI(document.URL).split('/').pop().split('?').shift().split("%3A").join(':');

			    if(last_url_segment.match(':')) {

				facetParams['query'] = last_url_segment;
			    }

			    var fancyBoxContainer = $('<div class="fancy-box-container loading"></div>').appendTo($('body')).dialog({ title: SolrQuery.fieldMap(solrField),
																      modal: true,
																      minHeight: 280,
																      minWidth: 392,
																      closeText: 'Close',
																      beforeClose: function(event, ui) {
					
					this.$parent = $(this);
						
					var fieldObjects = $(this).find('#islandora-dss-solr-facet-pages-facets-form').serializeArray().filter(function (fieldObj) {

						return fieldObj.name != 'form_build_id' && fieldObj.name != 'form_id' && fieldObj.name != 'form_token';
					    });

					var that = this;

					/*
					if(fieldObjects.length == 0) {

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
					*/

					$('html.js body.html div.ui-dialog div.ui-dialog-titlebar a.ui-dialog-titlebar-close span.ui-icon').click(function(e) {

					    });

					if( $(event.target).hasClass('ui-icon-closethick') && fieldObjects.length > 0) {

					    
					    $('<div class="islandora-facet-modal-alert">You have unapplied refinements.</div>').appendTo($('body')).dialog({
						    
						    title: 'Warning',
							modal: true,
							resizable: false,
							height: 140,
							buttons: {

							Apply: function() {
							    
							    $( this ).dialog( "close" );
							    $('#islandora-dss-solr-facet-pages-facets-form .form-submit').click();
							    $( that ).dialog( "close" );
							},
							Discard: function() {
							    
							    $( this ).dialog( "close" );
							    $('.fancy-box-container').dialog('destroy');
							    $( that ).dialog( "close" );
							}
						    },

						    open: function(event) {

							//$(this).find('.ui-dialog .ui-dialog-titlebar .ui-dialog-titlebar-close').remove();
							$(this).prev('.ui-dialog-titlebar').children('.ui-dialog-titlebar-close.ui-corner-all').remove();
						    }
						});

					    //return fieldObjects.length > 0;
					    //return fieldObjects.length == 0;
					    return false;
					} else {

					    return true;
					}
				    }
				}).load('/islandora/facets/' + solrField, facetParams, function() {

					$(this).removeClass('loading');
					that.facetFormHandler();
				    });
			});
		    
		    //$('.main-container').empty().addClass('loading');
		});
	    //});
	};

	this.facetModalHandler();

	this.dateSliderResetHandler = function() {

	    $('.islandora-solr-date-reset').unbind('click').click(function(e) {

		    e.stopImmediatePropagation();
		    e.preventDefault();

		    var $dateSlider = $($(this).attr('data-target'));
		    $dateSlider.slider('values', [ $dateSlider.slider('option', 'min'), $dateSlider.slider('option', 'max') ]).children('.ui-slider-handle').removeClass('date-slider-handle-refined');

		    //that.dateSliderStop();

		    var url = $(document).data('islandoraDssDateRangeSlider')['query'];

		    /**
		     * Work-around for DSSSM-737
		     * @todo Refactor
		     *
		     */
		    if(!/browse/.exec(url)) {

			url = '/' + url;
		    }

		    var facetParams = {};

		    if($dateSlider.prev().prev().length == 0) {

			var dateField = SolrQuery.fieldMap($(e.target).parent().text().replace(/×/, ''));
		    } else {

			var dateField = SolrQuery.fieldMap( $dateSlider.prev().prev().text() );
		    }
		    var facetQueries = $(document).data('islandoraDssDateRangeFacetQueries') || {};
		    delete facetQueries[dateField];
		    $(document).data('islandoraDssDateRangeFacetQueries', facetQueries);

		    facetParams = SolrQuery.getQueries(facetQueries);

		    /*
		    var facetIndex = 0;
		    for(key in facetQueries) {

			for(k in facetQueries[key]) {

			    var facetKey = 'f[' + facetIndex + ']';
			    //facetParams[ facetKey ] = key + ":" + facetQueries[key][k];
			    facetParams[ facetKey ] = key + ":" + facetQueries[key][k].replace('%26', '&').replace('%2F', '/');
			    facetIndex++;
			}
		    }
		    */


		    $(document).data('islandoraDssDateRangeFacetParams', facetParams);

		    var params = $(document).data('islandoraDssSolrResultsViewParams') || {};
		    /**
		     * @todo Refactor
		     * This resolves DSSSM-664
		     *
		     */
		    for(var f in params) {

			if((new RegExp(dateField)).exec(params[f])) {

			    delete params[f];
			}
		    }

		    params = $.extend(params, facetParams);

		    /**
		     * Resolves DSSSM-666
		     *
		     */
		    var sortParams = $(document).data('islandoraDssSolrResultsSortParams') || {};
		    params = $.extend(params, sortParams);

		    /**
		     * Resolves pagination issues
		     * @todo Refactor
		     *
		     */
		    delete params['page']; 
		    url = url.replace(/page=\d+&/, '');

		    /**
		     * Resolves DSSSM-664
		     * @todo Refactor
		     *
		     */
		    var _params = params;
		    // Please see the following resource: http://nelsonwells.net/2011/10/swap-object-key-and-values-in-javascript
		    var invert = function(obj) {

			var new_obj = {};

			for(var prop in obj) {

			    if(obj.hasOwnProperty(prop) && typeof(new_obj[obj[prop]]) == 'undefined') {
				
				new_obj[obj[prop]] = prop;
			    }
			}

			return new_obj;
		    };
		    params = invert(invert(_params));
		    $(document).data('islandoraDssDateRangeFacetParams', params);
		    //$(document).data('islandoraDssSolrResultsViewParams', params);

		    /**
		     * Resolves DSSSM-725
		     * @todo Refactor
		     */
		    if(/\/browse/.exec(url)) {

			url = '/islandora/search/*:*';
		    }

		    $.get(url, params, that.updatePage);
		    $('.main-container').empty().addClass('loading');
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

		    /**
		     * Ensure that the date range values are updated for every AJAX response parsed
		     * Resolves DSS-180
		     *
		     */

		    minMax[dateField] = {};
		    minMax[dateField]['min'] = +new Date($facetListItems.first().children('a').text());
		    //minMax[dateField]['min'] = +new Date($facetListItems.first().children('a').text()) - (new Date($facetListItems.first().children('a').text())).getTimezoneOffset();

		    // If there is only one facet value for the range, create a second by incrementing 10 years
		    /**
		     * If there is only one facet value for the range, prepend and append 10 years
		     *
		     */
		    if($facetListItems.length == 1) {

			minDate = new Date(minMax[dateField]['min']);
			minDate.setUTCFullYear( minDate.getUTCFullYear() - 10 );
			minMax[dateField]['min'] = +minDate;
			
			var maxDate = new Date($facetListItems.first().children('a').text());
			maxDate.setUTCFullYear( maxDate.getUTCFullYear() + 10 );
			
			minMax[dateField]['max'] = +maxDate;
		    } else {

			minMax[dateField]['max'] = +new Date( $facetListItems.last().children('a').text());
		    }
		    
		    /**
		     * Ensure that the date range values are updated for every AJAX response parsed
		     * Resolves DSS-180
		     *
		     */

		    $(document).data('islandoraDssDateRangeInitValues', minMax);

		    //var minDate = +new Date( $facetListItems.first().children('a').text());
		    //var maxDate = +new Date( $facetListItems.first().children('a').text());
		    //minMax[dateField]['min'] = +new Date($facetListItems.first().children('a').text()) - (new Date($facetListItems.first().children('a').text())).getTimezoneOffset();
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

			//min: (minDate / 10000000000) + 400,
			//max: (maxDate / 10000000000) + 400,
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
			    url = '/' + url;

			    var maxFacet = $(document).data('islandoraDssDateRangeSlider')['maxFacet'] + 1;

			    /**
			     * Resolves DSSSM-725
			     * Handling for the path alias
			     *
			     */

			    var menuArgs, menuArgsMatch;
			    try {

				if(/\/browse\/?/.exec(url)) {
				
				    menuArgsMatch = /\/browse\/?(.+)/.exec(document.URL);
				} else if(/islandora\/search\/(.+)/.exec(url)) { // Parse the URL for the argument to the Drupal Menu Item /islandora/search/%query

				    //var menuArgs = /islandora\/search\/(.+)/.exec(url)[1];
				    menuArgsMatch = /islandora\/search\/(.+)/.exec(url);
				} else {
				    
				    throw "Could not parse the Solr query from the URL " + url;
				}
			    } catch(e) {

				console.error(e);
			    }

			    if(menuArgsMatch) {

				menuArgs = menuArgsMatch[1];
			    }

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

			    // Bug: Resolve this
			    delete facetQueries[undefined];

			    if(ui.values[0] <= minDate && ui.values[1] >= maxDate) {

				delete facetQueries[dateField];
			    } else {

				//facetQueries[dateField] = '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']';
				facetQueries[dateField] = facetQueries[dateField] || [];
				//facetQueries[dateField] = facetQueries[dateField].concat('[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']');

				/**
				 * Work-around
				 * @todo Address this issue
				 *
				 */
				if(typeof(facetQueries[dateField][0]) === 'number') {

				    facetQueries[dateField] = facetQueries[dateField].slice(1);
				}
				facetQueries[dateField][0] = '[' + new Date(ui.values[0]).toISOString() + ' TO ' + new Date(ui.values[1]).toISOString() + ']';
			    }

			    $(document).data('islandoraDssDateRangeFacetQueries', facetQueries);

			    facetParams = SolrQuery.getQueries(facetQueries);

			    /*
			    facetParams = {};

			    var i = 0;
			    for(key in facetQueries) {

				for(k in facetQueries[key]) {

				    var facetKey = 'f[' + i + ']';
				    //facetParams[ facetKey ] = key + ":" + facetQueries[key][k];
				    facetParams[ facetKey ] = key + ":" + facetQueries[key][k].replace('%26', '&').replace('%2F', '/');
				    i++;
				}
				//i++;
			    }
			    */

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

			    var params = $(document).data('islandoraDssSolrResultsViewParams') || {};
			    params = $.extend(params, facetParams);

			    /**
			     * Resolves DSSSM-666
			     *
			     */
			    var sortParams = $(document).data('islandoraDssSolrResultsSortParams') || {};
			    params = $.extend(params, sortParams);

			    /**
			     * Resolves pagination issues
			     * @todo Refactor
			     *
			     */
			    delete params['page'];
			    url = url.replace(/page=\d+&/, '');

			    /**
			     * Resolves DSSSM-725
			     *
			     */
			    if(/\/browse/.exec(url)) {
			    
				url = '/islandora/search/*:*';
			    }
			    
			    $.get(url, params, that.updatePage);

			    $('.main-container').empty().addClass('loading');
			    $('.snap-trigger').toggleClass('shown').children('img').toggleClass('shown');
			    //$(document).data('islandoraDssDateRangeSlider', $.extend($(document).data('islandoraDssDateRangeSlider'), {query: query, maxFacet: maxFacet} ));
			},

			create: function(event) {

			    $handles = $(this).children('.ui-slider-handle');
			    $($handles[0]).addClass('ui-slider-left');
			    $($handles[1]).addClass('ui-slider-right');
			    
			    //$($handles[0]).css('left', '-5%');
			    //$($handles[0]).css('right', 'inherit');

			    /*
			    $($handles[1]).css('left', 'inherit');
			    $($handles[1]).css('right', '0%');
			    */
			    //$($handles[1]).css('left', '104%');
			    //$($handles[1]).css('right', '0%');
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

		    /**
		     * Work-around
		     * @todo Refactor this
		     *
		     */
		    var defaultValues = false;

		    if(typeof( facetQueries[solrFieldName] ) !== 'undefined' && typeof( facetQueries[solrFieldName][0] ) === 'string' ) {

			// Work-around
			// There can only ever be one element within an array of values for Date fields
			var minValue = +new Date(facetQueries[solrFieldName][0].split(' TO ')[0].slice(1));

			var maxValue = +new Date(facetQueries[solrFieldName][0].split(' TO ')[1].slice(0, -1));
			options['values'] = [minValue, maxValue];
		    } else if(typeof(_facets[solrFieldName]) !== 'undefined') { // Populate from the facet queries first...

			options['values'] = _facets[solrFieldName];
		    } else if(typeof(_query[solrFieldName]) !== 'undefined') {

			options['values'] = _query[solrFieldName];
		    } else {

			defaultValues = true;
			options['values'] = [ options['min'], options['max'] ];
		    }

		    /**
		     * No ranged faceting when only a single facet is available
		     * Resolves DSSSM-370
		     * @todo This should be more properly resolved by ensuring that facet.mincount is properly set within the request transmitted to Solr
		     *
		     */
		    if($facetListItems.length > 1) {

			$dateTerm.text( moment(options['values'][1]).format("MMM. DD YYYY"));
			$dateInit.text( moment(options['values'][0]).format("MMM. DD YYYY"));

			if(!defaultValues) {

			    $dateSlider.slider(options).children('.ui-slider-handle').addClass('date-slider-handle-refined');
			} else {

			    $dateSlider.slider(options);
			}
		    } else {

			$facetList.prev().hide();
		    }

		    $facetList.children('li').hide();
		});
		
	};
	this.facetDateHandler();

	this.facetLinkHandler = function(e, element) {

	    e.stopImmediatePropagation();
	    e.preventDefault();

	    var facetedSearchAnchor = element || $(this);

	    var facets = facetedSearchAnchor.attr('href').split(/f\[\d\]/);

	    /*
	    $(document).data('islandoraDssDateRangeSlider', {

		        query: /(\/islandora\/search\/.+)/.exec( facetedSearchAnchor.attr('href') )[1],
			maxFacet: (facets.length == 1 ? 0 : facets.length - 2),
			});
	    */

	    //var url = facetedSearchAnchor.attr('href');
	    var url = $(document).data('islandoraDssDateRangeSlider')['query'];

	    /**
	     * Work-around for issue
	     * Resolves DSSSM-718
	     *
	     */
	    if(!/collections\/browse\/?/.exec(url)) {

		// Cannot locate the source of this bug
		url = '/' + url;
	    }

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

	    var fieldName = SolrQuery.fieldMap(facetedSearchAnchor.parent().parent().prev().text());

	    if(!facetedSearchAnchor.hasClass('islandora-solr-facet-token')) {

		if(typeof(facetQueries[fieldName]) === 'undefined') {

		    facetQueries[fieldName] = ['"' + facetedSearchAnchor.text() + '"'];
		} else {

		    facetQueries[fieldName] = facetQueries[fieldName].concat(['"' + facetedSearchAnchor.text() + '"']);
		}
	    }

	    /**
	     * Work-around for removing improperly serialized facets
	     * @todo Properly address within other scripts
	     *
	     */
	    var i = 0;
	    for(key in facetQueries) {

		for(k in facetQueries[key]) {

		    var facetKey = 'f[' + i + ']';
		    var resultsViewParams = $(document).data('islandoraDssSolrResultsViewParams');

		    if(resultsViewParams) {

			delete resultsViewParams[facetKey];
			$(document).data('islandoraDssSolrResultsViewParams', resultsViewParams);
		    }

		    var dateRangeParams = $(document).data('islandoraDssDateRangeFacetParams');

		    if(dateRangeParams) {

			delete dateRangeParams[facetKey];
			$(document).data('islandoraDssDateRangeFacetParams', dateRangeParams);
		    }

		    var sortParams = $(document).data('islandoraDssSolrResultsSortParams');
		    if(sortParams) {

			delete sortParams[facetKey];
			$(document).data('islandoraDssSolrResultsSortParams', sortParams);
		    }

		    i++;
		}
	    }

	    // Update the active facet queries
	    // Refactor for efficiency
	    for(var fieldName in facetQueries) {

		if(facetQueries[fieldName].filter(function(fieldValue) {

			    //return e == facetedSearchAnchor.text() || facetQueries[fieldName] == '"' + facetedSearchAnchor.text() + '"';

			    //return fieldValue == $(facetedSearchAnchor).contents().first().text() || fieldValue == '"' + $(facetedSearchAnchor).contents().first().text() + '"';

			    /**
			     * Resolves DSSSM-533
			     * @todo Refactor
			     *
			     */
			    //return fieldValue == $(facetedSearchAnchor).contents().last().text() || fieldValue == '"' + $(facetedSearchAnchor).contents().last().text() + '"';

			    var facetElementContent = $(facetedSearchAnchor).contents().last().text().replace('&', '%26').replace('/', '%2F');
			    var rawFacetElementContent = $(facetedSearchAnchor).contents().last().text();
			    //return fieldValue == facetElementContent || fieldValue == '"' + facetElementContent + '"';
			    return fieldValue == facetElementContent || fieldValue == '"' + facetElementContent + '"' || fieldValue == rawFacetElementContent || fieldValue == '"' + rawFacetElementContent + '"';
			}).length > 0) {

		    if(facetedSearchAnchor.hasClass('islandora-solr-facet-token')) {

			// Filter from the array, do not delete
			//facetQueries[fieldName] = facetQueries[fieldName].slice(0, -1);
			facetQueries[fieldName] = facetQueries[fieldName].filter(function(fieldValue) {

				//return fieldValue != $(facetedSearchAnchor).contents().first().text() && fieldValue != '"' + $(facetedSearchAnchor).contents().first().text() + '"';

				/**
				 * Resolves DSSSM-533
				 * @todo Refactor
				 *
				 */
				//return fieldValue != $(facetedSearchAnchor).contents().last().text() && fieldValue != '"' + $(facetedSearchAnchor).contents().last().text() + '"';

				var facetElementContent = $(facetedSearchAnchor).contents().last().text().replace('&', '%26').replace('/', '%2F');
				var rawFacetElementContent = $(facetedSearchAnchor).contents().last().text();
				//return fieldValue != facetElementContent && fieldValue != '"' + facetElementContent + '"';
				return fieldValue != facetElementContent && fieldValue != '"' + facetElementContent + '"' && fieldValue != rawFacetElementContent && fieldValue != '"' + rawFacetElementContent + '"';
			    });
			if(facetQueries[fieldName].length == 0) {

			    var fieldValue = facetQueries[fieldName];
			    delete facetQueries[fieldName];
			}
		    }
		}
	    }

	    $(document).data('islandoraDssDateRangeFacetQueries', facetQueries);

	    facetParams = SolrQuery.getQueries(facetQueries);

	    /*

	    facetParams = {};
	    var i = 0;
	    for(key in facetQueries) {

		for(k in facetQueries[key]) {

		    var facetKey = 'f[' + i + ']';

		    /**
		     * For handling MARC relator issues
		     * @todo Remove after re-indexing
		     *
		     * /
		    //facetParams[ facetKey ] = key + ":" + facetQueries[key][k];
		    //facetParams[ facetKey ] = key + ":" + SolrQuery.marcRelatorFilter(facetQueries[key][k], key);
		    /**
		     * Resolves DSSSM-533
		     * @todo Refactor
		     *
		     * /
		    facetParams[ facetKey ] = key + ":" + SolrQuery.marcRelatorFilter(facetQueries[key][k], key).replace('%26', '&').replace('%2F', '/');

		    i++;
		}
	    }
	    */

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

	    // Please see the following resource: http://nelsonwells.net/2011/10/swap-object-key-and-values-in-javascript
	    var invert = function(obj) {

		var new_obj = {};

		for(var prop in obj) {

		    if(obj.hasOwnProperty(prop) && typeof(new_obj[obj[prop]]) == 'undefined') {

			new_obj[obj[prop]] = prop;
		    }
		}

		return new_obj;
	    };

	    var params = $(document).data('islandoraDssSolrResultsViewParams') || {};
	    params = $.extend(params, facetParams);

	    /**
	     * @todo Refactor
	     * Resolves DSSSM-666
	     *
	     */
	    var sortParams = $(document).data('islandoraDssSolrResultsSortParams') || {};
	    params = $.extend(params, sortParams);

	    if(facetedSearchAnchor.hasClass('islandora-solr-facet-token')) {

		/**
		 * Work-around
		 * @todo Refactor
		 * Remove duplicate facet values from the params Object
		 * This resolves DSSSM-664
		 *
		 */
		var _params = params;

		params = invert(invert(_params));

		/**
		 * Resolves pagination issues
		 * @todo Refactor
		 *
		 */
		delete params['page'];
		url = url.replace(/page=\d+&/, '');
		//$.get(facetedSearchAnchor.attr('href'), params, that.updatePage);

		$(document).data('islandoraDssDateRangeFacetParams', params);
		//$(document).data('islandoraDssSolrResultsViewParams', params);

		/**
		 * @todo Refactor
		 *
		 */
		url = facetedSearchAnchor.attr('href').split('?').shift().replace(/page=\d+&/, '');

		/**
		 * Resolves DSSSM-725
		 *
		 */
		if(/\/browse/.exec(url)) {
		    
		    url = '/islandora/search/*:*';
		}

		$.get(url, params, that.updatePage);
	    } else {

		params = $.extend(params, facetParams);

		/**
		 * Work-around
		 * @todo Refactor
		 * Remove duplicate facet values from the params Object
		 * This resolves DSSSM-664
		 *
		 */
		var _params = params;

		params = invert(invert(_params));

		/**
		 * Resolves pagination issues
		 * @todo Refactor
		 *
		 */
		delete params['page'];

		$(document).data('islandoraDssDateRangeFacetParams', params);
		//$(document).data('islandoraDssSolrResultsViewParams', params);

		url = url.replace(/page=\d+&/, '');

		/**
		 * Resolves DSSSM-725
		 * @todo Refactor
		 */
		if(/\/browse/.exec(url)) {

		    url = '/islandora/search/*:*';
		}

		$.get(url, params, that.updatePage);
	    }

	    $('.main-container').empty().addClass('loading');
	    $('.snap-trigger').toggleClass('shown').children('img').toggleClass('shown');
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
