<?php
/**
 * Verified-only structured data graph.
 *
 * @package Valrise
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Build breadcrumb items for the current request. */
function valrise_breadcrumb_schema(): array {
	$items = array(
		array(
			'@type'    => 'ListItem',
			'position' => 1,
			'name'     => __( 'Home', 'valrise' ),
			'item'     => home_url( '/' ),
		),
	);

	if ( is_singular() && ! is_front_page() ) {
		$items[] = array(
			'@type'    => 'ListItem',
			'position' => 2,
			'name'     => wp_strip_all_tags( get_the_title() ),
			'item'     => get_permalink(),
		);
	}

	return array(
		'@type'           => 'BreadcrumbList',
		'@id'             => valrise_canonical_url() . '#breadcrumb',
		'itemListElement' => $items,
	);
}

/** Output the schema graph only when this theme owns metadata. */
function valrise_render_structured_data(): void {
	if ( ! valrise_seo_enabled() || is_admin() || is_feed() ) {
		return;
	}

	$organization_id = home_url( '/#organization' );
	$person_id       = home_url( '/about-valeria/#person' );
	$graph           = array(
		array(
			'@type'   => 'Organization',
			'@id'     => $organization_id,
			'name'    => 'VALRISE Consulting',
			'url'     => home_url( '/' ),
			'logo'    => get_theme_file_uri( 'assets/images/valrise-monogram-color.svg' ),
			'founder' => array( '@id' => $person_id ),
		),
		array(
			'@type'    => 'Person',
			'@id'      => $person_id,
			'name'     => 'Valeria Mogildea',
			'jobTitle' => 'Founder',
			'worksFor' => array( '@id' => $organization_id ),
			'url'      => home_url( '/about-valeria/' ),
		),
		valrise_breadcrumb_schema(),
	);

	if ( is_singular( 'post' ) ) {
		$graph[] = array(
			'@type'         => 'Article',
			'@id'           => get_permalink() . '#article',
			'headline'      => wp_strip_all_tags( get_the_title() ),
			'description'   => valrise_meta_description(),
			'datePublished' => get_the_date( DATE_W3C ),
			'dateModified'  => get_the_modified_date( DATE_W3C ),
			'mainEntityOfPage' => get_permalink(),
			'author'        => array( '@id' => $person_id ),
			'publisher'     => array( '@id' => $organization_id ),
		);
	}

	$payload = array(
		'@context' => 'https://schema.org',
		'@graph'   => $graph,
	);

	printf( "\n<script type=\"application/ld+json\">%s</script>\n", wp_json_encode( $payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'valrise_render_structured_data', 30 );
