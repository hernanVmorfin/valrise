<?php
/**
 * Privacy-conscious inquiry rate limiter.
 *
 * @package ValriseCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Valrise_Rate_Limiter {
	private const MAX_ATTEMPTS = 5;
	private const WINDOW       = 15 * MINUTE_IN_SECONDS;

	/**
	 * Allow a bounded number of submissions per anonymized address window.
	 */
	public static function allow(): bool {
		$raw_ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
		$ip     = function_exists( 'wp_privacy_anonymize_ip' ) ? wp_privacy_anonymize_ip( $raw_ip ) : $raw_ip;
		$key    = 'valrise_rate_' . hash_hmac( 'sha256', $ip, wp_salt( 'nonce' ) );
		$count  = (int) get_transient( $key );

		if ( $count >= self::MAX_ATTEMPTS ) {
			return false;
		}

		set_transient( $key, $count + 1, self::WINDOW );
		return true;
	}
}
