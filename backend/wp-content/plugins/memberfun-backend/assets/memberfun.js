;(() => {
  'use strict';

  // function memberfun_delete_rating
  async function memberfun_delete_rating(event) {

    // button is class .memberfun-delete-rating
    const button = event.target;
    if (!button.classList.contains('memberfun-delete-rating')) {
      return;
    }

    event.preventDefault();

    // confirm delete
    if (!confirm('Are you sure you want to delete this rating?')) {
      return;
    }

    const user_id = button.dataset.userId;
    const post_id = button.dataset.postId;

    // make formData
    const formData = new FormData();
    formData.append('action', 'memberfun_delete_rating_ajax');
    formData.append('user_id', user_id);
    formData.append('post_id', post_id);

    // send ajax request to delete rating
    const response = await fetch(memberfun_backend_vars.ajax_url, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      // console.log('Rating deleted successfully');
      // remove rating-list-item-${user_id}
      const ratingItem = document.querySelector(`.rating-list-item-${user_id}`);
      if (ratingItem) {
        ratingItem.remove();
      }
    } else {
      console.log('Failed to delete rating');
    }
  }

  // dom loaded
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', memberfun_delete_rating);
  });
})(window);