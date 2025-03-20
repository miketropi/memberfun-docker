/**
 * MemberFun Semina - Admin Scripts
 */
(function($) {
    'use strict';

    // Initialize when document is ready
    $(document).ready(function() {
        // Date validation - ensure seminar date is not in the past
        $('#memberfun_semina_date').on('change', function() {
            const selectedDate = new Date($(this).val());
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                alert('Warning: You have selected a date in the past. Seminars should typically be scheduled for future dates.');
            }
        });

        // Capacity field validation
        $('#memberfun_semina_capacity').on('change', function() {
            const capacity = parseInt($(this).val(), 10);
            if (capacity < 1) {
                $(this).val('');
                alert('Capacity must be at least 1. Leave empty for unlimited capacity.');
            }
        });

        // Initialize document management if the documents meta box exists
        if ($('#memberfun-semina-documents').length) {
            initDocumentManagement();
        }
    });

    /**
     * Initialize document management functionality
     */
    function initDocumentManagement() {
        // Document list sortable
        if ($.fn.sortable) {
            $('#memberfun-semina-document-list').sortable({
                items: '.memberfun-semina-document-item',
                handle: 'strong',
                cursor: 'move',
                opacity: 0.7,
                revert: true,
                update: function() {
                    reindexDocuments();
                }
            });
        }

        // Document type validation
        $('#memberfun-add-document').on('click', function() {
            // Media library handling is already implemented in meta-fields.php
        });
    }

    /**
     * Reindex documents after sorting
     */
    function reindexDocuments() {
        $('.memberfun-semina-document-item').each(function(newIndex) {
            $(this).find('input[type="hidden"]').attr('name', 'memberfun_semina_documents[' + newIndex + '][id]');
            $(this).find('.memberfun-remove-document').data('index', newIndex);
        });
        
        // Update the documents data in the hidden field
        updateDocumentsData();
    }

    /**
     * Update documents data in the hidden field
     */
    function updateDocumentsData() {
        var documents = [];
        
        $('.memberfun-semina-document-item').each(function() {
            var id = $(this).find('input[type="hidden"]').val();
            var title = $(this).find('strong').text();
            var url = $(this).find('a:first').attr('href');
            
            documents.push({
                id: id,
                title: title,
                url: url
            });
        });
        
        $('#memberfun-semina-documents-data').val(JSON.stringify(documents));
    }

})(jQuery); 