<?php
/**
 * Starter content helpers.
 *
 * @package Valrise
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Read and validate the bundled starter page definitions.
 *
 * @return array<int, array<string, string>>
 */
function valrise_get_starter_pages(): array {
	$path = get_theme_file_path( 'content/starter-content.json' );
	if ( ! is_readable( $path ) ) {
		return array();
	}

	$pages = json_decode( (string) file_get_contents( $path ), true );
	return is_array( $pages ) ? $pages : array();
}
