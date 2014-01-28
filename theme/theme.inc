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
function islandora_dss_solr_facet_pages_process_islandora_solr_facet_pages_results(&$vars) {

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

function islandora_dss_solr_facet_pages_preprocess_html(&$variables) {

  /*

  // Integrating the jQRangeSlider widget
  drupal_add_library('system', 'ui.widget');
  drupal_add_library('system', 'ui.mouse');
  //drupal_add_js(base_path() . libraries_get_path('jQRangeSlider') . '/jQRangeSlider.js');
  //drupal_add_js(base_path() . libraries_get_path('jQRangeSlider') . '/jQDateRangeSlider.js');
  drupal_add_js(base_path() . libraries_get_path('jQRangeSlider') . '/jQAllRangeSliders.min.js');
  drupal_add_js(base_path() . libraries_get_path('jQRangeSlider') . '/jQAllRangeSliders-withRuler-min.js');
  /*
  drupal_add_js(base_path() . libraries_get_path('jQRangeSlider') . '/jQDateRangeSlider.js');
  drupal_add_js(base_path() . libraries_get_path('jQRangeSlider') . '/jQDateRangeSliderHandle.js');
  drupal_add_js(base_path() . libraries_get_path('jQRangeSlider') . '/jQRangeSlider.js');
  * /

  */

  drupal_add_library('system', 'ui.slider');

  }