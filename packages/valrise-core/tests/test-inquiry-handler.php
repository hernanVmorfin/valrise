<?php
/**
 * WordPress integration coverage for the inquiry handler.
 *
 * Run with the WordPress PHPUnit test suite after configuring WP_TESTS_DIR.
 */

class Valrise_Inquiry_Handler_Test extends WP_UnitTestCase {
	public function test_form_shortcode_is_registered(): void {
		$this->assertTrue( shortcode_exists( 'valrise_inquiry_form' ) );
	}

	public function test_form_is_unavailable_until_recipient_is_configured(): void {
		delete_option( Valrise_Settings::OPTION );
		$html = do_shortcode( '[valrise_inquiry_form]' );
		$this->assertStringContainsString( 'Online inquiries are not configured yet', $html );
		$this->assertStringNotContainsString( '<form', $html );
	}
}
