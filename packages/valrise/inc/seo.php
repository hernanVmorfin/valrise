<?php
/**
 * Lightweight metadata ownership.
 *
 * @package Valrise
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return whether the theme should own public metadata.
 */
function valrise_seo_enabled(): bool {
	$external_owner = defined( 'WPSEO_VERSION' )
		|| defined( 'RANK_MATH_VERSION' )
		|| defined( 'SEOPRESS_VERSION' )
		|| defined( 'AIOSEO_VERSION' );

	return (bool) apply_filters( 'valrise_seo_enabled', ! $external_owner );
}

/** Return a context-aware, editable document title. */
function valrise_meta_title(): string {
	if ( is_singular() ) {
		return wp_strip_all_tags( get_the_title() );
	}
	if ( is_home() ) {
		$page_for_posts = (int) get_option( 'page_for_posts' );
		return $page_for_posts ? wp_strip_all_tags( get_the_title( $page_for_posts ) ) : __( 'Insights', 'valrise' );
	}
	return wp_strip_all_tags( get_bloginfo( 'name' ) );
}

/** Return an excerpt-backed description, falling back to the site tagline. */
function valrise_meta_description(): string {
	$description = '';
	if ( is_singular() ) {
		$description = get_the_excerpt();
	}
	if ( ! $description ) {
		$description = get_bloginfo( 'description' );
	}
	return wp_trim_words( wp_strip_all_tags( $description ), 32, '' );
}

/** Return the canonical URL for the current public request. */
function valrise_canonical_url(): string {
	if ( is_singular() ) {
		return (string) wp_get_canonical_url();
	}
	if ( is_home() ) {
		return (string) get_post_type_archive_link( 'post' );
	}
	return (string) get_pagenum_link( max( 1, (int) get_query_var( 'paged' ) ) );
}

/** Output canonical, Open Graph, and Twitter metadata. */
function valrise_render_meta(): void {
	if ( ! valrise_seo_enabled() || is_admin() || is_feed() ) {
		return;
	}

	$title       = valrise_meta_title();
	$description = valrise_meta_description();
	$canonical   = valrise_canonical_url();
	$type        = is_singular( 'post' ) ? 'article' : 'website';
	$image       = is_singular() && has_post_thumbnail() ? get_the_post_thumbnail_url( null, 'large' ) : get_theme_file_uri( 'assets/images/valrise-monogram-color.svg' );

	printf( "\n<link rel=\"canonical\" href=\"%s\">\n", esc_url( $canonical ) );
	printf( "<meta name=\"description\" content=\"%s\">\n", esc_attr( $description ) );
	printf( "<meta property=\"og:title\" content=\"%s\">\n", esc_attr( $title ) );
	printf( "<meta property=\"og:description\" content=\"%s\">\n", esc_attr( $description ) );
	printf( "<meta property=\"og:type\" content=\"%s\">\n", esc_attr( $type ) );
	printf( "<meta property=\"og:url\" content=\"%s\">\n", esc_url( $canonical ) );
	printf( "<meta property=\"og:image\" content=\"%s\">\n", esc_url( (string) $image ) );
	printf( "<meta name=\"twitter:card\" content=\"summary_large_image\">\n" );
}
add_action( 'wp_head', 'valrise_render_meta', 2 );
