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
  } else {

    $SOLR_INDEXED_FIELDS = array('eastasia.Title.Japanese' => 'Title.Japanese', // Resolve with re-indexing (DSSSM-614 )
				 'eastasia.Title.Chinese' => 'Title.Chinese', // DSSSM-614
				 'eastasia.Title.Korean' => 'Title.Korean', // DSSSM-614
				 "eastasia.Contributors.Digital" => 'Contributor',
				 "eastasia.Contributor.Donor" => 'Contributor.Donor',
				 "eastasia.Coverage.Location" => 'Coverage.Location',
				 "eastasia.Coverage.Location.Country" => 'Coverage.Location.Country',
				 "eastasia.Creator.Company" => 'Creator.Company',
				 "eastasia.Creator.Maker" => 'Creator.Maker',

				 "eastasia.Description.Ethnicity" => 'Description.Ethnicity',
				 "eastasia.Description.Indicia" => 'Description.Indicia',

				 "eastasia.Format.Medium" => 'Format.Medium',
				 "eastasia.Subject.OCM" => 'Subject.OCM',

				 "cdm.Relation.IsPartOf" => 'Relation.IsPartOf',

				 'dc.description' => 'Description',
				 'dc.type' => 'Medium',

				 'mdl_prints.creator' => 'creator',

				 'mdl_prints.description' => 'description',
				 'mdl_prints.description.condition' => 'description.condition',
				 'mdl_prints.description.note' => 'description.note',
				 'mdl_prints.description.provenance' => 'description.provenance',
				 'mdl_prints.description.series' => 'description.series',
				 'mdl_prints.format.digital' => 'format.digital',
				 'mdl_prints.format.extent' => 'format.extent',
				 'mdl_prints.format.medium' => 'format.medium',
				 'mdl_prints.identifier.itemnumber' => 'identifier.item.number',
				 'mdl_prints.publisher.digital' => 'publisher.digital',
				 'mdl_prints.publisher.original' => 'publisher.original',

				 'mdl_prints.rights.digital' => 'rights.digital',
				 'mdl_prints.publisher.digital' => 'source',
				 'mdl_prints.subject.lcsh' => 'subject.lcsh',

				 'geology_slides_esi.coverage.location' => 'Coverage',
				 'geology_slides_esi.description' => 'Description',

				 'geology_slides_esi.relation.seealso.book' => 'Related Book',
				 'geology_slides_esi.relation.seealso.image' => 'Related Image',
				 'geology_slides_esi.subject' => 'Subject',
				 'geology_slides_esi.description.vantagepoint' => 'Vantage Point',

				 'mckelvy.creator.maker' => 'Creator',
				 'mckelvy.description.size' => 'Dimensions',
				 'mckelvy.format.medium' => 'Medium',
				 'mckelvy.description.note' => 'Note',

				 'war_casualties.description.cause.death' => 'Cause of Death',
				 'war_casualties.description.class' => 'Graduating Class',
				 'war_casualties.description.military.branch' => 'Military Branch',
				 'war_casualties.description.honors' => 'Military Honors',
				 'war_casualties.description.military.rank' => 'Military Rank',
				 'war_casualties.contributor.military.unit' => 'Military Unit',
				 'war_casualties.coverage.place.birth' => 'Place of Birth',
				 'war_casualties.coverage.place.death' => 'Place of Death',

				 'MODS.mods.titleInfo.title_ss' => 'Title',
				 'MODS.mods.titleInfo.subTitle_s' => 'Subtitle',
				 'MODS.mods.titleInfo.partNumber_s' => 'Part Of',
				 'MODS.mods.name.displayForm_s' => 'Author',
				 'MODS.mods.originInfo.publisher_s' => 'Publisher',
				 'MODS.mods.relatedItem.titleInfo.title_s' => 'Series'
				 );

    foreach($SOLR_INDEXED_FIELDS as $field => $label) {

      // Work-around implemented for DSS-422
      if(preg_match('/' . $field . '\:\("(.+?)"\)/', $query, $query_match)) {

	$escaped_field_query = '(' . $query_match[1] . ')';
	$query = preg_replace('/' . $field . '\:\("(.+?)"\)/', "$field:$escaped_field_query", $query);
      }

      $query = str_replace($field, 'c_' . $field, $query);

      // Work-around implemented for
      //
      if(preg_match("/c_c_$field/", $query)) {

	$query = str_replace('c_c_' . $field, 'c_' . $field, $query);
	//$query = str_replace($field, 'c_' . $field, $query);
      }
    }
  }

  // Special cases for newspapers
  // cdm.Relation.IsPartOf:"Lafayette Newspaper Collection"

  if( preg_match('/cdm.Relation.IsPartOf:"(.+?)"/', $query, $query_collection_match) ) {

    $query_collection = $query_collection_match[1];

    if($query_collection == 'Lafayette Newspaper Collection' and $solr_field == 'dc.date.sort') {

      // Set facet parameters.
      $facet_params = array('facet' => 'true',
			    'facet.field' => $solr_field,
			    'facet.sort' => 'count',
			    'facet.mincount' => 1,
			    'facet.limit' => variable_get('islandora_solr_facet_pages_facet_limit', 100000),
			    'qt' => variable_get('islandora_solr_request_handler', 'standard'),
			    'facet.date' => $solr_field,
			    /*
			      'facet.date.start' => '1870-01-01T00:00:00Z/YEAR',
			      'facet.date.end' => 'NOW+1YEAR/YEAR',
			      'facet.date.gap' => '+1YEAR',
			    */
			    'facet.date.start' => '1870-01-01T00:00:00Z/MONTH',
			    'facet.date.end' => 'NOW+1MONTH/MONTH',
			    'facet.date.gap' => '+1MONTH',
			    //'facet.query' => $filter_queries
			    );

    } elseif($query_collection == 'Geology Department Slide Collection' and $solr_field == 'geology_slides_esi.date.original') {

      // Set facet parameters.
      $facet_params = array('facet' => 'true',
			    'facet.field' => $solr_field,
			    'facet.sort' => 'count',
			    'facet.mincount' => 1,
			    'facet.limit' => variable_get('islandora_solr_facet_pages_facet_limit', 100000),
			    'qt' => variable_get('islandora_solr_request_handler', 'standard'),
			    'facet.date' => $solr_field,
			    /*
			      'facet.date.start' => '1870-01-01T00:00:00Z/YEAR',
			      'facet.date.end' => 'NOW+1YEAR/YEAR',
			      'facet.date.gap' => '+1YEAR',
			    */
			    'facet.date.start' => '1870-01-01T00:00:00Z/YEAR',
			    'facet.date.end' => 'NOW+1YEAR/YEAR',
			    'facet.date.gap' => '+1YEAR',
			    //'facet.query' => $filter_queries
			    );

    } else {

      switch($solr_field) {

      case 'eastasia.Date.Artifact.Upper':
      case 'eastasia.Date.Artifact.Lower':
      case 'eastasia.Date.Image.Upper':
      case 'eastasia.Date.Image.Lower':
      case 'geology_slides_esi.date.original':
      case 'dc.date.sort':
      case 'MODS.mods.relatedItem.date.w3cdtf_dts':

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
    }
  }

  if(!isset($facet_params)) {

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

  //print_r($result_object);
  //exit(1);

  if(isset($query_collection) and $query_collection == 'Lafayette Newspaper Collection' and $solr_field == 'dc.date.sort') {

    $fields = (array) $result_object->facet_counts->facet_dates->$solr_field;
    unset($fields['gap']);
    unset($fields['start']);
    unset($fields['end']);
  } elseif($solr_field == 'war_casualties.description.class') {

    /**
     * Odd work-around; Uncertain as to how this behavior occurred (PHP core update?)
     * Resolves DSSSM-751
     *
     */
    $fields = array();
    foreach($result_object->facet_counts->facet_fields->$solr_field as $facet => $count) {

      $fields[$facet] = $count;
    }
  } else {

    $fields = (array) $result_object->facet_counts->facet_fields->$solr_field;
  }

  switch($solr_field) {

  case 'eastasia.Date.Artifact.Upper':
  case 'eastasia.Date.Artifact.Lower':
  case 'eastasia.Date.Image.Upper':
  case 'eastasia.Date.Image.Lower':
  case 'geology_slides_esi.date.original':
  case 'dc.date.sort':
  case 'MODS.mods.relatedItem.date.w3cdtf_dts':

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

  /**
   * For removing "----" and "_empty_" values created by the DC XSLT upon the updating of datastream content
   *
   */
  $_fields = array();
  foreach($fields as $facet => $value) {

    if(!in_array($facet, array('----', '_empty_'))) {

      //continue;
      $_fields[$facet] = $value;
    }
  }

  $fields = $_fields;

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

  /**
   * Odd work-around; Uncertain as to how this behavior occurred (PHP core update?)
   * Resolves DSSSM-751
   *
   */
  if($solr_field == 'war_casualties.description.class') {

    $_result_fields = array();

    foreach(array($result_fields, $result_fields_lower) as $result_field_subset) {

      foreach($result_field_subset as $facet => $count) {

	$_result_fields[$facet] = $count;
      }
    }

    $result_fields = $_result_fields;
  } else {

    // Merge uppercase with lowercase.
    $result_fields = array_merge($result_fields, $result_fields_lower);
  }

  switch($solr_field) {

  case 'eastasia.Date.Artifact.Upper':
  case 'eastasia.Date.Artifact.Lower':
  case 'eastasia.Date.Image.Upper':
  case 'eastasia.Date.Image.Lower':
  case 'geology_slides_esi.date.original':
  case 'dc.date.sort':
  case 'MODS.mods.relatedItem.date.w3cdtf_dts':

    $_result_fields = array();

    foreach($result_fields as $result_field => $value) {

      $_result_fields[gmdate('Y-m-d', strtotime($result_field))] = $value;
    }

    $result_fields = $_result_fields;
    break;
  }

  /**
   * For removing "----" and "_empty_" values created by the DC XSLT upon the updating of datastream content
   *
   */
  $_result_fields = array();
  foreach($result_fields as $result_field => $value) {

    if(!in_array($result, array('----', '_empty_'))) {

      $_result_fields[$result] = $value;
    }
  }
  $result_fields = $_result_fields;
  $results = $result_fields;

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

