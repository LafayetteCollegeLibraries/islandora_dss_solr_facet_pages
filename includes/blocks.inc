<?php

  /**
   * @file
   * Block functionality for the module
   * @author griffinj@lafayette.edu
   *
   */

function islandora_dss_solr_facet_pages_dss_solr_fields($query_field, $filters) {

  $filter = '';
  if(!empty($filters)) {

    $filter = $filters[0];
  }

  $fields = array();
  $_fields = variable_get('islandora_solr_facet_pages_fields_data', array());

  if(preg_match('/(.+?)\./', $query_field, $m) or preg_match('/(.+?)\./', $filter, $m) ) {

    $query_field_namespace = $m[1];

    switch($query_field_namespace) {

    case 'cdm':

      return $_fields;

    case 'eastasia':
    case 'ldr':
    case 'mdl_prints':
    case 'geology_slides_esi':
    case 'mckelvy':
    case 'war_casualties':

      foreach($_fields as $field) {

	if(preg_match("/$query_field_namespace\./", $field['solr_field'], $m)) {

	  $fields[] = $field;
	}
      }
    
    break;
    default:
      break;
    }
  }

  return $fields;
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

  // Retrieve the current path
  $path = current_path();

  // Explicitly set the prefix for all facets
  $prefix = t('ALL');

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

    // Get available fields from variable.
    //$fields = variable_get('islandora_solr_facet_pages_fields_data', array());
    $fields = module_invoke_all('dss_solr_fields', $path, $filters);

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

      $islandora_solr_facet_query = isset($islandora_solr_query) ? $islandora_solr_query : "$solr_field:[* TO *]";

      if(!empty($filters)) {

	/*
	$query = implode(' AND ', $filters);

	// Collect results.
	$result_fields = _islandora_dss_solr_facet_pages_results($solr, $solr_field, $prefix, $query);
	*/

	$islandora_solr_facet_query = implode(' AND ', array_merge(array($islandora_solr_facet_query), $filters));
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
      $result_fields = array_merge($result_fields, $result_fields_lower);

      $child_items = array();
      $child_items_class = array('islandora-solr-facet-list');
      if(preg_match('/\.?[dD]ate\.?/', $solr_field)) {

	$child_items_class[] = 'islandora-solr-facet-date';
      }

      $child_items_id = preg_replace('/_|\./', '-', $solr_field);

      if(!empty($result_fields)) {

	// Add the field name itself
	// Terrible, refactor
	$items[] = "<div class='islandora-solr-facet'>{$value['label']}</div>";

	// Sort by the most populated facets
	arsort($result_fields);

	// Top 5 facets
	$result_fields = array_slice($result_fields, 0, 5);

	$islandora_solr_path = 'islandora/search/';

	if(isset($islandora_solr_query)) {

	  $islandora_solr_path .= $islandora_solr_query;
	} else {

	  $islandora_solr_path .= '*:*';
	}

	foreach($result_fields as $result => $count) {

	  if(!in_array($result, $filtered_facets)) {
	    //if(true) {

	    $filter = array_merge($filters, array($solr_field . ':"' . addslashes($result) . '"'));

	    $class = array('islandora-solr-facet');
	    

	    // For date values
	    //if(in_array($value['label'], $date_fields)) {
	    if(preg_match('/Date\.?/', $value['label'])) {

	      $class[] = 'islandora-solr-facet-date';
	      //$child_items[] = l(truncate_utf8(date('F, Y', strtotime($result)), 72, TRUE, TRUE), 'islandora/search/*:*', array('attributes' => array('class' => $class),
	      //$child_items[] = l(truncate_utf8($result, 72, TRUE, TRUE), 'islandora/search/*:*', array(
	      $child_items[] = l(truncate_utf8($result, 72, TRUE, TRUE), $islandora_solr_path, array(
												     //'attributes' => array('id' => ),
												     'query' => array('f' => $filter))) . "&nbsp;<span class='bucket-size'>($count)</span>";
	    } else {
	      
	      //$child_items[] = l(truncate_utf8($result, 72, TRUE, TRUE), 'islandora/search/*:*', array(
	      $child_items[] = l(truncate_utf8($result, 72, TRUE, TRUE), $islandora_solr_path, array(
												     //'attributes' => array('class' => $class),
												     'query' => array('f' => $filter))) . "&nbsp;<span class='bucket-size'>($count)</span>";
	    }
	  }
	}

	$child_items[] = l('Show more...', "browse/{$value['path']}");
      }

      if(!empty($child_items)) {

	$items[] = theme('item_list', array('items' => $child_items,
					    'type' => 'ul',
					    'attributes' => array('class' => $child_items_class,
								  'id' => $child_items_id
								  )));

      }
    }

    if(!empty($items)) {

      /*
      $results = implode($items);
      */

      /*
	$results = theme('item_list', array('items' => array(),
					  'type' => 'ul',
					  'attributes' => array('class' => 'islandora-solr-facet-token-list',),
					  )) . implode($items);
      */

    } else {
      
      //$items = '';
    }

    $token_items = array();
    $date_slider_buttons = array();

    $TOP_COLLECTIONS = array('East Asia Image Collection',
			     '');

    foreach($filters as $filter) {

      if(preg_match('/(.+\.?[dD]ate\.?.+?)\:/', $filter, $date_slider_match)) {

	//$date_reset_id = preg_replace('/_|\./', '-', $date_slider_match[1]);
	$date_reset_id = 'reset-' . $child_items_id;

	$date_slider_buttons[$date_slider_match[1]] = array('#type' => 'markup',
							    '#markup' => '<button id="' . $date_reset_id . '" class="islandora-solr-date-reset" data-target="#' . $child_items_id . ' + .islandora-solr-facet-date-slider" >Reset ' . $solr_field . '</button>');
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
	$token_items[] = l(t($token_value_match[1]) . '<span class="close">×</span>', current_path(), array('attributes' => array('class' => array('islandora-solr-facet-token')),
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
