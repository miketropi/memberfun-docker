jQuery(document).ready(function($) {
    $('.media-upload-wrapper button').click(function(e) {
        e.preventDefault();
        
        var button = $(this);
        var wrapper = button.closest('.media-upload-wrapper');
        var input = wrapper.find('input[type="hidden"]');
        var preview = wrapper.find('div[id$="_preview"]');
        
        var frame = wp.media({
            title: 'Select Media',
            multiple: false
        });
        
        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();
            input.val(attachment.id);
            preview.html('<img src="' + attachment.url + '" style="max-width: 200px;">');
        });
        
        frame.open();
    });
}); 