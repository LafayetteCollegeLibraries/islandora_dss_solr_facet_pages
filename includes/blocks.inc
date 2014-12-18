<?php

  /**
   * @file
   * Block functionality for the module
   * @author griffinj@lafayette.edu
   *
   */

function islandora_dss_solr_facet_pages_dss_solr_fields($query_field, $filters) {

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

				     'Marquis de Lafayette Prints Collection' => 'mdl_prints',
				     'Geology Department Slide Collection' => 'geology_slides_esi',
				     'McKelvy House Photograph Collection' => 'mckelvy',
				     'Lafayette World War II Casualties' => 'war_casualties',
				     'Historical Photograph Collection' => 'historical',
				     
				     'Alumni Publications' => 'alumni',
				     );

  $filter = '';
  if(!empty($filters)) {

    $filter = $filters[0];
  }

  $fields = array();
  $_fields = variable_get('islandora_solr_facet_pages_fields_data', array());

  $query_field_namespace = '';
  if(preg_match('/cdm\.Relation\.IsPartOf:(.+)/', $filter, $m)) {

    $query_field_namespace = $m[1];
    if(preg_match('/"(.+?)"/', $query_field_namespace, $m)) {

      $query_field_namespace = $m[1];
    }

    if(array_key_exists($query_field_namespace, $query_field_namespace_map)) {

      $query_field_namespace = $query_field_namespace_map[$query_field_namespace];
    } else {

      $query_field_namespace = 'dc';
    }
  } elseif(preg_match('/cdm\.Relation\.IsPartOf:(.+)/', $query_field, $m)) {

    $query_field_namespace = $m[1];
  } elseif(preg_match('/(.+?)\./', $query_field, $m) or preg_match('/(.+?)\./', $filter, $m)) {

    $query_field_namespace = $m[1];
  }

  if(isset($query_field_namespace) ) {

    $included_fields = array();
    $excluded_fields = array();

    switch($query_field_namespace) {

    case 'cdm':

      return $_fields;

    case 'eastasia':

      /*
      $included_fields = array_merge($included_fields, array('mdl_prints.format.medium', 'cdm.Relation.IsPartOf'));
      $excluded_fields = array_merge($excluded_fields, array('dc.subject'));
      */

      /*
      $SORT_MAP = array();

      $sort = function($u, $v) {

	return ($SORT_MAP[$u['solr_field']] < $SORT_MAP[$v['solr_field']]) ? -1 : 1;
      };
      */

      // Performance problems; Hard-coding the array
      /*
1. subject.ocm
2. coverage.location.country
3. coverage.location
4. format.medium
5. relation.IsPartOf
6. date.artifact.upper
7. date.artifact.lower
8. date.image.upper
9. date.image.lower
10. creator.maker
11. creator.company
12. description.ethnicity
       */

      $fields = array(
		      array('solr_field' => 'eastasia.Subject.OCM',
			    'label' => 'Subject.OCM',
			    'path' => 'eastasia-subject'
			    ),
		      array('solr_field' => 'eastasia.Coverage.Location.Country',
			    'label' => 'Coverage.Location.Country',
			    'path' => 'eastasia-country'
			    ),
		      array('solr_field' => 'eastasia.Coverage.Location',
			    'label' => 'Coverage.Location',
			    'path' => 'eastasia-location'
			    ),
		      array('solr_field' => 'eastasia.Format.Medium',
			    'label' => 'Format.Medium',
			    'path' => 'eastasia-format'
			    ),
		      /*
		      array('solr_field' => 'mdl_prints.format.medium',
			    'label' => 'Format.Medium',
			    'path' => 'mdl-prints-format'
			    ),
		      */
		      array('solr_field' => 'cdm.Relation.IsPartOf',
			    'label' => 'Relation.IsPartOf',
			    'path' => 'collections'
			    ),
		      array('solr_field' => 'eastasia.Date.Artifact.Upper',
			    'label' => 'Date.Artifact.Upper',
			    'path' => 'eastasia-artifact-upper'
			    ),
		      array('solr_field' => 'eastasia.Date.Artifact.Lower',
			    'label' => 'Date.Artifact.Lower',
			    'path' => 'eastasia-artifact-lower'
			    ),
		      array('solr_field' => 'eastasia.Date.Image.Upper',
			    'label' => 'Date.Image.Upper',
			    'path' => 'eastasia-image-upper'
			    ),
		      array('solr_field' => 'eastasia.Date.Image.Lower',
			    'label' => 'Date.Image.Lower',
			    'path' => 'eastasia-image-lower'
			    ),
		      array('solr_field' => 'eastasia.Creator.Maker',
			    'label' => 'Creator.Maker',
			    'path' => 'eastasia-maker'
			    ),
		      array('solr_field' => 'eastasia.Creator.Company',
			    'label' => 'Creator.Company',
			    'path' => 'eastasia-company'
			    ),
		      array('solr_field' => 'eastasia.Description.Ethnicity',
			    'label' => 'Description.Ethnicity',
			    'path' => 'eastasia-ethnicity'
			    ),
		      );

      break;

    case 'ldr':
    case 'mdl_prints':

      $excluded_fields = array_merge($excluded_fields, array('geology_slides_esi.subject'));
    //$included_fields = array_merge($included_fields, array('mdl_prints.creator'));
    break;

    case 'historical':
      
      //$excluded_fields = array_merge($excluded_fields, array('dc.type', 'dc.date.sort'));
      //$included_fields = array_merge($included_fields, array('geology_slides_esi.subject', 'dc.type', 'mdl_prints.date.original'));
      $included_fields = array_merge($included_fields, array('dc.subject', 'dc.type', 'dc.date.sort'));
      //$included_fields = array_merge($included_fields, array('geology_slides_esi.subject', 'dc.type', 'dc.date'));
    break;

    case 'geology_slides_esi':

      //$included_fields = array_merge($included_fields, array('dc.subject', 'mdl_prints.format.medium', 'mckelvy.date.original.display'));
      $included_fields = array_merge($included_fields, array('geology_slides_esi.subject', 'mdl_prints.format.medium', 'mckelvy.date.original.display'));
    break;

    case 'mckelvy':

      $included_fields = array_merge($included_fields, array('dc.subject', 'dc.type', 'mckelvy.date.original.display'));
    break;

    case 'war_casualties':

      //dpm($excluded_fields);
      $included_fields = array_merge($included_fields, array('war_casualties.contributor.military.unit'));
      break;

    case 'alumni':

      $fields = array(array('solr_field' => 'MODS.mods.relatedItem.date.w3cdtf_dts',
			    'label' => 'Date',
			    'path' => ''
			    ),
		      array('solr_field' => 'MODS.mods.originInfo.publisher_s',
			    'label' => 'Publisher',
			    'path' => ''
			    ),
		      array('solr_field' => 'MODS.mods.relatedItem.titleInfo.title_s',
			    'label' => 'Series',
			    'path' => ''
			    ),
		      array('solr_field' => 'MODS.mods.relatedItem.part.detail.volume.number_i',
			    'label' => 'Volume',
			    'path' => ''
			    ),
		      );
      break;

    default:

      break;
    }

    if(empty($fields)) {

      foreach($_fields as $field) {

	if(in_array($field['solr_field'], $included_fields) or (preg_match("/$query_field_namespace\./", $field['solr_field'], $m) and !in_array($field['solr_field'], $excluded_fields))) {

	  if($query_field_namespace == 'historical' and $field['solr_field'] == 'dc.date.sort') {

	    $field['label'] = 'Publication Date';
	  }

	  $fields[] = $field;
	}
      }

      /*
      // Very inefficient; Refactor
      if(isset($sort)) {
      
      uasort($fields, $sort);
      }
      */
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
    // $fields = $_fields;
    $fields = array(array('solr_field' => 'cdm.Relation.IsPartOf',
			  'label' => 'Relation.IsPartOf',
			  'path' => 'collections'
			  ));
  }

  /*
  if(!empty($fields)) {

    foreach($fields as $field) {

      switch($field['solr_field']) {

      case 'mdl_prints.format.medium':

	break;
      }
      dpm($field);
    }
  }
  */
  //dpm($fields);

  return $fields;
  }

/**
 * Work-around for MARC relator values in fields
 * @todo Remove after reindexing has completed
 *
 */
function _islandora_dss_solr_facet_pages_marc_relator_filter($field_value, $field_name) {

  /*  
  if($field_name == 'eastasia.Format.Medium') {

    $MARC_RELATOR_MAP = array(
			      '"photonegative"' => '"Photographic negative"',
			      '"photoprint"' => '"Photographic print"',
			      '"slide"' => '"Photographic slide"',
			      '"picture postcard"' => '"Picture postcard"'
			      );

    return $MARC_RELATOR_MAP[$field_value];

  } elseif($field_name == 'mdl_prints.format.medium') {

    $MARC_RELATOR_MAP = array(
			      '"photoprint"' => '"lithograph"',
			      );

    return $MARC_RELATOR_MAP[$field_value];
  }
  */

  return $field_value;
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
  $ISLANDORA_MARC_METADB_MAP = array(
				     'eastasia.Format.Medium' => array(
								       "photonegative" => 'Photographic negative',
								       "photoprint" => 'Photographic print',
								       "slide" => 'Photographic slide',
								       "picture postcard" => 'Picture postcard',
								       ),
				     'mdl_prints.format.medium' => array(
									 "photoprint" => 'lithograph',
									 )
				     );

  // Retrieve the current path
  $path = current_path();

  // Explicitly set the prefix for all facets
  $prefix = t('ALL');

  $relation_is_part_of = '';

  // If the user agent is currently browsing a facet, render the filtered results...

  //if(preg_match('/browse\/(.+)/', $path, $m)) {
  //if(preg_match('/islandora\/search\/.*\?(.+)/', $path, $m)) {
  //if(preg_match('/browse\/(.+)/', $path, $m) || preg_match('/islandora\/search\/.*\?(.+)/', $path, $m)) {
  if(preg_match('/browse\/(.+)/', $path, $m) || preg_match('/islandora\/search\/(.+)/', $path, $m)) {

    $path = $m[1];
    $query_params = drupal_get_query_parameters();
    $filters = array();
    $filtered_facets = array();

    /*
    //if($path == '*:*' && array_key_exists('f', $query_params)) {
    if($path == '*:*') {

      if(array_key_exists('f', $query_params)) {

	foreach($query_params['f'] as $filtered_facet) {

	  $filters = $query_params['f'];

	  if(preg_match('/"(.+)"/', $filtered_facet, $matches)) {
	    
	    $filtered_facets[] = $matches[1]; 
	  }
	}
      }
    } elseif(preg_match('/islandora\/search\/(.+)?(\/|#)?/', current_path(), $m)) {

      dpm($query_params);

      $islandora_solr_query = $m[1];
    }
    */

    if(preg_match('/islandora\/search\/(.+)?(\/|#)?/', current_path(), $m)) {

      $islandora_solr_query = $m[1];
    }

    if(array_key_exists('f', $query_params)) {

      foreach($query_params['f'] as $filtered_facet) {

	$filters = $query_params['f'];

	if(preg_match('/"(.+)"/', $filtered_facet, $matches)) {
	    
	  $filtered_facets[] = $matches[1]; 
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
    
    /*
    $solr_field_name = array_shift(explode(':', $solr_field));
    */

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

      /*
      if(isset($islandora_solr_query)) {

	$islandora_solr_facet_query = "$solr_field:[* TO *]";
      } else {

	$islandora_solr_facet_query = "$solr_field:[* TO *]";
      }
      */

      /**
       * Resolves issues related to full-text searches
       *
       */
      $islandora_solr_facet_query = isset($islandora_solr_query) ? $islandora_solr_query : "$solr_field:[* TO *]";
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

				   'MODS.mods.originInfo.publisher_s',
				   'MODS.mods.relatedItem.titleInfo.title_s'
				   );

      foreach($SOLR_INDEXED_FIELDS as $solr_indexed_field) { // For Solr-indexed fields with specific Analyzers (i. e. not optimized for tokenization of contents)

	//$islandora_solr_facet_query = str_replace('"', '*', $islandora_solr_facet_query);

	/**
	 * This resolves DSSSM-709
	 * Work-around
	 * @todo Refactor
	 *
	 */
	if(!preg_match("/c_$solr_indexed_field/", $islandora_solr_facet_query)) {

	  $islandora_solr_facet_query = str_replace($solr_indexed_field, 'c_' . $solr_indexed_field, $islandora_solr_facet_query);
	}

	dpm('trace3: ' . $islandora_solr_facet_query);

	if(preg_match("/c_c_$solr_indexed_field/", $islandora_solr_facet_query)) {

	  dpm('trace3');

	  $islandora_solr_facet_query = str_replace('c_c_' . $solr_indexed_field, 'c_ ' . $solr_indexed_field, $islandora_solr_facet_query);
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

      if(!empty($filters)) {

	/*
	$query = implode(' AND ', $filters);

	// Collect results.
	$result_fields = _islandora_dss_solr_facet_pages_results($solr, $solr_field, $prefix, $query);
	*/

	$islandora_solr_facet_query = implode(' AND ', array_merge(array($islandora_solr_facet_query), $filters));
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

	//$search = str_replace("$metachar", urlencode($metachar), $search);
	$islandora_solr_facet_query = str_replace(urlencode($metachar), $metachar, $islandora_solr_facet_query);
      }

      // Collect results.
      $result_fields = _islandora_dss_solr_facet_pages_results($solr, $solr_field, $prefix, $islandora_solr_facet_query);

      /*
      } else {
	
	// Collect results.
	$result_fields = _islandora_dss_solr_facet_pages_results($solr, $solr_field, $prefix);
      }
      */

      // Collect results with lowercase.
      $prefix_lower = strtolower($prefix);
      $result_fields_lower = _islandora_dss_solr_facet_pages_results($solr, $solr_field, $prefix_lower, $islandora_solr_facet_query);

      /*
      if(!empty($filters)) {

	$query = implode(' AND ', $filters);

	$result_fields_lower = _islandora_dss_solr_facet_pages_results($solr, $solr_field, $prefix_lower, $query);
      } else {
	
	$result_fields_lower = _islandora_dss_solr_facet_pages_results($solr, $solr_field, $prefix_lower);
      }
      */

      // Merge uppercase with lowercase.
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
							      'Alumni Publications'
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

      //if($islandora_solr_facet_query == '*:*') {
      if($islandora_solr_facet_query == '*:*'
	 //} elseif($islandora_solr_facet_query == '*:*'
	 or $islandora_solr_facet_query == '*: *'
	 or empty($filtered_facets)) {

	//if( (array_key_exists(0, $_GET['f']) and !preg_match('/cdm\.Relation\.IsPartOf/', $_GET['f'][0])) or preg_match('/collections\/browse/', current_path()) ) {

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
      /*
      } elseif(preg_match('/McKelvy House Photograph Collection/', $islandora_solr_facet_query)) { // Resolves DSSSM-756

	$ISLANDORA_DSS_SOLR_FACET_PAGES_FIELD_LABELS = array('mckelvy.date.original.display' => 'Publication Date',
							     'mdl_prints.format.medium' => 'Medium');

	if(array_key_exists($solr_field, $ISLANDORA_DSS_SOLR_FACET_PAGES_FIELD_LABELS)) {
	    
	  $value['label'] = $ISLANDORA_DSS_SOLR_FACET_PAGES_FIELD_LABELS[$solr_field];
	}
      } elseif(preg_match('/Geology Department Slide Collection/', $islandora_solr_facet_query)) { // Resolves DSSSM-757

	$ISLANDORA_DSS_SOLR_FACET_PAGES_FIELD_LABELS = array('mckelvy.date.original.display' => 'Publication Date',
							     'mdl_prints.format.medium' => 'Medium');

	if(array_key_exists($solr_field, $ISLANDORA_DSS_SOLR_FACET_PAGES_FIELD_LABELS)) {
	  
	  $value['label'] = $ISLANDORA_DSS_SOLR_FACET_PAGES_FIELD_LABELS[$solr_field];
	}
      }
      */
      
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

      // Iterate through the facets
      if(!empty($result_fields)) {

	// Add the field name itself
	// Terrible, refactor
	$items[] = "<div class='islandora-solr-facet'>{$value['label']}</div>";

	/**
	 * Anomalous sorting for faceted values on certain fields (such as "Volume" for the "Alumni Publications" Collection)
	 * Resolves DSSSM-1081
	 * @todo Implement
	 *
	 */
	//if($solr_field == 'MODS.mods.relatedItem.part.detail.volume.number_i') {
	if(in_array($solr_field, array('MODS.mods.originInfo.publisher_s',
				       'MODS.mods.relatedItem.titleInfo.title_s'))) {

	  // Sort ascending by the facet values
	  ksort($result_fields);
	} elseif(in_array($solr_field, array('MODS.mods.relatedItem.part.detail.volume.number_i'))) {

	  // Sort descending by the facet values
	  krsort($result_fields);
	} else {

	  // Sort by the most populated facets
	  arsort($result_fields);
	}

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
	if(isset($islandora_solr_query)) {

	  $islandora_solr_path .= $islandora_solr_query;
	} else {

	  $islandora_solr_path .= '*:*';
	}

	foreach($result_fields as $result => $count) {

	  //if(!in_array($result, $filtered_facets)) {

	  $filter = array_merge($filters, array($solr_field . ':"' . addslashes($result) . '"'));
	  $query = array('f' => $filter);
	  if(isset($page)) {

	    //$query['page'] = $page;
	    /**
	     * Faceting should not retain the current page being viewed
	     *
	     */
	  }

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
	  //if(in_array($value['label'], $date_fields)) {
	  if(preg_match('/Date\.?/', $value['label'])) {

	    $class[] = 'islandora-solr-facet-date';
	    //$child_items[] = l(truncate_utf8(date('F, Y', strtotime($result)), 72, TRUE, TRUE), 'islandora/search/*:*', array('attributes' => array('class' => $class),
	    //$child_items[] = l(truncate_utf8($result, 72, TRUE, TRUE), 'islandora/search/*:*', array(
	    
	    $child_items[] = l($result, $islandora_solr_path, array(
								    //'attributes' => array('id' => ),
								    'query' => $query)) . "&nbsp;<span class='bucket-size'>($count)</span>";
	  } else {

	    //$child_items[] = l(truncate_utf8($result, 72, TRUE, TRUE), 'islandora/search/*:*', array(
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
	if(preg_match('/\.?[dD]ate\.?/', $value['label']) or (count($child_items) > 1 and $islandora_solr_facet_query != '*:*')) {

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

    /*

      $child_items = array();
      $child_items_class = array('islandora-solr-facet-list');
      if(preg_match('/\.?[dD]ate\.?/', $solr_field)) {

	$child_items_class[] = 'islandora-solr-facet-date';
      }

      $child_items_id = preg_replace('/_|\./', '-', $solr_field);

    */

    foreach($filters as $filter) {

      if(preg_match('/(.+\.?[dD]ate\.?.+?)\:/', $filter, $date_slider_match)) {

	//$date_reset_id = preg_replace('/_|\./', '-', $date_slider_match[1]);

	$filter_split = explode(':', $filter);
	$solr_field = $filter_split[0];

	$child_items_id = preg_replace('/_|\./', '-', $solr_field);
	$date_reset_id = 'reset-' . $child_items_id;

	$result_fields = islandora_solr_get_fields('result_fields');

	/**
	 * Work-around for McKelvy
	 * Resolves DSSSM-737
	 *
	 */
	//if(true) {

	/*
	$ISLANDORA_DSS_SOLR_FACET_PAGES_FIELD_LABELS = array('McKelvy House Photograph Collection' => array('mckelvy.date.original.display' => 'Publication Date',
													    'mdl_prints.format.medium' => 'Medium'),
							     'Geology Department Slide Collection' => array('geology_slides_esi.date.original' => 'Publication Date',
													    'geology_slides_esi.coverage.location' => 'Coverage'),
							     'Lafayette Newspaper Collection' => array('dc.date.sort' => 'Publication Date'),
							     );
	*/

	/**
	 * Resolves DSSSM-633
	 * @todo Scheduled for review on 08/27/14
	 * If closed, removed; if opened, refactored
	 *
	 */
	
	/*
	foreach($ISLANDORA_DSS_SOLR_FACET_PAGES_FIELD_LABELS as $collection_key => $field_labels) {
	  
	  if(preg_match("/$collection_key/", $islandora_solr_facet_query)) { // Resolves DSSSM-756
	    
	    if(array_key_exists($solr_field, $field_labels)) {
	      
	      $result_fields[$solr_field] = $field_labels[$solr_field];
	    }
	  }
	}
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

	preg_match('/.+?\:(.+)/', $filter, $token_value_match);
	$token_value = $token_value_match[1];

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
 */
function islandora_dss_solr_facet_pages_block_view_alter(&$data, $block) {

  switch ($block->delta) {
  case 'islandora-solr-facet-pages':

    $path = current_path();
    //if(preg_match('/browse\//', $path) || preg_match('/islandora\/search/', $path)) {
    if(preg_match('/islandora\/search/', $path)) {

      #$path = current_path();
      $data['title'] = 'Refine your search';
      $data['content'] = _islandora_dss_solr_facet_pages_block_callback();
      break;
    }
  }
}
