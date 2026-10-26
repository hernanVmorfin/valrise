<?php
/**
 * Title: Site header
 * Slug: valrise/site-header
 * Categories: header
 * Block Types: core/template-part/header
 * Inserter: no
 */
?>
<!-- wp:html --><a class="valrise-skip-link screen-reader-text" href="#main-content"><?php esc_html_e( 'Skip to content', 'valrise' ); ?></a><!-- /wp:html -->
<!-- wp:group {"align":"full","className":"valrise-site-header","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull valrise-site-header"><!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:image {"width":"228px","sizeSlug":"full","linkDestination":"custom","className":"valrise-brand"} --><figure class="wp-block-image size-full is-resized valrise-brand"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/valrise-header-color.svg' ) ); ?>" alt="<?php esc_attr_e( 'VALRISE Consulting', 'valrise' ); ?>" style="width:228px" width="228" height="48"/></a></figure><!-- /wp:image --><!-- wp:navigation {"overlayMenu":"mobile","layout":{"type":"flex","justifyContent":"right"}} --><!-- wp:navigation-link {"label":"About","url":"<?php echo esc_url( home_url( '/about-valeria/' ) ); ?>"} /--><!-- wp:navigation-link {"label":"Consulting","url":"<?php echo esc_url( home_url( '/consulting/' ) ); ?>"} /--><!-- wp:navigation-link {"label":"Speaking","url":"<?php echo esc_url( home_url( '/speaking/' ) ); ?>"} /--><!-- wp:navigation-link {"label":"Insights","url":"<?php echo esc_url( home_url( '/insights/' ) ); ?>"} /--><!-- /wp:navigation --><!-- wp:buttons {"className":"valrise-header-cta"} --><div class="wp-block-buttons valrise-header-cta"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Book a consultation</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div>
<!-- /wp:group --></div><!-- /wp:group -->
