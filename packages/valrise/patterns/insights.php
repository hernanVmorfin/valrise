<?php
/**
 * Title: Selected insights
 * Slug: valrise/insights
 * Categories: posts
 */
?>
<!-- wp:group {"align":"full","backgroundColor":"ivory","className":"valrise-section valrise-insights","layout":{"type":"constrained"}} --><div class="wp-block-group alignfull valrise-section valrise-insights has-ivory-background-color has-background"><!-- wp:group {"align":"wide","layout":{"type":"flex","justifyContent":"space-between"}} --><div class="wp-block-group alignwide"><!-- wp:heading {"level":2,"fontSize":"heading"} --><h2 class="wp-block-heading has-heading-font-size">Selected insights</h2><!-- /wp:heading --><p><a href="<?php echo esc_url( get_post_type_archive_link( 'post' ) ?: home_url( '/insights/' ) ); ?>">View all insights →</a></p></div><!-- /wp:group --><!-- wp:query {"query":{"perPage":3,"postType":"post","order":"desc","orderBy":"date"},"displayLayout":{"type":"flex","columns":3}} --><div class="wp-block-query"><!-- wp:post-template --><!-- wp:group {"className":"valrise-insight-card"} --><div class="wp-block-group valrise-insight-card"><!-- wp:post-terms {"term":"category","className":"valrise-eyebrow"} /--><!-- wp:post-title {"isLink":true,"fontSize":"lead"} /--><!-- wp:post-excerpt {"moreText":"Read insight"} /--></div><!-- /wp:group --><!-- /wp:post-template --></div><!-- /wp:query --></div><!-- /wp:group -->
