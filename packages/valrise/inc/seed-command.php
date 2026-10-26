<?php
/**
 * Opt-in starter content command.
 *
 * @package Valrise
 */

if ( ! defined( 'ABSPATH' ) || ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	exit;
}

require_once get_theme_file_path( 'inc/content-helpers.php' );

/**
 * Install or refresh VALRISE-owned starter pages.
 */
final class Valrise_Seed_Command {
	/**
	 * Seed starter pages without touching unrelated content.
	 *
	 * ## OPTIONS
	 *
	 * [--update]
	 * : Refresh pages that were created by this command.
	 *
	 * @param array<int, string>   $args Positional arguments.
	 * @param array<string, mixed> $assoc_args Named arguments.
	 */
	public function __invoke( array $args, array $assoc_args ): void {
		$update = isset( $assoc_args['update'] );
		$ids    = array();

		foreach ( valrise_get_starter_pages() as $page ) {
			$seed_key = sanitize_key( $page['seed_key'] ?? '' );
			$slug     = sanitize_title( $page['slug'] ?? '' );
			if ( ! $seed_key || ! $slug ) {
				continue;
			}

			$seeded = get_posts(
				array(
					'post_type'      => 'page',
					'post_status'    => 'any',
					'meta_key'       => '_valrise_seed_key',
					'meta_value'     => $seed_key,
					'posts_per_page' => 1,
					'fields'         => 'ids',
				)
			);

			$post_data = array(
				'post_type'    => 'page',
				'post_title'   => sanitize_text_field( $page['title'] ?? '' ),
				'post_name'    => $slug,
				'post_status'  => in_array( $page['status'] ?? '', array( 'publish', 'draft' ), true ) ? $page['status'] : 'draft',
				'post_excerpt' => sanitize_textarea_field( $page['excerpt'] ?? '' ),
				'post_content' => wp_kses_post( $page['content'] ?? '' ),
			);

			if ( $seeded ) {
				if ( ! $update ) {
					WP_CLI::log( "Keeping seeded page: {$slug}" );
					$ids[ $slug ] = (int) $seeded[0];
					continue;
				}
				$post_data['ID'] = (int) $seeded[0];
				$result          = wp_update_post( wp_slash( $post_data ), true );
			} else {
				$collision = get_page_by_path( $slug, OBJECT, 'page' );
				if ( $collision ) {
					WP_CLI::warning( "Skipping existing unseeded page: {$slug}" );
					continue;
				}
				$result = wp_insert_post( wp_slash( $post_data ), true );
			}

			if ( is_wp_error( $result ) ) {
				WP_CLI::warning( $result->get_error_message() );
				continue;
			}

			update_post_meta( (int) $result, '_valrise_seed_key', $seed_key );
			if ( ! empty( $page['internal_status'] ) ) {
				update_post_meta( (int) $result, '_valrise_internal_status', sanitize_key( $page['internal_status'] ) );
			}
			$ids[ $slug ] = (int) $result;
		}

		if ( ! empty( $ids['home'] ) ) {
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', $ids['home'] );
		}
		if ( ! empty( $ids['insights'] ) ) {
			update_option( 'page_for_posts', $ids['insights'] );
		}

		WP_CLI::success( 'VALRISE starter content is ready.' );
	}
}

WP_CLI::add_command( 'valrise seed', 'Valrise_Seed_Command' );
