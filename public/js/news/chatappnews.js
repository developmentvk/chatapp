$(document).ready(function(){
    LoadData('.paginate');
    return GetResult(); 
});
const secret = require('../secret/secretfile');
function GetResult(){
    $.ajax({
        url: 'http://content.guardianapis.com/search?q=cricket&api-key=fad433c5-b338-44c2-a7bf-9251c5fd1978',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            var results = '';
            console.log(data.response.results);
            $.each(data.response.results, function(i){
                results += '<form class="paginate">';
                results += '<div class="col-md-12 news-post">';
                results += '<div class="row">';
                
                results += '<a href='+data.response.results[i].webUrl+' target="_blank" style="color:#4aa1f3; text-decoration:none;">';
                results += '<div class="col-md-12">';
                results += '<h4 class="news-date">'+new Date(Date.parse(data.response.results[i].webPublicationDate)).toDateString()+'</h4>';
                results += '<h3>' + data.response.results[i].sectionName+'</h3>';
                results += '<p class="news-text">'+data.response.results[i].webTitle+'</p>';
                results += '</div>';
                results += '</a>';
                results += '</div>';
                results += '</div>';
                results += '</form>';
            });
            
            $('#newsResults').html(results);
            $('.paginate').slice(0, 10).show();
        }
    })
}

function LoadData(divClass){
    $('#loadMore').on('click', function(e){
        e.preventDefault();
        
        $(divClass+":hidden").slice(0, 3).slideDown();
        
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 2000);
    });
    
    $('#linkTop').click(function(){
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });
}

































