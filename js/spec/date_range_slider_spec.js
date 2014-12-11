/**
 * Test suite for the date range slider functionality
 * @author griffinj@lafayette.edu
 *
 */

'use strict';

console.log(jasmine.getFixtures);
describe('SolrQuery', function() {

	describe('.getQuery', function() {

		it('Should parse for queries containing multiple values for multiple fields', function() {

			var url = 'http://localhost/islandora/search/testField1:testValue1 AND testField2:testValue2';
			expect(SolrQuery.getQuery(url, $)).toEqual({testField1: 'testValue1', testField2: 'testValue2'});

			var url2 = encodeURI(url);
			expect(SolrQuery.getQuery(url2, $)).toEqual({testField1: 'testValue1', testField2: 'testValue2'});
		    });
	    });

	describe('.getFacets', function() {

		it('Should parse for queries containing multiple facets', function() {

			var url = 'http://localhost/islandora/search/*:*?f[0]=testField1:"testValue1"&f[1]=testField2:"testValue2"&f[2]=testField3:"testValue3"';
			expect(SolrQuery.getFacets(url, $)).toEqual({ testField1: [ '"testValue1"' ], testField2: [ '"testValue2"' ], testField3: [ '"testValue3"' ] });

			var url2 = encodeURI(url);
			expect(SolrQuery.getFacets(url2, $)).toEqual({ testField1: [ '"testValue1"' ], testField2: [ '"testValue2"' ], testField3: [ '"testValue3"' ] });
		    });
	    });

	describe('.getQueries', function() {

		it('Should structure Solr facet parameters from facet queries', function() {

			var queries = { testField1: [ '"testValue1"' ], testField2: [ '"testValue2"' ], testField3: [ '"testValue3"' ] };

			expect(SolrQuery.getQueries(queries)).toEqual({ 'f[0]': 'testField1:"testValue1"', 'f[1]': 'testField2:"testValue2"', 'f[2]': 'testField3:"testValue3"' });
		    });
	    });

	it('Binds to tokenized facets', function() {

		//loadFixtures('eastasia_00.html');
		expect($('<div><span class="some-class"></span></div>')).toContainElement('span.some-class');
	    });
    });
