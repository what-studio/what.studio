// toggle visibility for css3 animations
var slides = null
var slideTemplate = null

$(document).ready(function() {
    slideTemplate = $('#slide-template').html().trim()
    $('#slide-template').remove()
    var now = new Date()
    $.getJSON('ndc.json?t='+now.getTime(), function(data){
        slides = data
        addSlides()
        $('#load-more .btn').bind('click', addSlides);
    });
    $('header').addClass('visibility');

    var language = navigator.languages
        ? navigator.languages[0]
        : (navigator.language || navigator.userLanguage)
    if(language.toLowerCase().indexOf('ko') > -1 ||
       language.toLowerCase().indexOf('kr') > -1){
        $('#blog-link').attr('href', 'https://ko.blog.durango.what.studio')
    }
});

//carousel animation
$(window).load(function () {
    $('header').addClass('animated fadeIn');
});

// Fixed navbar
$(window).scroll(function () {
    //animations
    var headerPos = $('#publication').offset().top;
    var topOfWindow = $(window).scrollTop();
    if(headerPos < topOfWindow+35){
        $('.navbar-default').addClass('fixed-to-top');
    }else{
        $('.navbar-default').removeClass('fixed-to-top');
    }
});

function setHash (name) {
    window.location.hash = name
}

var masonryInit = false
function addSlides() {
    var count = 10
    var img = $('<img />', { width: '100%' })
    var dummy = '<div class="dummy-rectangle"><div class="dummy"></div><div class="rectangle"></div></div>'
    while(count > 0){
        var index = slides.length -1
        if(index < 0) break;

        // create each slide template
        var slide = slideTemplate
        slide = slide.replace(/{title}/g, slides[index].title)
                     .replace(/{speaker}/g, slides[index].speaker)
                     .replace(/{type}/g, slides[index].type)
                     .replace(/{description}/g, slides[index].description)
                     .replace(/{link}/g, slides[index].link || slides[index].pressLink || 'javascript:false')

        img = img.attr('src', slides[index].profile || '/img/no_image.png')
        slide = slide.replace(/{profile}/g, img.prop('outerHTML'))

        var slideElem = ''
        if(slides[index].slide){
            img = img.attr('src', slides[index].slide)
            slideElem = img.prop('outerHTML')+dummy
        }
        slide = slide.replace(/{slide}/g, slideElem)

        // append to list
        var elems = $.parseHTML(slide)
        $(elems).find('.card-description').on('click', function(e){
            $(this).hasClass('ellipsis') ? $(this).removeClass('ellipsis'): $(this).addClass('ellipsis')
            $('.grid').masonry()
        })
        if(!masonryInit){
            $('#slides').append(elems)
        }else{
            $('.grid').append(elems).masonry('appended', elems, true);
        }
        slides.pop()
        count--
    }
    if(slides.length <= 0) {
        $('#load-more').remove()
    }
    if(!masonryInit){
        $('.grid').masonry({
            columnWidth: '.grid-sizer',
            itemSelector: '.grid-item',
            percentPosition: true
        });
        masonryInit = true
    }
}
