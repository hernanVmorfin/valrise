<?php
/**
 * Inquiry validation and delivery.
 *
 * @package ValriseCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Valrise_Inquiry_Handler {
	/** Process a form submission. */
	public static function handle(): void {
		check_admin_referer( 'valrise_inquiry_submit', 'valrise_inquiry_nonce' );

		$referer = wp_get_referer() ?: home_url( '/contact/' );
		$referer = remove_query_arg( array( 'inquiry_status', 'inquiry_errors' ), $referer );

		if ( ! empty( $_POST['website_url'] ) || ! Valrise_Rate_Limiter::allow() ) {
			self::redirect( $referer, 'error', array( 'submission' ) );
		}

		$data = array(
			'name'           => sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) ),
			'email'          => sanitize_email( wp_unslash( $_POST['email'] ?? '' ) ),
			'company'        => sanitize_text_field( wp_unslash( $_POST['company'] ?? '' ) ),
			'role'           => sanitize_text_field( wp_unslash( $_POST['role'] ?? '' ) ),
			'inquiry_type'   => sanitize_key( wp_unslash( $_POST['inquiry_type'] ?? '' ) ),
			'interest'       => sanitize_key( wp_unslash( $_POST['interest'] ?? '' ) ),
			'message'        => sanitize_textarea_field( wp_unslash( $_POST['message'] ?? '' ) ),
			'event_name'     => sanitize_text_field( wp_unslash( $_POST['event_name'] ?? '' ) ),
			'event_date'     => sanitize_text_field( wp_unslash( $_POST['event_date'] ?? '' ) ),
			'event_location' => sanitize_text_field( wp_unslash( $_POST['event_location'] ?? '' ) ),
			'audience'       => sanitize_text_field( wp_unslash( $_POST['audience'] ?? '' ) ),
		);

		$errors = array();
		if ( ! $data['name'] ) {
			$errors[] = 'name';
		}
		if ( ! is_email( $data['email'] ) ) {
			$errors[] = 'email';
		}
		if ( ! in_array( $data['inquiry_type'], array( 'consultation', 'speaking' ), true ) ) {
			$errors[] = 'inquiry-type';
		}
		if ( ! in_array( $data['interest'], array( 'executive-advisory', 'leadership-development', 'womens-leadership', 'speaking', 'other' ), true ) ) {
			$errors[] = 'interest';
		}
		if ( strlen( $data['message'] ) < 10 || strlen( $data['message'] ) > 5000 ) {
			$errors[] = 'message';
		}
		if ( 'speaking' === $data['inquiry_type'] && ( ! $data['event_name'] || ! $data['audience'] ) ) {
			$errors[] = 'event-details';
		}
		if ( $errors ) {
			self::redirect( $referer, 'error', $errors );
		}

		$recipient = Valrise_Settings::recipient_email();
		if ( ! $recipient ) {
			self::redirect( $referer, 'error', array( 'delivery' ) );
		}

		$subject = sprintf( '[VALRISE] %s inquiry from %s', ucfirst( $data['inquiry_type'] ), $data['name'] );
		$body    = self::format_message( $data );
		$headers = array( 'Reply-To: ' . $data['name'] . ' <' . $data['email'] . '>' );
		$sent    = wp_mail( $recipient, $subject, $body, $headers );

		if ( ! $sent ) {
			self::redirect( $referer, 'error', array( 'delivery' ) );
		}

		self::redirect( $referer, 'success' );
	}

	/** @param array<string, string> $data Sanitized inquiry. */
	private static function format_message( array $data ): string {
		$labels = array(
			'name' => 'Name', 'email' => 'Email', 'company' => 'Company', 'role' => 'Role',
			'inquiry_type' => 'Inquiry type', 'interest' => 'Interest', 'message' => 'Message',
			'event_name' => 'Event or organization', 'event_date' => 'Event date',
			'event_location' => 'Event location or format', 'audience' => 'Audience',
		);
		$lines = array();
		foreach ( $labels as $key => $label ) {
			if ( '' !== $data[ $key ] ) {
				$lines[] = $label . ': ' . $data[ $key ];
			}
		}
		return implode( "\n\n", $lines );
	}

	/** @param string[] $errors Public error codes. */
	private static function redirect( string $url, string $status, array $errors = array() ): void {
		$args = array( 'inquiry_status' => $status );
		if ( $errors ) {
			$args['inquiry_errors'] = implode( ',', array_map( 'sanitize_key', $errors ) );
		}
		wp_safe_redirect( add_query_arg( $args, $url ) . '#inquiry-form' );
		exit;
	}
}
