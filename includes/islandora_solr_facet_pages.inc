<?php

  /**
   * @File
   * Overrides and hook implementations for the islandora_solr_facet_pages Module
   * @author griffinj
   *
   */

  /**
   * Performs a solr query to get facets fields for the alphabetical pager.
   * @see _islandora_solr_facet_pages_letterer
   *
   * It makes use of facet queries.
   *
   * @param object $solr
   *   Apache_Solr_Service object to use for the facet query.
   * @param string $solr_field
   *   Solr field to use for the facet query.
   *
   * @return array
   *   Returns array containing facet_queries and a filter query map. Both arrays
   *   are used to theme the alphabetical pager. The fq_map contains an array
   *   which maps a filter query to a prefix. eg: solr_field:A* => A.
   *   Facet_queries are the solr results wich maps the filter query to the bucket
   *   size, eg: solr_field:A* => 1234
   */
function _islandora_dss_solr_facet_pages_letterer($solr, $solr_field) {

  $fq = array();
  $fq_map = array();

  switch($solr_field) {

  case 'eastasia.Subject.OCM':

    // For faceting digits
    foreach(range(0, 9) as $digit) {
      
      $value = "$solr_field:$digit*";
      $fq_map[$value] = $digit;
      $fq[] = $value;
    }
    break;

  case 'eastasia.Date.Artifact.Upper':
  case 'eastasia.Date.Artifact.Lower':
  case 'eastasia.Date.Image.Upper':
  case 'eastasia.Date.Image.Lower':

    // For faceting digits
    foreach(range(1850, 2010, 10) as $digit) {

      $value = "$solr_field:$digit*";
      $fq_map[$value] = $digit;
      $fq[] = $value;
    }
    break;

  default:

    foreach(range('A', 'Z') as $letter) {

      $value = "$solr_field:$letter*";
      $fq_map[$value] = $letter;
      $fq[] = $value;
    }
    break;
  }

  /*
    facet.date, facet.date.start, facet.date.end, and facet.date.gap p
  */
  switch($solr_field) {

  case 'eastasia.Date.Artifact.Upper':
  case 'eastasia.Date.Artifact.Lower':
  case 'eastasia.Date.Image.Upper':
  case 'eastasia.Date.Image.Lower':

    $params = array(
		    /*
		    'facet' => 'true',
		    'facet.field' => $solr_field,

		    'qt' => variable_get('islandora_solr_request_handler', 'standard'),
		    */
		    'facet' => 'true',
		    'facet.date' => $solr_field,
		    "facet.date.start" => '1850-01-01T00:00:00Z',
		    "facet.date.end" => 'NOW',
		    "facet.date.gap" => '+10YEAR',
		    /*
		    'facet.sort' => 'index',
		    'facet.mincount' => 1,
		    'facet.limit' => 0,
		    'facet.query' => $fq,
		    */
		    );
    break;

  default:

    // Set facet parameters.
    $params = array(
		    'facet' => 'true',
		    'facet.field' => $solr_field,
		    'facet.sort' => 'index',
		    'facet.mincount' => 1,
		    'facet.limit' => 0,
		    'facet.query' => $fq,
		    'qt' => variable_get('islandora_solr_request_handler', 'standard'),
		    );
    break;
  }

  // Set query.
  $query = "$solr_field:[* TO *]";
  // Solr results in JSON format.
  $result_object = json_decode($solr->search($query, 0, 0, $params)->getRawResponse());

  switch($solr_field) {

  case 'eastasia.Date.Artifact.Upper':
  case 'eastasia.Date.Artifact.Lower':
  case 'eastasia.Date.Image.Upper':
  case 'eastasia.Date.Image.Lower':
    
    $facet_queries = array();

    // Facet queries.
    $_facet_queries = $result_object->facet_counts->facet_dates->$solr_field;

    unset($_facet_queries->gap);
    unset($_facet_queries->start);
    unset($_facet_queries->end);

    // refactor for Solr
    foreach((array) $_facet_queries as $facet_query => $count) {
    
      $m = preg_match('/^(\d{4})/', $facet_query, $matches);
      $facet_queries["$solr_field:$matches[1]" . '*'] = $count;
    }

    $facet_queries = (object) $facet_queries;

    break;
    
  default:
    
    // Facet queries.
    $facet_queries = $result_object->facet_counts->facet_queries;
    break;
  }

  return array(
    'facet_queries' => $facet_queries,
    'fq_map' => $fq_map,
  );
}

/**
 * Performs a solr query to return facet_fields to populate the results page.
 *
 * @param object $solr
 *   Apache_Solr_Service object to use for the facet fields query.
 * @param string $solr_field
 *   Solr field to use for the facet fields query
 * @param string $prefix
 *   Prefix from the URL to add to add a prefix to the facet query. This will
 *   limit the returned fields with fields that are prefixed with this value.
 *
 * @return array
 *   Returns an array of all the facet field values and the bucket size: eg:
 *   solr value => 123
 */

/*
function __dss_eastasia_islandora_solr_facet_pages_results($solr, $solr_field, $prefix) {

  // Get the actual results.
  $query = "$solr_field:[* TO *]";

  // Set facet parameters.
  $facet_params = array(
    'facet' => 'true',
    'facet.field' => $solr_field,
    'facet.sort' => 'index',
    'facet.mincount' => 1,
    'facet.limit' => variable_get('islandora_solr_facet_pages_facet_limit', 100000),
    'qt' => variable_get('islandora_solr_request_handler', 'standard'),
  );

  // Set the facet prefix.
  if ($prefix != t('ALL')) {
    $facet_params['facet.prefix'] = $prefix;
  }

  // Solr results in JSON format.
  $result_object = json_decode($solr->search($query, 0, 0, $facet_params)->getRawResponse());

  $fields = (array) $result_object->facet_counts->facet_fields->$solr_field;

  return $fields;
}
*/

/**
 * Performs a solr query to return facet_fields to populate the results page.
 *
 * @author griffinj@lafayette.edu
 * @see _islandora_solr_facet_pages_results
 *
 * @param object $solr
 *   Apache_Solr_Service object to use for the facet fields query.
 * @param string $solr_field
 *   Solr field to use for the facet fields query
 * @param string $prefix
 *   Prefix from the URL to add to add a prefix to the facet query. This will
 *   limit the returned fields with fields that are prefixed with this value.
 *
 * @return array
 *   Returns an array of all the facet field values and the bucket size: eg:
 *   solr value => 123
 */
function _islandora_dss_solr_facet_pages_results($solr, $solr_field, $prefix, $query=NULL) {

  if(!isset($query)) {

    // Get the actual results.
    $query = "$solr_field:[* TO *]";
  }

  /*
  // For nested faceting...
  $facet_params = array();

  foreach($child_facets as $child_facet) {

    $facet_params[] = array('facet' => 'true',
			    'facet.field' => $child_facet,
			    'facet.sort' => 'index',
			    'facet.mincount' => 1,
			    'facet.limit' => variable_get('islandora_solr_facet_pages_facet_limit', 100000),
			    'qt' => variable_get('islandora_solr_request_handler', 'standard'),
			    );
  }
  */

  switch($solr_field) {

  case 'eastasia.Date.Artifact.Upper':
  case 'eastasia.Date.Artifact.Lower':
  case 'eastasia.Date.Image.Upper':
  case 'eastasia.Date.Image.Lower':
  case 'geology_slides_esi.date.original':
  case 'dc.date.sort':

    /*
      $prefix .= '-01-01';

    $facet_params = array('facet' => 'true',
			  'facet.sort' => 'index',
			  'facet.mincount' => 1,
			  'facet.limit' => variable_get('islandora_solr_facet_pages_facet_limit', 100000),
			  'qt' => variable_get('islandora_solr_request_handler', 'standard'),
			  'facet.date' => $solr_field,
			  "facet.date.start" => $prefix == 'ALL' ? '1900-01-01T00:00:00Z' : gmdate('Y-m-d\TH:i:s\Z', strtotime($prefix)),
			  "facet.date.end" => $prefix == 'ALL' ? 'NOW' : gmdate('Y-m-d\TH:i:s\Z', strtotime($prefix + 10)),
			  "facet.date.gap" => '+1YEAR',
			  );
    */

    // http://crete0.dev.lafayette.edu:8080/solr/fedora_5/select/?q=geology_slides_esi.date.original+%3A[*+TO+*]&version=2.2&start=0&rows=0&indent=on&facet=true&facet.date=geology_slides_esi.date.original&facet.date.start=1976-03-06T23:59:59.999Z/YEAR&facet.date.end=NOW&facet.date.gap=%2B1YEAR

    // Set facet parameters.
    $facet_params = array('facet' => 'true',
			  'facet.field' => $solr_field,
			  'facet.sort' => 'count',
			  'facet.mincount' => 1,
			  'facet.limit' => variable_get('islandora_solr_facet_pages_facet_limit', 100000),
			  'qt' => variable_get('islandora_solr_request_handler', 'standard'),
			  //'facet.date' => $solr_field,
			  //'facet.date.start' => '1826-01-01T00:00:00Z/YEAR',
			  //'facet.date.end' => 'NOW',
			  //'facet.date.gap' => '+1YEAR',
			  //'facet.query' => $filter_queries
			  );

    // Set the facet prefix.
  /*
    if ($prefix != 'ALL' && $prefix != 'all') {
      
      $facet_params['facet.prefix'] = $prefix;
    }
  */

    break;

  default:
    //$filter_queries = preg_split('/ AND /', $query);
    $filter_queries = $query;

    // Set facet parameters.
    $facet_params = array('facet' => 'true',
			  'facet.field' => $solr_field,
			  'facet.sort' => 'count',
			  'facet.mincount' => 1,
			  'facet.limit' => variable_get('islandora_solr_facet_pages_facet_limit', 100000),
			  'qt' => variable_get('islandora_solr_request_handler', 'standard'),
			  'facet.query' => $filter_queries
			  );

    // Set the facet prefix.
    if ($prefix != 'ALL' && $prefix != 'all') {
      
      $facet_params['facet.prefix'] = $prefix;
    }
  }

  // Hard-code default sorting
  // Refactoring
  //$facet_params = array_merge($facet_params, array('sort' => 'dc.title asc'));

  // Ensure that sorting is preserved on facet anchors
  /*
  if(!array_key_exists('sort', $_GET)) {

    //$facet_params['sort'] = $_GET['sort'];
    $facet_params['sort'] = 'dc.title asc';
  }
  */

  // Solr results in JSON format.
  $result_object = json_decode($solr->search($query, 0, 0, $facet_params)->getRawResponse());
  //$result_object = json_decode($solr->search("$solr_field:[* TO *]", 0, 0, $facet_params)->getRawResponse());
  //$result_object = json_decode($solr->search("*:*", 0, 0, $facet_params)->getRawResponse());

  $fields = (array) $result_object->facet_counts->facet_fields->$solr_field;

  switch($solr_field) {

  case 'eastasia.Date.Artifact.Upper':
  case 'eastasia.Date.Artifact.Lower':
  case 'eastasia.Date.Image.Upper':
  case 'eastasia.Date.Image.Lower':
  case 'geology_slides_esi.date.original':
  case 'dc.date.sort':

    if($prefix != 'ALL' && $prefix != 'all') {
      
      $min_prefix = $prefix . '-01-01';
      $min = strtotime($min_prefix);

      $max_prefix = (string) ((int) $prefix + 10);
      $max_prefix .= '-01-01';
      $max = strtotime($max_prefix);
      
      $_fields = array();
      foreach($fields as $facet => $value) {

	if(strtotime($facet) > $min && strtotime($facet) < $max) {

	  $_fields[$facet] = $value;
	}
      }

      $fields = $_fields;
    }

    break;
  }

  return $fields;
}

/**
 * Page callback function.
 * @see islandora_solr_facet_pages_callback
 *
 * @param string $path
 *   Machine readable name passed in the url to decide what solr field to facet
 *   on.
 * @param string $prefix
 *   Letter of the alphabet to filter on.
 *
 * @return string
 *   Rendered page including letter pager, numerical pager and search results.
 */
function islandora_dss_solr_facet_pages_callback($path = NULL, $prefix = NULL) {

  // Get available fields from variable.
  $fields = variable_get('islandora_solr_facet_pages_fields_data', array());

  // Callback validation.
  foreach ($fields as $key => $value) {

    if ($path == $value['path']) {

      // Set variables.
      $solr_field = $value['solr_field'];
      drupal_set_title($value['label']);
    }
  }

  // Set default prefix.
  if ($prefix == NULL) {

    $prefix = t('ALL');
  }

  // Include base CSS file.
  $base_css = drupal_get_path('module', 'islandora_solr_facet_pages') . '/css/islandora_solr_facet_pages.base.css';
  drupal_add_css($base_css);

  // Use Solr faceting to get list of names.
  $parsed_url = parse_url(variable_get('islandora_solr_url', 'http://localhost:8080/solr'));
  $solr = new Apache_Solr_Service($parsed_url['host'], $parsed_url['port'], $parsed_url['path']);

  // Render letters.
  //$letterer_arr = _dss_eastasia_islandora_solr_facet_pages_letterer($solr, $solr_field);
  $letterer_arr = _islandora_dss_solr_facet_pages_letterer($solr, $solr_field);

  $letterer = theme('islandora_solr_facet_pages_letterer', array(
    'facet_queries' => $letterer_arr['facet_queries'],
    'fq_map' => $letterer_arr['fq_map'],
    'prefix' => $prefix,
    'path' => $path,
  ));

  // Collect results.
  $result_fields = _islandora_dss_solr_facet_pages_results($solr, $solr_field, $prefix);
  // Collect results with lowercase.
  $prefix_lower = strtolower($prefix);
  $result_fields_lower = _islandora_dss_solr_facet_pages_results($solr, $solr_field, $prefix_lower);
  // Merge uppercase with lowercase.
  $result_fields = array_merge($result_fields, $result_fields_lower);

  switch($solr_field) {

  case 'eastasia.Date.Artifact.Upper':
  case 'eastasia.Date.Artifact.Lower':
  case 'eastasia.Date.Image.Upper':
  case 'eastasia.Date.Image.Lower':
  case 'geology_slides_esi.date.original':
  case 'dc.date.sort':

    $_result_fields = array();

    foreach($result_fields as $result_field => $value) {

      $_result_fields[gmdate('Y-m-d', strtotime($result_field))] = $value;
    }

    $result_fields = $_result_fields;
    break;
  }

  // Set up pager.
  $pager_data = _islandora_solr_facet_pages_pager($result_fields);
  $offset = $pager_data['offset'];
  $limit = $pager_data['limit'];

  // Slice array.
  $results = array_slice($result_fields, $offset, $limit);

  $results = theme('islandora_solr_facet_pages_results', array('results' => $results,
							       'solr_field' => $solr_field,
							       'path' => $path,
							       ));

  // Render pager.
  $pager = theme('pager', array(
    'element' => 0,
    'quantity' => 5,
  ));

  return theme('islandora_solr_facet_pages_wrapper', array('letterer' => $letterer,
							   'results' => $results,
							   'pager' => $pager,
							   'path' => $path,
							   'pager_data' => $pager_data,
							   ));
}

