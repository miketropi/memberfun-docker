<?php 

// show user custom meta field "memberfun_last_claim_date" in user profile edit page
function memberfun_show_user_last_claim_date($user) {
    $last_claim_date = get_user_meta($user->ID, 'memberfun_last_claim_date', true);
    echo '<p>Last claim date: ' . $last_claim_date . '</p>';

    // add button to reset last claim date
    echo '<button type="button" class="button" onclick="resetLastClaimDate(' . $user->ID . ')">Reset last claim date</button>';

    // add script to reset last claim date
    echo '<script>
        function resetLastClaimDate(userId) {
            wp.ajax
              .post("memberfun_reset_last_claim_date", { userId: userId })
              .done(function(response) {
                console.log(response);

                alert(response);
            });
        }
    </script>';
}
add_action('show_user_profile', 'memberfun_show_user_last_claim_date');
add_action('edit_user_profile', 'memberfun_show_user_last_claim_date');

// reset last claim date
function memberfun_reset_last_claim_date() {
    // userId
    $user_id = $_POST['userId'];

    update_user_meta($user_id, 'memberfun_last_claim_date', null);
    echo 'Last claim date reset successfully';
    wp_die();
}

add_action('wp_ajax_memberfun_reset_last_claim_date', 'memberfun_reset_last_claim_date');




