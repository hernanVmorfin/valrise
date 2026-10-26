<?php
/**
 * Business settings.
 *
 * @package ValriseCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Valrise_Settings {
	public const OPTION = 'valrise_core_settings';

	/** Register the settings screen. */
	public static function register_page(): void {
		add_options_page(
			__( 'VALRISE Settings', 'valrise-core' ),
			__( 'VALRISE', 'valrise-core' ),
			'manage_options',
			'valrise-settings',
			array( self::class, 'render_page' )
		);
	}

	/** Register sanitized settings. */
	public static function register_settings(): void {
		register_setting(
			'valrise_core',
			self::OPTION,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( self::class, 'sanitize' ),
				'default'           => array(),
			)
		);

		add_settings_section( 'valrise_contact', __( 'Inquiry delivery', 'valrise-core' ), '__return_false', 'valrise-settings' );
		add_settings_field( 'recipient_email', __( 'Recipient email', 'valrise-core' ), array( self::class, 'email_field' ), 'valrise-settings', 'valrise_contact' );
	}

	/** @param mixed $value Raw option value. @return array<string, string> */
	public static function sanitize( $value ): array {
		$value = is_array( $value ) ? $value : array();
		return array(
			'recipient_email' => sanitize_email( $value['recipient_email'] ?? '' ),
		);
	}

	/** Return the configured delivery address or an empty string. */
	public static function recipient_email(): string {
		$settings = get_option( self::OPTION, array() );
		return is_array( $settings ) ? sanitize_email( $settings['recipient_email'] ?? '' ) : '';
	}

	/** Render the email field. */
	public static function email_field(): void {
		printf(
			'<input class="regular-text" type="email" name="%1$s[recipient_email]" value="%2$s" autocomplete="email">',
			esc_attr( self::OPTION ),
			esc_attr( self::recipient_email() )
		);
		echo '<p class="description">' . esc_html__( 'The form remains unavailable for delivery until this address is saved and tested.', 'valrise-core' ) . '</p>';
	}

	/** Render the settings page. */
	public static function render_page(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'VALRISE Settings', 'valrise-core' ); ?></h1>
			<form action="options.php" method="post">
				<?php settings_fields( 'valrise_core' ); ?>
				<?php do_settings_sections( 'valrise-settings' ); ?>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}
}
