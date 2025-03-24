<?php
/**
 * Challenge and Submission Post Types
 *
 * @package MemberFun
 */

if (!defined('ABSPATH')) {
    exit;
}

// Include Challenge Post Type
require_once dirname(__FILE__) . '/class-challenge-post-type.php';

// Include Submission Post Type
require_once dirname(__FILE__) . '/class-submission-post-type.php';
