<?php
/**
 * Plugin Name: VALRISE Core
 * Description: Portable inquiry handling and business settings for VALRISE Consulting.
 * Version: 1.0.0
 * Requires at least: 6.6
 * Requires PHP: 8.1
 * Author: VALRISE Consulting
 * License: GPL-2.0-or-later
 * Text Domain: valrise-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'VALRISE_CORE_VERSION', '1.0.0' );
define( 'VALRISE_CORE_FILE', __FILE__ );
define( 'VALRISE_CORE_DIR', plugin_dir_path( __FILE__ ) );
define( 'VALRISE_CORE_URL', plugin_dir_url( __FILE__ ) );

require_once VALRISE_CORE_DIR . 'includes/class-settings.php';
require_once VALRISE_CORE_DIR . 'includes/class-rate-limiter.php';
require_once VALRISE_CORE_DIR . 'includes/class-inquiry-form.php';
require_once VALRISE_CORE_DIR . 'includes/class-inquiry-handler.php';

add_shortcode( 'valrise_inquiry_form', array( 'Valrise_Inquiry_Form', 'render' ) );
add_action( 'admin_post_valrise_inquiry', array( 'Valrise_Inquiry_Handler', 'handle' ) );
add_action( 'admin_post_nopriv_valrise_inquiry', array( 'Valrise_Inquiry_Handler', 'handle' ) );
add_action( 'admin_menu', array( 'Valrise_Settings', 'register_page' ) );
add_action( 'admin_init', array( 'Valrise_Settings', 'register_settings' ) );
add_action( 'wp_enqueue_scripts', array( 'Valrise_Inquiry_Form', 'register_assets' ) );

/**
 * Functional wrapper for themes and templates that prefer PHP to shortcode use.
 *
 * @param array<string, mixed> $attributes Optional presentation attributes.
 * @return string
 */
function valrise_render_inquiry_form( array $attributes = array() ): string {
	return Valrise_Inquiry_Form::render( $attributes );
}
