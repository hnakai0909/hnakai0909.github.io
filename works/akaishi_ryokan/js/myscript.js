$(document).ready(function(){

    // Set up our options for the slideshow...
    var myOptions = {
        noImages: 10,
        path: "./img/slide/",  // Relative path with trailing slash.
        captions: {                 
            1:'<span class="slicap"><span class="hbig">枯</span>山水の庭園を縁側から眺める。</span>',
            2:'<span class="slicap"><span class="hbig">本</span>格的な日本庭園は「風流」そのもの。</span>',
            3:'<span class="slicap"><span class="hbig">好</span>奇心を誘う建物。</span>',
            4:'<span class="slicap"><span class="hbig">酒</span>樽の並ぶ蔵からはほんのりと麹の匂い。</span>',
            5:'<span class="slicap"><span class="hbig">露</span>天風呂で紅葉狩り。</span>',
            6:'<span class="slicap"><span class="hbig">玄</span>関で旅人をお出迎え。</span>',
            7:'<span class="slicap"><span class="hbig">廊</span>下にも心の和らぎ。</span>',
            8:'<span class="slicap"><span class="hbig">和</span>室は広々12畳。一日の旅の疲れを癒やします。</span>',
            9:'<span class="slicap"><span class="hbig">囲</span>炉裏を囲んで郷土料理を愉しむ。</span>',
            10:'<span class="slicap"><span class="hbig">こ</span>っそりお忍びも。</span>'
        },
        links: {
            1:"",2:"",3:"",4:"",5:"",6:"",7:"",8:"",9:"",10:""
        },
        linksOpen:'newWindow',
        timerInterval: 6000,
	randomise: false // Start with random image?
    };

    $('#example_1_container').easySlides(myOptions);

})