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
  drupal_add_library('system', 'ui.dialog');

  // lightbox2 does not support AJAX modals
  /*
  drupal_load('module', 'lightbox2');
  lightbox2_add_files();
  */

  //fancyBox2 does

  /*
<!-- Add fancyBox -->
<link rel="stylesheet" href="/fancybox/source/jquery.fancybox.css?v=2.1.5" type="text/css" media="screen" />
<script type="text/javascript" src="/fancybox/source/jquery.fancybox.pack.js?v=2.1.5"></script>
  */

  drupal_add_css(drupal_get_path('module', 'islandora_dss_solr_facet_pages') . '/css/islandora_dss_solr_facet_pages.css');

  drupal_add_css(libraries_get_path('fancyBox') . '/source/jquery.fancybox.css');
  drupal_add_js(base_path() . libraries_get_path('fancyBox') . '/source/jquery.fancybox.pack.js');
}