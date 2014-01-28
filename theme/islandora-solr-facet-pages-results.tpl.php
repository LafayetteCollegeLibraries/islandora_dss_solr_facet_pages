<?php

/**
 * @file
 * islandora-solr-facet-pages-results.tpl.php
 * Islandora solr template file for facet results
 *
 * Variables available:
 * - $variables: all array elements of $variables can be used as a variable. e.g. $base_url equals $variables['base_url']
 * - $base_url: The base url of the current website. eg: http://example.com .
 * - $user: The user object.
 *
 * - $results: Array containing search results to render
 * - $solr_field: Facet solr field to be used to create url's including a filter
 *
 */

?>

<ul class="islandora-solr-facet-pages-results">
  <?php foreach ($complex_results as $result => $value): ?>
    <li class="<?php print $value['class']; ?>">
      <?php print l(truncate_utf8($result, 72, TRUE, TRUE), 'islandora/search/*:*', array('query' => array('f' => array($value['filter'])))); ?>
      <span class="bucket-size">(<?php print $value['count']; ?>)</span>
    </li>
  <?php endforeach; ?>
</ul>
