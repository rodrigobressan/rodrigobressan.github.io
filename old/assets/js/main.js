jQuery(document).ready(function($) {

    $('.level-bar-inner').css('width', '0');
    
    $(window).on('load', function() {

        $('.level-bar-inner').each(function() {
        
            var itemWidth = $(this).data('level');
            
            $(this).animate({
                width: itemWidth
            }, 800);
            
        });

    });
    

});

function toggleExperienceDetails(id) {
    $("#experience_details_" + id).slideToggle("fast");
}

function toggleEducationDetails(id) {
    $("#education_details_" + id).slideToggle("fast");
}


