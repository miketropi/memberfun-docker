<?php
/**
 * Comments REST API Implementation
 *
 * @package MemberFun_Backend
 * @subpackage Comments
 */

// Prevent direct access to this file
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register custom REST API endpoints for comments
 */
function memberfun_register_comments_rest_routes() {
    // Get comments with enhanced filtering
    register_rest_route('memberfun/v1', '/comments', array(
        'methods' => 'GET',
        'callback' => 'memberfun_get_comments',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
        'args' => array(
            'post_id' => array(
                'required' => false,
                'type' => 'integer',
            ),
            'page' => array(
                'required' => false,
                'type' => 'integer',
                'default' => 1,
            ),
            'per_page' => array(
                'required' => false,
                'type' => 'integer',
                'default' => 10,
            ),
            'orderby' => array(
                'required' => false,
                'type' => 'string',
                'default' => 'date',
            ),
            'order' => array(
                'required' => false,
                'type' => 'string',
                'default' => 'DESC',
            ),
            'search' => array(
                'required' => false,
                'type' => 'string',
            ),
            'status' => array(
                'required' => false,
                'type' => 'string',
                'default' => 'approve',
            ),
            'parent' => array(
                'required' => false,
                'type' => 'integer',
                'default' => 0,
            ),
        ),
    ));

    // Create new comment
    register_rest_route('memberfun/v1', '/comments', array(
        'methods' => 'POST',
        'callback' => 'memberfun_create_comment',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
        'args' => array(
            'post_id' => array(
                'required' => true,
                'type' => 'integer',
            ),
            'content' => array(
                'required' => true,
                'type' => 'string',
            ),
            'parent' => array(
                'required' => false,
                'type' => 'integer',
                'default' => 0,
            ),
        ),
    ));

    // Update comment
    register_rest_route('memberfun/v1', '/comments/(?P<id>\d+)', array(
        'methods' => 'PUT',
        'callback' => 'memberfun_update_comment',
        'permission_callback' => function ($request) {
            return memberfun_can_edit_comment($request['id']);
        },
        'args' => array(
            'content' => array(
                'required' => true,
                'type' => 'string',
            ),
        ),
    ));

    // Delete comment
    register_rest_route('memberfun/v1', '/comments/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => 'memberfun_delete_comment',
        'permission_callback' => function ($request) {
            return memberfun_can_delete_comment($request['id']);
        },
    ));

    // reply comment
    register_rest_route('memberfun/v1', '/comments/(?P<id>\d+)/reply', array(
        'methods' => 'POST',
        'callback' => 'memberfun_reply_comment',
        'permission_callback' => function ($request) {
            return is_user_logged_in();
        },
        'args' => array(
            'id' => array(
                'required' => true,
                'type' => 'integer',
            ),
            'content' => array(
                'required' => true,
                'type' => 'string',
            ),
        )
    ));
}
add_action('rest_api_init', 'memberfun_register_comments_rest_routes');

/**
 * Reply to a comment
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response|WP_Error Response object or WP_Error on failure.
 */
function memberfun_reply_comment($request) {
    $user_id = get_current_user_id();
    $comment_id = $request['id'];
    $content = $request->get_param('content');

    // Validate comment exists
    $comment = get_comment($comment_id);
    if (!$comment) {
        return new WP_Error('invalid_comment', 'Invalid comment ID', array('status' => 404));
    }

    // Validate content
    if (empty($content)) {
        return new WP_Error('empty_content', 'Comment content cannot be empty', array('status' => 400));
    }

    // Create reply comment
    $reply_comment_data = array(
        'comment_post_ID' => $comment->comment_post_ID,
        'comment_parent' => $comment_id,
        'comment_content' => wp_kses_post($content),
        'user_id' => $user_id,
        'comment_author' => get_the_author_meta('display_name', $user_id),
        'comment_author_email' => get_the_author_meta('email', $user_id),
        'comment_approved' => 1, // Auto-approve for logged-in users
    );

    $reply_comment_id = wp_insert_comment($reply_comment_data); 

    return new WP_REST_Response(array(
        'id' => $reply_comment_id,
        'post_id' => $comment->comment_post_ID,
        'parent' => $comment_id,
        'author' => array(
            'id' => $user_id,
            'name' => get_the_author_meta('display_name', $user_id),
            'email' => get_the_author_meta('email', $user_id),
        ),
        'content' => $content,
        'date' => current_time('mysql'),
        'status' => 1,
    ), 201);
}

/**
 * Get comments with enhanced filtering
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response|WP_Error Response object or WP_Error on failure.
 */
function memberfun_get_comments($request) {
    $args = array(
        'post_id' => $request->get_param('post_id'),
        'paged' => $request->get_param('page') ?? 1 ,
        'number' => $request->get_param('per_page') ?? 10,
        # 'offset' => $request->get_param('offset'),
        // 'orderby' => $request->get_param('orderby'),
        // 'order' => $request->get_param('order'),
        // 'search' => $request->get_param('search'),
        // 'status' => $request->get_param('status'),
        // 'no_found_rows' => false,
        'parent' => 0, // $request->get_param('parent'),
        'orderby' => 'comment_date',
        'order' => 'DESC',
        'status' => 'approve',
        
    );

    // return new WP_REST_Response(array(
    //     'args' => $args,
    // ), 200);
    
    // Remove empty values
    $args = array_filter($args);
    $args['no_found_rows'] = false;
    $args['parent'] = $args['parent'] ?? 0;

    // $comments_query = new WP_Comment_Query();
    // $comments = $comments_query->query($args);
    // $comments = new WP_Comment_Query($args);
    $comments_query = new WP_Comment_Query( $args );
    $comments = $comments_query->comments;

    // return new WP_REST_Response(array(
    //     'args' => $args,
    //     'comments_query' => $comments_query,
    // ), 200);


    if (empty($comments)) {
        return new WP_REST_Response(array(
            'comments' => array(),
            'total' => 0,
            'pages' => 0,
        ), 200);
    }

    $total = $comments_query->found_comments;
    $pages = $comments_query->max_num_pages;

    $comments_data = array_map(function($comment) {

        // count the comment children
        $comment_children = get_comments(array(
            'post_id' => $comment->comment_post_ID,
            'parent' => $comment->comment_ID,
            'status' => 'approve',
            'number' => 0,
            'orderby' => 'comment_date',
            'order' => 'ASC',
        ));
        $comment_children_count = count($comment_children);

        return array(
            'id' => $comment->comment_ID,
            'post_id' => $comment->comment_post_ID,
            'author' => array(
                'id' => $comment->user_id,
                'name' => memberfun_get_display_name($comment->user_id), // $comment->comment_author,
                'email' => $comment->comment_author_email,
            ),
            'content' => $comment->comment_content,
            'date' => $comment->comment_date,
            'parent' => $comment->comment_parent,
            'status' => $comment->comment_approved,
            'children_count' => $comment_children_count,
            'children' => array_map(function($child) {
                return array(
                    'id' => $child->comment_ID,
                    'parent' => $child->comment_parent,
                    'content' => $child->comment_content,
                    'date' => $child->comment_date,
                    'author' => array(
                        'id' => $child->user_id,
                        'name' => memberfun_get_display_name($child->user_id), // $child->comment_author,
                        'email' => $child->comment_author_email,
                    ),
                    'status' => $child->comment_approved,
                );
            }, $comment_children),
        );
    }, $comments);

    return new WP_REST_Response(array(
        'comments' => $comments_data,
        'total' => $total,
        'pages' => $pages,
    ), 200);
}

/**
 * Create a new comment
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response|WP_Error Response object or WP_Error on failure.
 */
function memberfun_create_comment($request) {
    $user_id = get_current_user_id();
    $post_id = $request->get_param('post_id');
    $content = $request->get_param('content');
    $parent = $request->get_param('parent');

    // Validate post exists
    if (!get_post($post_id)) {
        return new WP_Error('invalid_post', 'Invalid post ID', array('status' => 404));
    }

    // Validate content
    if (empty($content)) {
        return new WP_Error('empty_content', 'Comment content cannot be empty', array('status' => 400));
    }

    // Create comment data
    $comment_data = array(
        'comment_post_ID' => $post_id,
        'comment_content' => wp_kses_post($content),
        'comment_parent' => $parent,
        'user_id' => $user_id,
        'comment_author' => get_the_author_meta('display_name', $user_id),
        'comment_author_email' => get_the_author_meta('email', $user_id),
        'comment_approved' => 1, // Auto-approve for logged-in users
    );

    // Insert comment
    $comment_id = wp_insert_comment($comment_data);

    // add a hook after comment is created
    do_action('memberfun_comment_created', $comment_id);

    if (is_wp_error($comment_id)) {
        return $comment_id;
    }

    $comment = get_comment($comment_id);

    return new WP_REST_Response(array(
        'id' => $comment->comment_ID,
        'post_id' => $comment->comment_post_ID,
        'author' => array(
            'id' => $comment->user_id,
            'name' => $comment->comment_author,
            'email' => $comment->comment_author_email,
        ),
        'content' => $comment->comment_content,
        'date' => $comment->comment_date,
        'parent' => $comment->comment_parent,
        'status' => $comment->comment_approved,
        'children' => array(),
        'children_count' => 0,
    ), 201);
}

// add a hook send email to author post after comment is created
add_action('memberfun_comment_created', 'memberfun_send_email_to_author_post');

function memberfun_send_email_to_author_post($comment_id) {
    $comment = get_comment($comment_id);
    $post_id = $comment->comment_post_ID;
    $post_author = get_post_field('post_author', $post_id);

    $post_author_email = get_the_author_meta('email', $post_author);

    // if post type is seminar, send email to seminar host
    if (get_post_type($post_id) == 'memberfun_semina') {
        $seminar_host = get_post_meta($post_id, '_memberfun_semina_host', true);
        $seminar_host_email = get_the_author_meta('email', $seminar_host);
        $post_author_email = [$post_author_email, $seminar_host_email];
    }

    $post_title = get_the_title($post_id);
    $comment_content = $comment->comment_content;
    $comment_date = $comment->comment_date;
    
    $headers = array('Content-Type: text/html; charset=UTF-8');
    $subject = 'New comment on your post';
    $body = '
    <html>
    <body>
    <h3>New comment on your post</h3>
    <p>Post title: ' . $post_title . '</p>
    <p>Comment: ' . $comment_content . '</p>
    <p>Comment date: ' . $comment_date . '</p>
    <p>Comment by: ' . $comment->comment_author . ' (' . $comment->comment_author_email . ')</p>
    </body>
    </html>
    ';

    wp_mail($post_author_email, $subject, $body, $headers); 
}
/**
 * Update an existing comment
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response|WP_Error Response object or WP_Error on failure.
 */
function memberfun_update_comment($request) {
    $comment_id = $request['id'];
    $content = $request->get_param('content');

    // Validate comment exists
    $comment = get_comment($comment_id);
    if (!$comment) {
        return new WP_Error('invalid_comment', 'Invalid comment ID', array('status' => 404));
    }

    // Validate content
    if (empty($content)) {
        return new WP_Error('empty_content', 'Comment content cannot be empty', array('status' => 400));
    }

    // Update comment
    $comment_data = array(
        'comment_ID' => $comment_id,
        'comment_content' => wp_kses_post($content),
    );

    $result = wp_update_comment($comment_data);

    if (is_wp_error($result)) {
        return $result;
    }

    $updated_comment = get_comment($comment_id);

    return new WP_REST_Response(array(
        'id' => $updated_comment->comment_ID,
        'post_id' => $updated_comment->comment_post_ID,
        'author' => array(
            'id' => $updated_comment->user_id,
            'name' => $updated_comment->comment_author,
            'email' => $updated_comment->comment_author_email,
        ),
        'content' => $updated_comment->comment_content,
        'date' => $updated_comment->comment_date,
        'parent' => $updated_comment->comment_parent,
        'status' => $updated_comment->comment_approved,
    ), 200);
}

/**
 * Delete a comment
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response|WP_Error Response object or WP_Error on failure.
 */
function memberfun_delete_comment($request) {
    $comment_id = $request['id'];

    // Validate comment exists
    $comment = get_comment($comment_id);
    if (!$comment) {
        return new WP_Error('invalid_comment', 'Invalid comment ID', array('status' => 404));
    }

    // Delete comment
    $result = wp_delete_comment($comment_id, true);

    if (!$result) {
        return new WP_Error('delete_failed', 'Failed to delete comment', array('status' => 500));
    }

    return new WP_REST_Response(null, 204);
}

/**
 * Check if user can edit a comment
 *
 * @param int $comment_id Comment ID.
 * @return bool Whether the user can edit the comment.
 */
function memberfun_can_edit_comment($comment_id) {
    if (!is_user_logged_in()) {
        return false;
    }

    $comment = get_comment($comment_id);
    if (!$comment) {
        return false;
    }

    // Allow users to edit their own comments
    if (get_current_user_id() === (int) $comment->user_id) {
        return true;
    }

    // Allow administrators to edit any comment
    return current_user_can('moderate_comments');
}

/**
 * Check if user can delete a comment
 *
 * @param int $comment_id Comment ID.
 * @return bool Whether the user can delete the comment.
 */
function memberfun_can_delete_comment($comment_id) {
    if (!is_user_logged_in()) {
        return false;
    }

    $comment = get_comment($comment_id);
    if (!$comment) {
        return false;
    }

    // Allow users to delete their own comments
    if (get_current_user_id() === (int) $comment->user_id) {
        return true;
    }

    // Allow administrators to delete any comment
    return current_user_can('moderate_comments');
}
