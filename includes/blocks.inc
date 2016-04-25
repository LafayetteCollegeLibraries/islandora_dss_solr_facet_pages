<?php

  /**
   * @file
   * Block functionality for the module
   * @author griffinj@lafayette.edu
   *
   */

  /**
   * Callback for results fields
   *
   */
function islandora_dss_solr_facet_pages_result_fields() {

  $result_fields = array(
    'dc.title' => 'Title.English',
    'eastasia.Subject.OCM' => 'Subject.OCM',
    'eastasia.Contributors.Digital' => 'Contributors.Digital',
    'eastasia.Coverage.Location' => 'Coverage.Location',
    'eastasia.Coverage.Location.Country' => 'Coverage.Location.Country',
    'eastasia.Format.Medium' => 'Format.Medium',
    'eastasia.Date.Artifact.Lower' => 'Date.Artifact.Lower',
    'eastasia.Date.Artifact.Upper' => 'Date.Artifact.Upper',
    'eastasia.Date.Image.Lower' => 'Date.Image.Lower',
    'eastasia.Date.Image.Upper' => 'Date.Image.Upper',
    'dc.contributor' => 'dc.contributor',
    'dc.coverage' => 'dc.coverage',
    'dc.date' => 'dc.date',
    'dc.description' => 'dc.description',
    'dc.format' => 'dc.format',
    'dc.identifier' => 'dc.identifier',
    'dc.language' => 'dc.language',
    'dc.publisher' => 'dc.publisher',
    'dc.rights' => 'dc.rights',
    'dc.source' => 'dc.source',
    'dc.subject' => 'dc.subject',
    'dc.type' => 'dc.type',
    'mdl_prints.subject.lcsh' => 'Subject.LCSH',
    'mdl_prints.format.medium' => 'Format.Medium',
    'mdl_prints.format.extent' => 'Format.Extent',
    'mdl_prints.description' => 'Description',
    'mdl_prints.description.provenance' => 'Description.Provenance',
    'mdl_prints.description.series' => 'Description.Series',
    'mdl_prints.identifier.itemnumber' => 'Identifier.ItemNumber',
    'geology_slides.coverage.location.country' => 'coverage.location.country',
    'geology_slides.coverage.location.state' => 'coverage.location.state',
    'geology_slides.description.geologic.feature' => 'description.geologic.feature',
    'geology_slides.description.critical' => 'description.critical',
    'geology_slides_esi.subject' => 'Subject',
    'geology_slides_esi.description.vantagepoint' => 'Vantage Point',
    'geology_slides_esi.date.original' => 'Publication Date',
    'mdl_prints.rights.digital' => 'Rights.Digital',
    'mdl_prints.publisher.digital' => 'Publisher.Digital',
    'mdl_prints.format.digital' => 'Format.Digital',
    'cdm.Relation.IsPartOf' => 'Relation.IsPartOf',
    'eastasia.Creator.Maker' => 'Creator.Maker',
    'eastasia.Description.Indicia' => 'Description.Indicia',
    'eastasia.Description.Ethnicity' => 'Description.Ethnicity',
    'war_casualties.description.class' => 'Graduating Class',
    'war_casualties.description.military.branch' => 'Branch',
    'war_casualties.contributor.military.unit' => 'Military Unit',
    'mckelvy.description.note' => 'Note',
    'mckelvy.date.original.display' => 'Publication Date',
    'mckelvy.source' => 'Source',
    'mdl_prints.creator' => 'Creator',
    'mdl_prints.publisher.original' => 'Publisher.Original',
    'war_casualties.description.military.rank' => 'Rank',
    'war_casualties.coverage.place.birth' => 'Place of Birth',
    'war_casualties.coverage.place.death' => 'Place of Death',
    'war_casualties.description.cause.death' => 'Cause of Death',
    'war_casualties.description.honors' => 'Honors',
    'dc.date.sort' => 'Date',
    'mdl_prints.date.original' => 'Date.Original',
    'MODS.mods.relatedItem.titleInfo.title_s' => 'Title',
    'MODS.mods.relatedItem.date.w3cdtf_dts' => 'Date',
    'MODS.mods.originInfo.publisher_s' => 'Publisher',
    'MODS.mods.titleInfo_s' => 'Title',
    'MODS.mods.relatedItem.part.date.approximate_s' => 'Date',
    'MODS.mods.relatedItem.originInfo.dateIssued.approximate_s' => 'Date',
    'MODS.mods.relatedItem.part.text.volume_s' => 'Volume',
    'MODS.mods.relatedItem.part.text.issue_s' => 'Issue',
    'MODS.mods.originInfo.dateIssued.w3cdtf_dt' => 'Publication Date',
			 );

  $result_fields = variable_get('islandora_dss_solr_facet_pages_result_fields', $result_fields);

  return $result_fields;

  }

  /**
   * Callback for collection namespaces
   *
   */
function islandora_dss_solr_facet_pages_collection_namespace($collection) {
  $namespace = 'dc';

  $query_field_namespace_map = array('East Asia Image Collection' => 'eastasia',
				     'Japanese Imperial House Postcard Album' => 'eastasia',
				     'T.W. Ingersoll Co. Stereoviews of the Siege of Port Arthur' => 'eastasia',
				     'Imperial Postcard Collection' => 'eastasia',
				     'Tsubokura Russo-Japanese War Postcard Album' => 'eastasia',
				     'Sino-Japanese War Postcard Album 01' => 'eastasia',
				     'Sino-Japanese War Postcard Album 02' => 'eastasia',
				     'Lin Chia-Feng Family Postcard Collection' => 'eastasia',
				     'Japanese History Study Cards' => 'eastasia',
				     'Pacific War Postcard Collection' => 'eastasia',
				     'Michael Lewis Taiwan Postcard Collection' => 'eastasia',
				     'Gerald & Rella Warner Taiwan Postcard Collection' => 'eastasia',
				     'Gerald & Rella Warner Dutch East Indies Negative Collection' => 'eastasia',
				     'Gerald & Rella Warner Manchuria Negative Collection' => 'eastasia',
				     'Gerald & Rella Warner Taiwan Negative Collection' => 'eastasia',
				     'Gerald & Rella Warner Japan Slide Collection' => 'eastasia',
				     'Gerald & Rella Warner Souvenirs of Beijing and Tokyo' => 'eastasia',
				     'Truku-Japanese War Commemorative Postcard Collection' => 'eastasia',

				     'Marquis de Lafayette Prints Collection' => 'mdl_prints',
				     'Geology Department Slide Collection' => 'geology_slides_esi',
				     'McKelvy House Photograph Collection' => 'mckelvy',
				     'Lafayette World War II Casualties' => 'war_casualties',

				     'Lafayette Newspaper Collection' => 'newspaper',
				     'Historical Photograph Collection' => 'historical',
				     
				     'Lafayette Magazine Collection' => 'magazine',

				     'Shakespeare Bulletin Archive' => 'shakespeare'
				     );

  if(array_key_exists($collection, $query_field_namespace_map)) {

    $namespace = $query_field_namespace_map[$collection];
  }

  return $namespace;

  }

/**
 * Callback for returning the faceted fields for a given collection
 *
 */
function islandora_dss_solr_facet_pages_collection_fields_faceted($namespace) {

  $collection_fields_faceted = array(
				     'eastasia' => array(
							 array(
							       'solr_field' => 'eastasia.Subject.OCM',
							       'label' =>  'Subject.OCM',
							       'path' => 'eastasia-subject',
							       ),
							 array(
							       'solr_field' => 'eastasia.Coverage.Location.Country',
							       'label' =>  'Coverage.Location.Country',
							       'path' => 'eastasia-country',
							       ),
							 array(
							       'solr_field' => 'eastasia.Coverage.Location',
							       'label' =>  'Coverage.Location',
							       'path' => 'eastasia-location',
							       ),
							 array(
							       'solr_field' => 'eastasia.Format.Medium',
							       'label' =>  'Format.Medium',
							       'path' => 'eastasia-format',
							       ),
							 array(
							       'solr_field' => 'cdm.Relation.IsPartOf',
							       'label' =>  'Relation.IsPartOf',
							       'path' => 'collections',
							       ),
							 array(
							       'solr_field' => 'eastasia.Date.Artifact.Upper',
							       'label' =>  'Date.Artifact.Upper',
							       'path' => 'eastasia-artifact-upper',
							       ),
							 array(
							       'solr_field' => 'eastasia.Date.Artifact.Lower',
							       'label' =>  'Date.Artifact.Lower',
							       'path' => 'eastasia-artifact-lower',
							       ),
							 array(
							       'solr_field' => 'eastasia.Date.Image.Upper',
							       'label' =>  'Date.Image.Upper',
							       'path' => 'eastasia-image-upper',
							       ),
							 array(
							       'solr_field' => 'eastasia.Date.Image.Lower',
							       'label' =>  'Date.Image.Lower',
							       'path' => 'eastasia-image-lower',
							       ),
							 array(
							       'solr_field' => 'eastasia.Creator.Maker',
							       'label' =>  'Creator.Maker',
							       'path' => 'eastasia-maker',
							       ),
							 array(
							       'solr_field' => 'eastasia.Creator.Company',
							       'label' =>  'Creator.Company',
							       'path' => 'eastasia-company',
							       ),
							 array(
							       'solr_field' => 'eastasia.Description.Ethnicity',
							       'label' =>  'Description.Ethnicity',
							       'path' => 'eastasia-ethnicity',
							       ),
							 ),
				     'mdl_prints' => array(
							   array('solr_field' => 'mdl_prints.subject.lcsh',
								 'label' =>  'Subject.LCSH',
								 'path' => 'mdl-prints-subject',
								 ),
							   array(
								 'solr_field' => 'mdl_prints.format.medium',
								 'label' =>  'Format.Medium',
								 'path' => 'mdl-prints-format',
								 ),
							   array(
								 'solr_field' => 'mdl_prints.description.series',
								 'label' =>  'Description.Series',
								 'path' => 'mdl-description-series',
								 ),
							   array(
								 'solr_field' => 'mdl_prints.creator',
								 'label' =>  'Creator',
								 'path' => 'mdl-creator',
								 ),
							   array(
								 'solr_field' => 'mdl_prints.date.original',
								 'label' =>  'Date.Original',
								 'path' => 'mdl-date-original',
								 ),
							   ),
				     'newspaper' => array(
							  array(
								'solr_field' => 'dc.subject',
								'label' =>  'Series',
								'path' => 'subjects',
								),

							  array(
								'solr_field' => 'dc.date.sort',
								'label' =>  'Date',
								'path' => 'dates',
								),
							  ),
				     'historical' => array(
							   array('solr_field' => 'dc.subject',
								 'label' =>  'Subject',
								 'path' => 'subjects',
								 ),
							   array(
								 'solr_field' => 'dc.type',
								 'label' =>  'Medium',
								 'path' => 'media',
								 ),
							   array(
								 'solr_field' => 'dc.date.sort',
								 'label' =>  'Publication Date',
								 'path' => 'dates',
								 ),
							   ),
				     'geology_slides_esi' => array(
								   array(
									 'solr_field' => 'geology_slides_esi.subject',
									 'label' =>  'Subject',
									 'path' => 'geology-slides-esi-subject',
									 ),
								   array(
									 'solr_field' => 'geology_slides_esi.coverage.location',
									 'label' =>  'Coverage.Location',
									 'path' => 'geology-slides-esi-coverage-location',
									 ),
								   array(
									 'solr_field' => 'geology_slides_esi.date.original',
									 'label' =>  'Publication Date',
									 'path' => 'geology-slides-esi-date-original',
									 ),
								   ),
				     'mckelvy' => array(
							array('solr_field' => 'dc.subject',
							      'label' =>  'Subject',
							      'path' => 'subjects',
							      ),
							array(
							      'solr_field' => 'dc.type',
							      'label' =>  'Medium',
							      'path' => 'media',
							      ),
							array(
							      'solr_field' => 'mckelvy.date.original.display',
							      'label' =>  'Date.Original',
							      'path' => 'mckelvy-date-original',
							      ),
							),
				     'war_casualties' => array(
							       array(
								     'solr_field' => 'war_casualties.description.class',
								     'label' =>  'Description.Class',
								     'path' => 'war-casualties-description-class',
								     ),
							       array(
								     'solr_field' => 'war_casualties.description.honors',
								     'label' =>  'Description.Honors',
								     'path' => 'war-casualties-description-honors',
								     ),
							       array(
								     'solr_field' => 'war_casualties.description.military.branch',
								     'label' =>  'Description.Military.Branch',
								     'path' => 'war-casualties-description-military-branch',
								     ),
							       array(
								     'solr_field' => 'war_casualties.contributor.military.unit',
								     'label' =>  'Military Unit',
								     'path' => 'war-casualties-description-military-unit',
								     ),
							       ),
				     'magazine' => array(
							 array('solr_field' => 'MODS.mods.relatedItem.titleInfo.title_s',
							       'label' => 'Title',
							       'path' => ''
							       ),
							 array('solr_field' => 'MODS.mods.relatedItem.date.w3cdtf_dts',
							       'label' => 'Date',
							       'path' => ''
							       ),
							 array('solr_field' => 'MODS.mods.originInfo.publisher_s',
							       'label' => 'Publisher',
							       'path' => ''
							       ),
							 ),
				     'shakespeare' => array(
							    array('solr_field' => 'MODS.mods.relatedItem.titleInfo.title_s',
								  'label' => 'Title',
								  'path' => ''
								  ),
							    array('solr_field' => 'MODS.mods.originInfo.dateIssued.w3cdtf_dt',
								  'label' => 'Date',
								  'path' => ''
								  ),
							    array('solr_field' => 'MODS.mods.originInfo.publisher_s',
								  'label' => 'Publisher',
								  'path' => ''
								  ),
							    ),
				     'ldr' => array(
						    array(
							  'solr_field' => 'ldr.dc.contributor.author',
							  'label' =>  'dc.contributor.author',
							  'path' => 'ldr-contributor-author',
							  ),
						    array(
							  'solr_field' => 'ldr.dc.date.accessioned',
							  'label' =>  'dc.date.accessioned',
							  'path' => 'ldr-date-accessioned',
							  ),
						    ),
				     
				     /*
				     array(
					   'solr_field' => 'dc.publisher',
					   'label' =>  'Publisher',
					   'path' => 'publishers',
					   ),
				     
				     array(
					   'solr_field' => 'MODS.mods.relatedItem.part.text.volume_s',
					   'label' =>  'Volume',
					   'path' => 'mods-relateditem-part-volume'
					   ),
				     */
				     );
  
  $collection_fields_faceted = variable_get('islandora_dss_solr_facet_pages_collection_fields_faceted', $collection_fields_faceted);

  $fields = $collection_fields_faceted[$namespace];

  return $fields;
}

/**
 * Callback for retrieving the namespace for a given faceted query
 *
 */
function islandora_dss_solr_facet_pages_namespace($filter) {

  $query_field_namespace = NULL;

  if(preg_match('/cdm\.Relation\.IsPartOf:(.+)/', $filter, $m)) {

    $query_field_namespace = $m[1];
    if(preg_match('/"(.+?)"/', $query_field_namespace, $m)) {

      $query_field_namespace = $m[1];
    }

    $query_field_namespace = islandora_dss_solr_facet_pages_collection_namespace($query_field_namespace);

  } elseif(preg_match('/cdm\.Relation\.IsPartOf:(.+)/', $query_field, $m)) {

    $query_field_namespace = $m[1];
  } elseif(preg_match('/(.+?)\./', $query_field, $m) or preg_match('/(.+?)\./', $filter, $m)) {

    $query_field_namespace = $m[1];
  }

  return $query_field_namespace;
}

/**
 * Implements HOOK_dss_solr_fields().
 * Retrieves the faceted Solr fields for a given field being queried during a faceted search
 *
 */
function islandora_dss_solr_facet_pages_dss_solr_fields($query_field, $filters) {

  $filter = '';
  if(!empty($filters)) {

    $filter = $filters[0];
  }

  $fields = array();
  $_fields = variable_get('islandora_solr_facet_pages_fields_data', array());

  $query_field_namespace = islandora_dss_solr_facet_pages_namespace($filter);

  if(!is_null($query_field_namespace)) {

    $fields = islandora_dss_solr_facet_pages_collection_fields_faceted($query_field_namespace);

    if(empty($fields)) {

      foreach($_fields as $field) {

	if(in_array($field['solr_field'], $included_fields) or (preg_match("/$query_field_namespace\./", $field['solr_field'], $m) and !in_array($field['solr_field'], $excluded_fields))) {

	  if($query_field_namespace == 'historical' and $field['solr_field'] == 'dc.date.sort') {

	    $field['label'] = 'Publication Date';
	  }

	  $fields[] = $field;
	}
      }

      switch($query_field_namespace) {

      case 'mckelvy':

	$sort = function($u, $v) {
	  
	  $ISLANDORA_DSS_SOLR_FACET_PAGES_FIELDS_SORT = array('mckelvy.date.original.display' => 2,
							      'dc.subject' => 0,
							      'dc.type' => 1,
							      );

	  return ($ISLANDORA_DSS_SOLR_FACET_PAGES_FIELDS_SORT[$u['solr_field']] < $ISLANDORA_DSS_SOLR_FACET_PAGES_FIELDS_SORT[$v['solr_field']]) ? -1 : 1;
	};
	uasort($fields, $sort);
	break;

      case 'historical':

	$sort = function($u, $v) {
	  
	  $ISLANDORA_DSS_SOLR_FACET_PAGES_FIELDS_SORT = array('dc.date.sort' => 2,
							      'dc.subject' => 0,
							      'dc.type' => 1,
							      );

	  return ($ISLANDORA_DSS_SOLR_FACET_PAGES_FIELDS_SORT[$u['solr_field']] < $ISLANDORA_DSS_SOLR_FACET_PAGES_FIELDS_SORT[$v['solr_field']]) ? -1 : 1;
	};
	uasort($fields, $sort);
	break;
      }
    }
  } else {

    /**
     * For facets global to the repository, only render cdm.Relation.IsPartOf facets
     * Resolves DSSSM-682
     *
     */
    $fields = array(array('solr_field' => 'cdm.Relation.IsPartOf',
			  'label' => 'Relation.IsPartOf',
			  'path' => 'collections'
			  ));
  }

  return $fields;
}

/**
 * Work-around for MARC relator values in fields
 * @todo Remove after reindexing has completed
 *
 */
function _islandora_dss_solr_facet_pages_marc_relator_filter($field_value, $field_name) {

  return $field_value;
}

/**
 * Callback for the current Solr query
 *
 */
function islandora_dss_solr_facet_pages_solr_query() {

  $islandora_solr_query = NULL;

  if(preg_match('/islandora\/search\/(.+)?(\/|#)?/', current_path(), $m)) {
    
    $islandora_solr_query = $m[1];
  }

  return $islandora_solr_query;
}

/**
 * Callback for determining whether or not a user is "browsing"
 *
 */
function islandora_dss_solr_facet_pages_browsing_path() {

  // Retrieve the current path
  $path = current_path();
  $browsing_path = NULL;

  if(preg_match('/browse\/(.+)/', $path, $m) || preg_match('/islandora\/search\/(.+)/', $path, $m)) {
    
    $browsing_path = $m[1];
  }

  return $browsing_path;
}

/**
 * Callback for retrieving the ordering of facets (based upon the bucket size)
 *
 */
function islandora_dss_solr_facet_pages_sorted_desc($collections, $field) {

  $sorted_desc = FALSE;

  $sorted_desc_fields = array('Shakespeare Bulletin Archive' => array('MODS.mods.relatedItem.titleInfo.title_s',
								      'MODS.mods.originInfo.publisher_s'));
  $sorted_desc_fields = variable_get('islandora_dss_solr_facet_pages_sorted_desc_fields', $sorted_desc_fields);

  // @todo Refactor into a map..reduce
  foreach($collections as $collection) {

    if(array_key_exists($collection, $sorted_desc_fields) and in_array($field, $sorted_desc_fields[$collection])) {

      $sorted_desc = TRUE;
    }
  }
  
  return $sorted_desc;
}

/**
 * Callback for retrieving the ordreing of facets (based upon the facet itself)
 *
 */
function islandora_dss_solr_facet_pages_sorted_facet_desc($collections, $field) {

  $sorted_facet_desc = FALSE;

  $sorted_facet_desc_fields = array('Lafayette Magazine Collection' => array('MODS.mods.originInfo.publisher_s',
									     'MODS.mods.relatedItem.titleInfo.title_s',
									     'MODS.mods.relatedItem.part.detail.volume.number_i'));
  $sorted_facet_desc_fields = variable_get('islandora_dss_solr_facet_pages_sorted_facet_desc_fields', $sorted_facet_desc_fields);

  // @todo Refactor into a map..reduce
  foreach($collections as $collection) {

    if(array_key_exists($collection, $sorted_facet_desc_fields) and in_array($field, $sorted_facet_desc_fields[$collection])) {

      $sorted_facet_desc = TRUE;
    }
  }
  
  return $sorted_facet_desc;
}

/**
 * Utility function for cleaning URL parameters
 * @todo Deduplicate for islandora_dss_solr_parameters_clean().
 *
 */
function islandora_dss_solr_facet_pages_parameters_clean($params) {

  // Search for percent-encoded characters
  $cleaned_params = $params;

  foreach($params as $param => $param_values) {

    if( is_array($param_values) ) {

      $cleaned_param_values = array();

      foreach($param_values as $param_value) {

	/*
	// Clean the parameter value
	if(preg_match('/%.{2}/', $param_value)) {
	  $cleaned_params[$param] = preg_replace('/%.{2}/', '');
	}

	// Clean the parameter names
	if(preg_match('/%.{2}/', $param)) {
	  $cleaned_param = preg_replace('/%.{2}/', $param);
	  $cleaned_params[$cleaned_param] = $cleaned_param[$param];
	  unset($cleaned_params[$param]);
	}
	*/

	if(preg_match('/%.{2}/', $param_value)) {
	  //$cleaned_param_values[] = preg_replace('/%.{2}/', '', $param_value);
	  $cleaned_param_values[] = urldecode($param_value);
	} else {
	  $cleaned_param_values[] = $param_value;
	}
      }

      // Clean the parameter names
      if(preg_match('/%.{2}/', $param)) {
	//$cleaned_param = preg_replace('/%.{2}/', '', $param);
	$cleaned_param = urldecode($param);
	$cleaned_params[$cleaned_param] = $cleaned_param_values;
      } else {
	$cleaned_params[$param] = $cleaned_param_values;
      }

    } else {
      $param_value = $param_values;

      // Clean the parameter value
      if(preg_match('/%.{2}/', $param_value)) {
	//$cleaned_params[$param] = preg_replace('/%.{2}/', '', $param_value);
	$cleaned_params[$param] = urldecode($param_value);
      }

      // Clean the parameter names
      if(preg_match('/%.{2}/', $param)) {
	//$cleaned_param = preg_replace('/%.{2}/', '', $param);
	$cleaned_param = urldecode($param);
	$cleaned_params[$cleaned_param] = $cleaned_param[$param];
	unset($cleaned_params[$param]);
      }
    }
  }

  $params = $cleaned_params;
  return $params;
}

/**
 * @author griffinj@lafayette
 * Returns the top Solr facets for any given field
 * (Implemented in a manner similar to the ContentDM 4 advanced search feature)
 *
 * @see islandora_solr_facet_pages_callback
 *
 */
function _islandora_dss_solr_facet_pages_block_callback() {

  /**
   * Work-around for resolving issues related to MARC terms
   *
   * This resolves DSS-167
   * This resolves DSS-170
   */
  $ISLANDORA_MARC_METADB_MAP = array('eastasia.Format.Medium' => array("photonegative" => 'Photographic negative',
								       "slide" => 'Photographic slide',
								       )
				     );

  // Retrieve the current path
  $path = current_path();

  // Explicitly set the prefix for all facets
  $prefix = t('ALL');

  // The collections for the search
  $collections = array();

  // If the user agent is currently browsing a facet, render the filtered results...
  $browsing_path = islandora_dss_solr_facet_pages_browsing_path();
  if(!is_null($browsing_path)) {

    $path = $browsing_path;

    // Attempt to clean parameters within the path
    $path = urldecode($path);

    $query_params = drupal_get_query_parameters();
    $query_params = islandora_dss_solr_facet_pages_parameters_clean($query_params);

    $filters = array();
    $filtered_facets = array();
    $islandora_solr_query = islandora_dss_solr_facet_pages_solr_query();

    if(array_key_exists('f', $query_params)) {

      foreach($query_params['f'] as $filtered_facet) {

	$filters = $query_params['f'];

	if(preg_match('/(.+?)\:"(.+)"/', $filtered_facet, $matches)) {
	  
	  $filtered_field = $matches[1];
	  $filtered_facet = $matches[2];
	  $filtered_facets[] = $filtered_facet;

	  // Append the collection
	  if($filtered_field == 'cdm.Relation.IsPartOf') {

	    $collections[] = $filtered_facet;
	  }
	}
      }
    }

    /**
     * For resolving issues related to pagination
     *
     */
    if(array_key_exists('page', $query_params)) {

      $page = $query_params['page'];
    }

    // Get available fields from variable.
    //$fields = variable_get('islandora_solr_facet_pages_fields_data', array());
    $fields = module_invoke_all('dss_solr_fields', $path, $filters);

    /**
     * Work-around
     * Resolves DSSSM-780
     * @todo Refactor
     */
    if(empty($filtered_facets)) {
      
      $fields = array(array('solr_field' => 'cdm.Relation.IsPartOf',
			    'label' => 'Relation.IsPartOf',
			    'path' => 'collections'));
    }

    $items = array();

    //foreach($solr_fields as $solr_field) {
    foreach($fields as $key => $value) {

      $solr_field = $value['solr_field'];

      // Use Solr faceting to get list of names.
      $parsed_url = parse_url(variable_get('islandora_solr_url', 'http://localhost:8080/solr'));

      $solr = new Apache_Solr_Service($parsed_url['host'], $parsed_url['port'], $parsed_url['path']);

      /**
       * Resolves issues related to full-text searches
       *
       */
      $islandora_solr_facet_query = !is_null($islandora_solr_query) ? $islandora_solr_query : "$solr_field:[* TO *]";
      $SOLR_INDEXED_FIELDS = array(
				   //'dc.title',
				   'eastasia.Title.Japanese',
				   'eastasia.Title.Chinese',
				   'eastasia.Title.Korean',
				   'eastasia.Subject.OCM',
				   'eastasia.Description.Critical',
				   'eastasia.Description.Caption.English',
				   'eastasia.Description.Caption.Japanese',
				   'eastasia.Description.Indicia',
				   'eastasia.Coverage.Location',
				   'eastasia.Coverage.Location.Country',
				   'eastasia.Description.Ethnicity',
				   'eastasia.Contributors.Digital',
				   'cdm.Relation.IsPartOf',
				   'eastasia.Description.Citation',
				   'eastasia.Format.Medium',
				   'eastasia.Creator.Company',
				   'eastasia.Creator.Maker',
				   'eastasia.Format.Extent',
				   'eastasia.Contributor.Donor',

				   'MODS.mods.titleInfo.title_ss',
				   'MODS.mods.titleInfo.subTitle_s',
				   'MODS.mods.titleInfo.partNumber_s',
				   'MODS.mods.name.displayForm_s',
				   'MODS.mods.relatedItem.date.w3cdtf_dts',
				   'MODS.mods.relatedItem.part.date.approximate_s',

				   'MODS.mods.originInfo.publisher_s',
				   'MODS.mods.relatedItem.titleInfo.title_s',
				   'foxml.all.text'
				   );

      foreach($SOLR_INDEXED_FIELDS as $solr_indexed_field) { // For Solr-indexed fields with specific Analyzers (i. e. not optimized for tokenization of contents)

	/**
	 * This resolves DSSSM-709
	 * Work-around
	 * @todo Refactor
	 *
	 */
	if(!preg_match("/c_$solr_indexed_field/", $islandora_solr_facet_query)) {

	  $islandora_solr_facet_query = str_replace($solr_indexed_field, 'c_' . $solr_indexed_field, $islandora_solr_facet_query);
	}

	/**
	 * Work-around
	 * This resolves DSSSM-728
	 *
	 */
	if(preg_match("/$solr_indexed_field:\(\"(.+?)\"\)/", $islandora_solr_facet_query, $query_m) or preg_match("/c_$solr_indexed_field:\(\"(.+?)\"\)/", $islandora_solr_facet_query, $query_m)) {

	  $term = $query_m[1];
	  $widened_query = '*' . $term . '*';
	
	  $islandora_solr_facet_query = preg_replace("/$solr_indexed_field:\(.+?\)/", "$solr_indexed_field:($widened_query)", $islandora_solr_facet_query);
	}
      }

      // Handling for unfaceted searches
      $filter_queries = NULL;

      if(!empty($filters)) {

	$islandora_solr_facet_query = implode(' AND ', array_merge(array($islandora_solr_facet_query), $filters));
	//$filter_queries = implode(' AND ', $filters);
	$filter_queries = $filters;
      }

      /**
       * Ensures that queries are properly structured for Solr indexing issues
       * @todo Properly resolve by reindexing for c_dc.title, c_dc.description, and c_dc.type (with the appropriate analyzer)
       *
       */
      $SOLR_UNINDEXED_FIELDS = array('dc.title', 'dc.description', 'dc.type', 'dc.contributor');
      foreach($SOLR_UNINDEXED_FIELDS as $solr_unindexed_field) {

	if(preg_match("/$solr_unindexed_field/", $islandora_solr_facet_query)) {

	  if(preg_match("/$solr_unindexed_field:\(\*(.+?)\*\)/", $islandora_solr_facet_query, $query_m)) {

	    $widened_query = '*' . strtolower($query_m) . '* OR *' . mb_convert_case($query_m, MB_CASE_TITLE, "UTF-8")  . '* OR *' . strtoupper($query_m) . '*';

	    $islandora_solr_facet_query = preg_replace("/$solr_unindexed_field:\(.+?\)/", "$solr_unindexed_field:($widened_query)", $islandora_solr_facet_query);
	  } elseif(preg_match("/$solr_unindexed_field:\(\"(.+?)\"\)/", $islandora_solr_facet_query, $query_m)) {

	    $term = $query_m[1];
	    $widened_query = '*' . strtolower($term) . '* OR *' . mb_convert_case($term, MB_CASE_TITLE, "UTF-8")  . '* OR *' . strtoupper($term) . '*';

	    $islandora_solr_facet_query = preg_replace("/$solr_unindexed_field:\(.+?\)/", "$solr_unindexed_field:($widened_query)", $islandora_solr_facet_query);
	  }
	}
      }

      /**
       * Handling for Lucene metacharacters
       * Resolving DSSSM-775
       * @todo Refactor
       *
       */
      $ISLANDORA_DSS_SOLR_LUCENE_METACHARS = array('/', ':', '?', '&');
      foreach($ISLANDORA_DSS_SOLR_LUCENE_METACHARS as $metachar) {

	$islandora_solr_facet_query = str_replace(urlencode($metachar), $metachar, $islandora_solr_facet_query);
      }

      // Collect results.
      $result_fields = _islandora_dss_solr_facet_pages_results($solr, $solr_field, $prefix, $islandora_solr_facet_query, $filter_queries);

      // Collect results with lowercase.
      $prefix_lower = strtolower($prefix);
      $result_fields_lower = _islandora_dss_solr_facet_pages_results($solr, $solr_field, $prefix_lower, $islandora_solr_facet_query, $filter_queries);

      /**
       * Odd work-around; Uncertain as to how this behavior occurred (PHP core update?)
       * Resolves DSSSM-751
       *
       */
      if($solr_field == 'war_casualties.description.class' or
	 $solr_field == 'MODS.mods.relatedItem.part.detail.volume.number_i') {

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

      /**
       * Refine for anomalous cases (e. g. browsing the contents of the repository)
       * Resolves DSSSM-682
       *
       */
      $islandora_dss_solr_facet_pages_TOP_COLLECTIONS = array('East Asia Image Collection',
							      'Lafayette Newspaper Collection',
							      'Historical Photograph Collection',
							      'Marquis de Lafayette Prints Collection',
							      'Geology Department Slide Collection',
							      'McKelvy House Photograph Collection',
							      'Lafayette World War II Casualties',
							      'Lafayette Magazine Collection'
							      );

      $ISLANDORA_DSS_SOLR_FACET_PAGES_FIELD_LABELS = array('McKelvy House Photograph Collection' => array('mckelvy.date.original.display' => 'Publication Date',
													  'dc.type' => 'Medium',
													  'dc.subject' => 'Subject',
													  ),
							   'Geology Department Slide Collection' => array('geology_slides_esi.date.original' => 'Publication Date',
													  'geology_slides_esi.coverage.location' => 'Coverage'),
							   'Lafayette Newspaper Collection' => array('dc.date.sort' => 'Publication Date'),
							   'Lafayette World War II Casualties' => array('war_casualties.description.class' => 'Graduating Class',
													'war_casualties.description.honors' => 'Honors',
													'war_casualties.description.military.branch' => 'Military Branch',
													'war_casualties.description.military.rank' => 'Military Rank',
													'war_casualties.description.military.unit' => 'Military Unit'),
							   'Historical Photograph Collection' => array('mdl_prints.date.original' => 'Publication Date',
												       'dc.date.sort' => 'Publication Date'),
							   );


      if($islandora_solr_facet_query == '*:*'
	 or $islandora_solr_facet_query == '*: *'
	 or empty($filtered_facets)) {

	/**
	 * Modify the field label
	 * Resolves 
	 * @todo Refactor
	 *
	 */
	$value['label'] = 'Choose a Collection';

	$_result_fields = array();

	foreach($result_fields as $result_field_name => $result_field_count) {

	  if(in_array($result_field_name, $islandora_dss_solr_facet_pages_TOP_COLLECTIONS)) {

	    $_result_fields[$result_field_name] = $result_field_count;
	  }
	}

	$result_fields = $_result_fields;
      } else {
	
	/**
	 * This attempts to parse the collections from the search facets
	 *
	 * Terribly slow
	 * @todo refactor with preg_match
	 *
	 */
	foreach($ISLANDORA_DSS_SOLR_FACET_PAGES_FIELD_LABELS as $collection_key => $field_labels) {
	  
	  if(preg_match("/$collection_key/", $islandora_solr_facet_query)) { // Resolves DSSSM-756

	    if(array_key_exists($solr_field, $field_labels)) {
	      
	      $value['label'] = $field_labels[$solr_field];
	    }
	  }
	}
      }
      
      $child_items = array();
      $child_items_class = array('islandora-solr-facet-list');

      if(preg_match('/\.?[dD]ate\.?/', $solr_field)) {

	$child_items_class[] = 'islandora-solr-facet-date';
      }

      $child_items_id = preg_replace('/_|\./', '-', $solr_field);

      /**
       * Refines facets
       * Resolves DSSSM-731
       * @todo Refactor for performance (awful implementation)
       *
       */
      $filtered_result_fields = array();
      foreach($result_fields as $result => $count) {

	// Ensure that facets already applied to this search are not tokenized
	/**
	 * For removing "----" and "_empty_" values created by the DC XSLT upon the updating of datastream content
	 *
	 */
	if(!in_array($result, array('----', '_empty_')) and !in_array($result, $filtered_facets)) {

	  $filtered_result_fields[$result] = $count;
	}
      }
      $result_fields = $filtered_result_fields;

      /**
       * Iterate through the facets
       *
       */
      if(!empty($result_fields)) {

	// Add the field name itself
	// Terrible, refactor
	$items[] = "<div class='islandora-solr-facet'>{$value['label']}</div>";

	if(islandora_dss_solr_facet_pages_sorted_desc($collections, $solr_field)) {

	  // DSS-649
	  // Sort descending for certain facet values
	  arsort($result_fields);
	} elseif(islandora_dss_solr_facet_pages_sorted_facet_desc($collections, $solr_field)) {

	  /**
	   * Anomalous sorting for faceted values on certain fields (such as "Volume" for the "Alumni Publications" Collection)
	   * Resolves DSSSM-1081
	   * @todo Implement
	   *
	   */

	  // Sort ascending by the facet values
	  ksort($result_fields);
	} else {

	  // Sort by the most populated facets
	  arsort($result_fields);
	}
	
	// This resolves DSS-422
	$result_fields_count = count($result_fields);

	/**
	 * Odd work-around; Uncertain as to how this behavior occurred (PHP core update?)
	 * Resolves DSSSM-751
	 *
	 */
	if($solr_field == 'war_casualties.description.class' or
	   $solr_field == 'MODS.mods.relatedItem.part.detail.volume.number_i') {

	  $_result_fields = array();

	  $_keys = array_keys($result_fields);
	  $_keys_count = count($_keys);
	  for($i=0;$i < ($_keys_count < 5 ? $_keys_count : 5);$i++) {

	    $_result_fields[ $_keys[$i] ] = $result_fields[$_keys[$i]];
	  }

	  $result_fields = $_result_fields;

	  //} elseif ($islandora_solr_facet_query != '*:*' and !(preg_match('/Newspaper Collection/', $islandora_solr_facet_query) and $solr_field == 'dc.date.sort') ) {
	} elseif($islandora_solr_facet_query != '*:*' and !preg_match('/\.?[dD]ate\.?/', $solr_field)) { // Resolves DSSSM-753

	  /*
	   * Disables the restriction for all Newspaper Objects
	   * Resolves DSSSM-712
	   */

	  /**
	   * Disables the modal for browsing all repository content
	   * Resolves DSSSM-710
	   *
	   */

	  // Top 5 facets
	  $result_fields = array_slice($result_fields, 0, 5);
	}

	

	/**
	 * This will need to be refactored once (if) islandora_search is integrated with the Drupal Search API
	 *
	 */
	$islandora_solr_path = 'islandora/search/';
	if(!is_null($islandora_solr_query)) {

	  $islandora_solr_path .= $islandora_solr_query;
	} else {

	  $islandora_solr_path .= '*:*';
	}

	/**
	 * Iterate through the fields
	 *
	 */
	foreach($result_fields as $result => $count) {

	  $filter = array_merge($filters, array($solr_field . ':"' . addslashes($result) . '"'));
	  $query = array('f' => $filter);

	  $class = array('islandora-solr-facet');

	  /**
	   * Work-around for DSS-167
	   * Work-around for DSS-170
	   *
	   */
	  if(array_key_exists($solr_field, $ISLANDORA_MARC_METADB_MAP)) {

	    if(array_key_exists($result, $ISLANDORA_MARC_METADB_MAP[$solr_field])) {
	      
	      $result = $ISLANDORA_MARC_METADB_MAP[$solr_field][$result];
	    }
	  }

	  // For date values
	  if(preg_match('/Date\.?/', $value['label'])) {

	    $class[] = 'islandora-solr-facet-date';
	    
	    $child_items[] = l($result, $islandora_solr_path, array(
								    //'attributes' => array('id' => ),
								    'query' => $query)) . "&nbsp;<span class='bucket-size'>($count)</span>";
	  } else {

	    $child_items[] = l($result, $islandora_solr_path, array(
								    //'attributes' => array('class' => $class),
								    'query' => $query)) . "&nbsp;<span class='bucket-size'>($count)</span>";
	  }
	}

	/**
	 * Disables the modal for browsing all repository content
	 * Resolves DSSSM-710
	 *
	 */
	/**
	 * This must remain enabled for date fields
	 * Resolves DSSSM-716
	 */

	// This resolves DSS-422
	if(preg_match('/\.?[dD]ate\.?/', $value['label']) or ($result_fields_count > 5 and $islandora_solr_facet_query != '*:*')) {

	  $child_items[] = l('Show more...', "browse/{$value['path']}");
	}
      }

      if(!empty($child_items)) {

	$items[] = theme('item_list', array('items' => $child_items,
					    'type' => 'ul',
					    'attributes' => array('class' => $child_items_class,
								  'id' => $child_items_id
								  )));

      } elseif(!empty($items) and preg_match("/'islandora-solr-facet'/", $items[count($items) - 1]) and
	       !preg_match("/\.?[dD]ate\./", $items[count($items) - 1])) {
	
	/**
	 * Work-around for cases where empty lists are rendered
	 * Titles are generated for lists containing only facets which are filtered
	 * Resolves DSSSM-717
	 *
	 */
	unset($items[count($items) - 1]);
      }
    }
    $token_items = array();
    $date_slider_buttons = array();

    foreach($filters as $filter) {

      if(preg_match('/(.+\.?[dD]ate\.?.+?)\:/', $filter, $date_slider_match)) {

	$filter_split = explode(':', $filter);
	$solr_field = $filter_split[0];

	$child_items_id = preg_replace('/_|\./', '-', $solr_field);
	$date_reset_id = 'reset-' . $child_items_id;

	$result_fields = islandora_dss_solr_facet_pages_result_fields();

	/**
	 * Work-around for McKelvy
	 * Resolves DSSSM-737
	 *
	 */

	/**
	 * Resolves DSSSM-633
	 * @todo Scheduled for review on 08/27/14
	 * If closed, removed; if opened, refactored
	 *
	 */

	// Append the token element
	$token_items[] = l('<span class="close">×</span>' . t($result_fields[$solr_field]), '#',
			   array('attributes' => array('class' => array('islandora-solr-date-reset islandora-solr-facet-token'),
						       'data-target' => '#' . $child_items_id . ' + .islandora-solr-facet-date-slider'),
				 'fragment' => ' ',
				 'external' => TRUE,
				 'html' => TRUE));
	
      } else {

	$other_tokens = array();
	$facet_index = 0;

	// Filter
	foreach($filters as $other_filter) {

	  if($other_filter != $filter) {

	    $other_tokens["f[$facet_index]"] = $other_filter;
	    $facet_index++;
	  }
	}

	preg_match('/.+?\:(.+)/', $filter, $token_match);
	$token_value = $token_match[1];

	/**
	 * Work-around for MARC relator terms
	 * Resolve with re-indexing
	 *
	 */
	$filter_split = explode(':', $filter);
	$solr_field = $filter_split[0];

	$token_value = _islandora_dss_solr_facet_pages_marc_relator_filter($token_value, $solr_field);

	if(preg_match('/"(.+?)"/', $token_value, $token_value_match)) {

	  $token_value = $token_value_match[1];
	}
	
	$token_items[] = l('<span class="close">×</span>' . t($token_value), current_path(), array('attributes' => array('class' => array('islandora-solr-facet-token')),
													    'html' => TRUE,
													    'query' => $other_tokens));
      }
    }

    $token_list = theme('item_list', array('items' => $token_items,
					   'type' => 'ul',
					   'attributes' => array('class' => 'islandora-solr-facet-token-list',),
					   ));
      
    //$results = '<ul class="islandora-solr-facet-token-list"></ul>'. implode($items);
    $results = $token_list . render($date_slider_buttons) . implode($items);

    return $results;

  } else {

    // Get available fields from variable.
    $fields = variable_get('islandora_solr_facet_pages_fields_data', array());
  
    $items = array();
    foreach ($fields as $key => $value) {

      $items[] = l($value['label'], 'browse/' . $value['path'], array(
								      'attributes' => array(
											    'title' => $value['label'],
											    ),
								      ));
    }

    if(!empty($items)) {

      return theme('item_list', array(
				      'items' => $items,
				      'type' => 'ul',
				      'attributes' => array(
							    'class' => 'islandora-solr-facet-filter-list',
							    ),
				      ));
    } else {
      
      return FALSE;
    }
  }
}

/**
 * Implements hook_block_view().
 *
 */
function islandora_dss_solr_facet_pages_block_view_alter(&$data, $block) {

  switch ($block->delta) {
  case 'islandora-solr-facet-pages':

    $path = current_path();
    if(preg_match('/islandora\/search/', $path)) {

      $data['title'] = t('Refine your search');
      $data['content'] = _islandora_dss_solr_facet_pages_block_callback();
      break;
    }
  }
}
