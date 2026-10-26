<?php
/**
 * Server-rendered inquiry form.
 *
 * @package ValriseCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Valrise_Inquiry_Form {
	/** Register production assets when the manifest is present. */
	public static function register_assets(): void {
		$manifest_path = VALRISE_CORE_DIR . 'assets/dist/.vite/manifest.json';
		if ( ! is_readable( $manifest_path ) ) {
			return;
		}
		$manifest = json_decode( (string) file_get_contents( $manifest_path ), true );
		$entry    = $manifest['packages/valrise-core/assets/inquiry.ts'] ?? array();
		if ( ! empty( $entry['file'] ) ) {
			wp_register_script( 'valrise-inquiry', VALRISE_CORE_URL . 'assets/dist/' . ltrim( $entry['file'], '/' ), array(), VALRISE_CORE_VERSION, true );
			wp_script_add_data( 'valrise-inquiry', 'strategy', 'defer' );
		}
		if ( ! empty( $entry['css'][0] ) ) {
			wp_register_style( 'valrise-inquiry', VALRISE_CORE_URL . 'assets/dist/' . ltrim( $entry['css'][0], '/' ), array(), VALRISE_CORE_VERSION );
		}
	}

	/**
	 * Render the inquiry form.
	 *
	 * @param array<string, mixed> $attributes Shortcode attributes.
	 */
	public static function render( array $attributes = array() ): string {
		unset( $attributes );
		wp_enqueue_style( 'valrise-inquiry' );
		wp_enqueue_script( 'valrise-inquiry' );

		$status   = isset( $_GET['inquiry_status'] ) ? sanitize_key( wp_unslash( $_GET['inquiry_status'] ) ) : '';
		$errors   = isset( $_GET['inquiry_errors'] ) ? array_filter( array_map( 'sanitize_key', explode( ',', wp_unslash( $_GET['inquiry_errors'] ) ) ) ) : array();
		$error_messages = self::error_messages( $errors );
		$speaking = isset( $_GET['inquiry'] ) && 'speaking' === sanitize_key( wp_unslash( $_GET['inquiry'] ) );

		ob_start();
		?>
		<div class="valrise-inquiry" id="inquiry-form" data-valrise-inquiry>
			<div class="valrise-inquiry__status" aria-live="polite">
				<?php if ( 'success' === $status ) : ?>
					<p class="valrise-notice valrise-notice--success"><?php esc_html_e( 'Thank you. Your inquiry was sent.', 'valrise-core' ); ?></p>
				<?php elseif ( 'error' === $status ) : ?>
					<p class="valrise-notice valrise-notice--error"><?php esc_html_e( 'Your inquiry could not be sent. Review the form and try again.', 'valrise-core' ); ?></p>
				<?php endif; ?>
			</div>

			<?php if ( ! Valrise_Settings::recipient_email() ) : ?>
				<p class="valrise-notice valrise-notice--error"><?php esc_html_e( 'Online inquiries are not configured yet. Please return soon.', 'valrise-core' ); ?></p>
			<?php else : ?>
			<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
				<input type="hidden" name="action" value="valrise_inquiry">
				<?php wp_nonce_field( 'valrise_inquiry_submit', 'valrise_inquiry_nonce' ); ?>
				<div class="valrise-field valrise-honeypot" aria-hidden="true">
					<label for="website_url"><?php esc_html_e( 'Website', 'valrise-core' ); ?></label>
					<input id="website_url" name="website_url" type="text" tabindex="-1" autocomplete="off">
				</div>

				<div class="valrise-form-grid">
					<div class="valrise-field"><label for="name"><?php esc_html_e( 'Name', 'valrise-core' ); ?> <span aria-hidden="true">*</span></label><input id="name" name="name" type="text" autocomplete="name" required aria-describedby="name-help"><small id="name-help"><?php esc_html_e( 'Required', 'valrise-core' ); ?></small></div>
					<div class="valrise-field"><label for="email"><?php esc_html_e( 'Email', 'valrise-core' ); ?> <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" autocomplete="email" required aria-describedby="email-help"><small id="email-help"><?php esc_html_e( 'Required', 'valrise-core' ); ?></small></div>
					<div class="valrise-field"><label for="company"><?php esc_html_e( 'Company', 'valrise-core' ); ?></label><input id="company" name="company" type="text" autocomplete="organization"></div>
					<div class="valrise-field"><label for="role"><?php esc_html_e( 'Role', 'valrise-core' ); ?></label><input id="role" name="role" type="text" autocomplete="organization-title"></div>
				</div>

				<div class="valrise-field"><label for="inquiry_type"><?php esc_html_e( 'Inquiry type', 'valrise-core' ); ?> <span aria-hidden="true">*</span></label><select id="inquiry_type" name="inquiry_type" required data-inquiry-type><option value="consultation" <?php selected( ! $speaking ); ?>><?php esc_html_e( 'Consultation', 'valrise-core' ); ?></option><option value="speaking" <?php selected( $speaking ); ?>><?php esc_html_e( 'Speaking inquiry', 'valrise-core' ); ?></option></select></div>
				<div class="valrise-field"><label for="interest"><?php esc_html_e( 'Area of interest', 'valrise-core' ); ?> <span aria-hidden="true">*</span></label><select id="interest" name="interest" required aria-describedby="interest-help"><option value=""><?php esc_html_e( 'Select an area', 'valrise-core' ); ?></option><option value="executive-advisory"><?php esc_html_e( 'Executive Advisory', 'valrise-core' ); ?></option><option value="leadership-development"><?php esc_html_e( 'Leadership Development', 'valrise-core' ); ?></option><option value="womens-leadership"><?php esc_html_e( 'Women’s Leadership', 'valrise-core' ); ?></option><option value="speaking"><?php esc_html_e( 'Speaking', 'valrise-core' ); ?></option><option value="other"><?php esc_html_e( 'Other', 'valrise-core' ); ?></option></select><small id="interest-help"><?php esc_html_e( 'Required', 'valrise-core' ); ?></small></div>

				<fieldset class="valrise-speaking-fields" data-speaking-fields <?php echo $speaking ? '' : 'hidden'; ?>><legend><?php esc_html_e( 'Event details', 'valrise-core' ); ?></legend><div class="valrise-form-grid"><div class="valrise-field"><label for="event_name"><?php esc_html_e( 'Event or organization', 'valrise-core' ); ?> <span aria-hidden="true">*</span></label><input id="event_name" name="event_name" type="text" data-speaking-required <?php echo $speaking ? 'required' : 'disabled'; ?>></div><div class="valrise-field"><label for="event_date"><?php esc_html_e( 'Event date', 'valrise-core' ); ?></label><input id="event_date" name="event_date" type="date" <?php echo $speaking ? '' : 'disabled'; ?>></div><div class="valrise-field"><label for="event_location"><?php esc_html_e( 'Event location or format', 'valrise-core' ); ?></label><input id="event_location" name="event_location" type="text" <?php echo $speaking ? '' : 'disabled'; ?>></div><div class="valrise-field"><label for="audience"><?php esc_html_e( 'Audience', 'valrise-core' ); ?> <span aria-hidden="true">*</span></label><input id="audience" name="audience" type="text" data-speaking-required <?php echo $speaking ? 'required' : 'disabled'; ?>></div></div></fieldset>

				<div class="valrise-field"><label for="message"><?php esc_html_e( 'Brief message', 'valrise-core' ); ?> <span aria-hidden="true">*</span></label><textarea id="message" name="message" rows="6" required aria-describedby="message-help"></textarea><small id="message-help"><?php esc_html_e( 'Tell us what decision, transition, or event you are planning.', 'valrise-core' ); ?></small></div>

				<?php if ( $error_messages ) : ?><div class="valrise-form-errors" role="alert"><p><?php esc_html_e( 'Please correct the following:', 'valrise-core' ); ?></p><ul><?php foreach ( $error_messages as $message ) : ?><li><?php echo esc_html( $message ); ?></li><?php endforeach; ?></ul></div><?php endif; ?>
				<button type="submit"><?php esc_html_e( 'Send inquiry', 'valrise-core' ); ?></button>
			</form>
			<?php endif; ?>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Convert allowlisted error codes into useful public messages.
	 *
	 * @param string[] $codes Sanitized error codes.
	 * @return string[]
	 */
	private static function error_messages( array $codes ): array {
		$messages = array(
			'name'          => __( 'Please enter your name.', 'valrise-core' ),
			'email'         => __( 'Please enter a valid email address.', 'valrise-core' ),
			'inquiry-type'  => __( 'Please choose an inquiry type.', 'valrise-core' ),
			'interest'      => __( 'Please choose an area of interest.', 'valrise-core' ),
			'message'       => __( 'Please enter a brief message between 10 and 5,000 characters.', 'valrise-core' ),
			'event-details' => __( 'Please enter the event or organization and intended audience.', 'valrise-core' ),
			'delivery'      => __( 'Delivery is temporarily unavailable. Please try again later.', 'valrise-core' ),
			'submission'    => __( 'This submission could not be accepted. Please wait and try again.', 'valrise-core' ),
		);

		return array_values( array_intersect_key( $messages, array_flip( $codes ) ) );
	}
}
