<?php
/**
 * Conditional and related Insights rendering.
 *
 * @package Valrise
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Remove the homepage Insights composition when no articles are published.
 *
 * @param string              $content Rendered block output.
 * @param array<string,mixed> $block   Parsed block.
 */
function valrise_hide_empty_insights( string $content, array $block ): string {
	if ( is_admin() || ! is_front_page() ) {
		return $content;
	}

	$class_name = $block['attrs']['className'] ?? '';
	if ( false === strpos( (string) $class_name, 'valrise-insights' ) ) {
		return $content;
	}

	$counts = wp_count_posts( 'post' );
	return isset( $counts->publish ) && (int) $counts->publish > 0 ? $content : '';
}
add_filter( 'render_block', 'valrise_hide_empty_insights', 10, 2 );

/** Render up to three related published articles from shared categories. */
function valrise_related_insights(): string {
	if ( ! is_singular( 'post' ) ) {
		return '';
	}

	$post_id    = get_the_ID();
	$categories = wp_get_post_categories( $post_id );
	$query      = new WP_Query(
		array(
			'post_type'           => 'post',
			'post_status'         => 'publish',
			'posts_per_page'      => 3,
			'post__not_in'        => array( $post_id ),
			'category__in'        => $categories,
			'ignore_sticky_posts' => true,
		)
	);

	if ( ! $query->have_posts() ) {
		return '';
	}

	ob_start();
	?>
	<aside class="valrise-related" aria-labelledby="valrise-related-title">
		<h2 id="valrise-related-title"><?php esc_html_e( 'Related insights', 'valrise' ); ?></h2>
		<ul>
			<?php while ( $query->have_posts() ) : $query->the_post(); ?>
				<li><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></li>
			<?php endwhile; ?>
		</ul>
	</aside>
	<?php
	wp_reset_postdata();
	return (string) ob_get_clean();
}
add_shortcode( 'valrise_related_insights', 'valrise_related_insights' );
