<?php
/**
 * Theme bootstrap and production asset loading.
 *
 * @package Valrise
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'VALRISE_VERSION', '1.0.0' );

require_once get_theme_file_path( 'inc/seo.php' );
require_once get_theme_file_path( 'inc/structured-data.php' );
require_once get_theme_file_path( 'inc/insights.php' );

/**
 * Return the public URI for a Vite entrypoint or one of its CSS assets.
 *
 * @param string $entry Entry source path from the Vite manifest.
 * @param string $type  Either file or css.
 * @return string
 */
function valrise_asset_uri( string $entry, string $type = 'file' ): string {
	$manifest_path = get_theme_file_path( 'assets/dist/.vite/manifest.json' );

	if ( ! is_readable( $manifest_path ) ) {
		return '';
	}

	$manifest = json_decode( (string) file_get_contents( $manifest_path ), true );
	if ( ! is_array( $manifest ) || empty( $manifest[ $entry ] ) ) {
		return '';
	}

	if ( 'css' === $type ) {
		$file = $manifest[ $entry ]['css'][0] ?? '';
	} else {
		$file = $manifest[ $entry ]['file'] ?? '';
	}

	return $file ? get_theme_file_uri( 'assets/dist/' . ltrim( $file, '/' ) ) : '';
}

/**
 * Enqueue the compiled, dependency-free frontend bundle.
 */
function valrise_enqueue_assets(): void {
	$entry = 'packages/valrise/assets/src/main.ts';
	$style = valrise_asset_uri( $entry, 'css' );
	$script = valrise_asset_uri( $entry );

	if ( $style ) {
		wp_enqueue_style( 'valrise', $style, array(), VALRISE_VERSION );
	}

	if ( $script ) {
		wp_enqueue_script( 'valrise', $script, array(), VALRISE_VERSION, true );
		wp_script_add_data( 'valrise', 'strategy', 'defer' );
	}
}
add_action( 'wp_enqueue_scripts', 'valrise_enqueue_assets' );

/**
 * Register editor styles and theme features.
 */
function valrise_setup(): void {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/editor.css' );
}
add_action( 'after_setup_theme', 'valrise_setup' );

/** Use the supplied icons until an administrator chooses a WordPress Site Icon. */
function valrise_favicon_fallback(): void {
	if ( has_site_icon() ) {
		return;
	}
	printf( '<link rel="icon" href="%s" sizes="any">' . "\n", esc_url( get_theme_file_uri( 'assets/images/favicon.ico' ) ) );
	printf( '<link rel="apple-touch-icon" href="%s">' . "\n", esc_url( get_theme_file_uri( 'assets/images/apple-touch-icon.png' ) ) );
}
add_action( 'wp_head', 'valrise_favicon_fallback', 1 );

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once get_theme_file_path( 'inc/seed-command.php' );
}
