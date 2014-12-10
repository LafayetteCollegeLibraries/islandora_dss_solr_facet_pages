<?php

  /**
   * @file Theming hook implementations and other functionality
   * @author griffinj@lafayette.edu
   *
   */

/**
 * Implements hook_preprocess_HOOK().
 *
 */
function _islandora_dss_solr_facet_pages_preprocess_islandora_solr_facet_pages_results(&$vars) {

  $vars['complex_results'] = array();

  foreach($vars['results'] as $result => $count) {

    $class = array('islandora-solr-facet');

    switch($vars['solr_field']) {
    case 'eastasia.Date.Artifact.Upper':
    case 'eastasia.Date.Artifact.Lower':
    case 'eastasia.Date.Image.Upper':
    case 'eastasia.Date.Image.Lower':
      
      $filter = $vars['solr_field'] . ':"' . addslashes($result) . 'T00:00:00Z"';
    $class[] = 'islandora-solr-facet-date';

    break;

    default:

      $filter = $vars['solr_field'] . ':"' . addslashes($result) . '"';
    }

    $vars['complex_results'][$result] = array('count' => $count,
					      'filter' => $filter,
					      'class' => $class);
  }
}

function islandora_dss_solr_facet_pages_preprocess_islandora_solr(&$variables) {

  // scripts[] = 'js/objects_list_sort.js'
  $sorted_order = 'asc';
  if(array_key_exists('sort', $_GET) and preg_match('/^(.+?) ?/', $_GET['sort'], $m)) {

    $sorted_field = $m[1];

    if(preg_match('/ (.+?)$/', $_GET['sort'], $m)) {

      $sorted_order = $m[1];
    }
  } else {

    /**
     * If this is a member of the newspaper collection, sort by the publication date
     * Resolves DSSSM-865
     *
     */
    $sorted_field = 'dc.title';
    $params = $_GET;

    if(array_key_exists('f', $params) and !empty($params['f'])) {

      if(in_array($params['f'][0], array('cdm.Relation.IsPartOf:"Lafayette Newspaper Collection"',
                                         'cdm.Relation.IsPartOf:"Historical Photograph Collection"'))) {
	
        $sorted_field = 'dc.date.sort';
      } elseif(in_array($params['f'][0], array('cdm.Relation.IsPartOf:"Alumni Publications"'))) {

	$params['sort'] = 'MODS.mods.identifier.local_i asc';
      }
    }
  }

  drupal_add_js(base_path() . drupal_get_path('module', 'islandora_dss_solr_facet_pages') . '/js/objects_list_sort.js');
  drupal_add_js(array('islandoraDssSolrFacetPages' => array('order' => $sorted_order,
							    'field' => $sorted_field)), 'setting');
}

function islandora_dss_solr_facet_pages_preprocess_html(&$variables) {

  drupal_add_library('system', 'ui.slider');
  drupal_add_library('system', 'ui.dialog');

  drupal_add_css(drupal_get_path('module', 'islandora_dss_solr_facet_pages') . '/css/islandora_dss_solr_facet_pages.css');

  // For formatting the dates
  drupal_add_js(base_path() . libraries_get_path('moment') . '/moment-with-langs.min.js');
}