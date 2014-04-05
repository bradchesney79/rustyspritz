var RustySpritz = function (uniqueInstanceId) {
    var that = this,
        spritzContainer = $('#' + uniqueInstanceId)[0];
    //let's create a property to represent the element we will be working in
    this.uniqueInstanceId = uniqueInstanceId;
    this.spritzContainer = spritzContainer;

    //let's set up our object's configurable default properties
    var wpm = 650,
        fontColor = 'FFFFFF',
        locusColor = 'DE7102',
        backColor = '000000';
    this.wpm = wpm;
    this.fontColor = fontColor;
    this.locusColor = locusColor;
    this.backColor = backColor;

    //and a few default processing properties
    var status = 'waiting';
    this.status = status;
    var currentWord = 0;
    this.currentWord = currentWord;
    var wordsArray = [[]];
    this.wordsArray = wordsArray; //won't know this until we get some text to be parsed
    var totalWords = '';
    this.totalWords = totalWords; //won't know this until we get some text to be parsed
    var wordPartsArray = [[]];
    this.wordPartsArray = wordPartsArray; //won't know this until we get some text to be parsed

    //now we will begin building the structure of the tool using the base element
    //$(<body>).css({'height': '101%'});
    //$(<body>).css({'overflow-y': 'scroll'});
    //$(spritzContainer).css('display','none');


    var part = [];
    var wordsDiv =  $('<div>').attr('id', 'words' + uniqueInstanceId).appendTo(spritzContainer);
    for (var i = 0; i < 3; i++) {
        part[i] = $('<span>').attr({'id': 'part' + i + uniqueInstanceId,'class': 'spritzed'}).appendTo(wordsDiv);
    }
    var buttonDiv = $('<div>').attr('id', 'buttons' + uniqueInstanceId).appendTo(spritzContainer);
    var readButton = $('<button>').attr('id', 'read' + uniqueInstanceId).html('Read').appendTo(buttonDiv);
    var pauseButton = $('<button>').attr('id', 'pause' + uniqueInstanceId).html('Pause/Options').appendTo(buttonDiv);
    var restartButton = $('<button>').attr('id', 'restart' + uniqueInstanceId).html('Restart').appendTo(buttonDiv);
    var settingsDiv = $('<div>').attr('id', 'settings' + uniqueInstanceId).appendTo(spritzContainer);
    var wpmLabel = $('<label>').attr('for', 'wpm' + uniqueInstanceId).html('WPM: ').appendTo(settingsDiv);
    var wpmInput = $('<input>').attr({'id': 'wpm' + uniqueInstanceId,'size': 4,'maxlength': 4}).val(wpm).appendTo(settingsDiv);
    var statusDiv = $('<div>').attr('id', 'status' + uniqueInstanceId).appendTo(spritzContainer);
    var currentWordLabel = $('<label>').attr('for', 'current' + uniqueInstanceId).html('Current Word: ').appendTo(statusDiv);
    var currentWordInput = $('<input>').attr({'id': 'current' + uniqueInstanceId,'maxlength': 6}).val(currentWord).appendTo(statusDiv);
    var totalWordsLabel = $('<label>').attr('for', 'total' + uniqueInstanceId).html('Total Words: ').appendTo(statusDiv);
    var totalWordsInput = $('<input>').attr({'id': 'total' + uniqueInstanceId,'maxlength': 6}).appendTo(statusDiv);
    var colorsDiv = $('<div>').attr('id', 'colors' + uniqueInstanceId).appendTo(statusDiv);
    var fontColorLabel = $('<label>').attr('for', 'fontColor' + uniqueInstanceId).html('Text: #').appendTo(colorsDiv);
    var fontColorInput = $('<input>').attr({'id': 'fontColor' + uniqueInstanceId,'size': 6,'maxlength': 6}).val(fontColor).appendTo(colorsDiv);
    var locusColorLabel = $('<label>').attr('for', 'locusColor' + uniqueInstanceId).html('Locus: #').appendTo(colorsDiv);
    var locusColorInput = $('<input>').attr({'id': 'locusColor' + uniqueInstanceId,'size': 6,'maxlength': 6}).val(locusColor).appendTo(colorsDiv);
    var backColorLabel = $('<label>').attr('for', 'backColor' + uniqueInstanceId).html('Background: #').appendTo(colorsDiv);
    var backColorInput = $('<input>').attr({'id': 'backColor' + uniqueInstanceId,'size': 6,'maxlength': 6}).val(backColor).appendTo(colorsDiv);
    var contentDiv = $('<div>').attr('id', 'content' + uniqueInstanceId).appendTo(spritzContainer);
    var textInput = $('<textarea>').attr({'id': 'text' + uniqueInstanceId,'cols': 50,'rows': 8}).appendTo(contentDiv);

    //How 'bout some CSS on all those things so far

    $(spritzContainer).css({'display': 'block', 'height': '300px', 'margin-left': 'auto', 'margin-right': 'auto', 'padding': '10px', 'background-color': '#' + backColor});
    $(wordsDiv).css({'margin-left': 'auto', 'margin-top': '10px', 'margin-right': 'auto', 'margin-bottom': '10px', 'padding': '5px', 'border-style': 'dotted','border-width':'2px', 'border-color':'#777777', 'width':'400px', 'height': '40px'});
    $(spritzContainer).find('span').css({'font-family': 'Arial','color': '#' + fontColor, 'font-size':'34px'});
    $(part[1]).css('color', '#' + locusColor);
    $(buttonDiv).css({'height':'34px'});
    $('#' + uniqueInstanceId + ' label').css({'font-family': 'Arial','color': '#' + fontColor});


    //And now the CSS to get everyone ready to start
    $(readButton).hide();
    $(pauseButton).hide();
    $(restartButton).hide();
    $(totalWordsLabel).hide();
    $(totalWordsInput).hide();


    //Add some required event handlers

    $(textInput).change(function () {
            currentWord = 0;
            $(currentWordInput).val(currentWord);
        if ($.trim($(textInput).val()).length > 0) {
            processWords($(textInput).val());
            $(readButton).show();
            $(pauseButton).hide();
            $(restartButton).hide();
        }
        else {
            $(readButton).hide();
            $(pauseButton).hide();
            $(restartButton).hide();
            $(totalWordsLabel).hide();
            $(totalWordsInput).hide();
        }
    });

    $(wpmInput).change(function () {
        if ($.trim($(wpmInput).val()).length > 0) {
            wpm = $.trim($(wpmInput).val());
        }
    });


    $(currentWordInput).change(function () {
        if (status == 'waiting' && $.trim($(currentWordInput).val()).length > 0 && $.trim($(currentWordInput).val()) <= totalWords) {
            currentWord = $.trim($(currentWordInput).val());
            $(readButton).show();
            $(pauseButton).hide();
            $(settingsDiv).show();
            $(statusDiv).show();
            $(contentDiv).show();
            status = 'waiting';
        }
    });

    $(fontColorInput).change(function () {
        if ($.trim($(fontColorInput).val()).length > 0) {
            fontColor = $.trim($(fontColorInput).val());
            $(spritzContainer).find('span').css({'font-family': 'Arial','color': '#' + fontColor});
            $(part[1]).css('color', '#' + locusColor);
            $('#' + uniqueInstanceId + ' label').css({'font-family': 'Arial','color': '#' + fontColor});
        }
    });

    $(locusColorInput).change(function () {
        if ($.trim($(locusColorInput).val()).length > 0) {
            locusColor = $.trim($(locusColorInput).val());
            $(part[1]).css('color', '#' + locusColor);
        }
    });


    $(backColorInput).change(function () {
        if ($.trim($(backColorInput).val()).length > 0) {
            backColor = $.trim($(backColorInput).val());
            $(spritzContainer).css('background-color', '#' + backColor);
        }
    });

    $(readButton).click(function () {
        $(readButton).hide();
        $(pauseButton).show();
        $(restartButton).show();
        $(settingsDiv).hide();
        $(statusDiv).hide();
        $(contentDiv).hide();
        status = 'reading';
        read();
    });

    $(pauseButton).click(function () {
        $(buttonDiv).show();
        $(readButton).show();
        $(pauseButton).hide();
        $(restartButton).show();
        $(settingsDiv).show();
        $(statusDiv).show();
        $(contentDiv).show();
        status = 'waiting';
    });

    $(restartButton).click(function () {
        currentWord = 0;
        that.currentWord = currentWord;
        $(currentWordInput).val(currentWord);
        if (status == 'waiting') {
            $(readButton).show();
        }
        if (status == 'reading') {
            $(pauseButton).show();
        }
        
    });
  

    var processWords = function (words) {

        var wordArray = $.trim(words).split(/\s+/);

        wordPartsArray = setWordPartsArray(wordArray);
        totalWords = wordArray.length;

        $(totalWordsInput).val(totalWords); 
        $(totalWordsLabel).show(); 
        $(totalWordsInput).show();
  
    };
   
    var setWordPartsArray = function (wordArray) {
        var parts = [];
   
        for (var i = 0; i < wordArray.length; i++) { 
            var center = Math.floor(wordArray[i].length / 2), 
            front = [], 
            locus, 
            end = [], 
            letters = wordArray[i].toString().split(''); 
            parts[i] = []; 
            for (var j = 0; j < letters.length; j++) {

                if (j < center) {
                    front.push(letters[j]);
                }
                if (j == center) {
                    locus = letters[j]; 
                }
                if (j > center) {
                    end.push(letters[j]); 
                }
            }
   
            if (front.length > 0) {
                parts[i][0]=front.join('');
            } 
            else { 
                parts[i][0]=''; 
            }
            parts[i][1]=locus; 
            if (end.length > 0) {
                parts[i][2]=end.join(''); 
            }
            else {
                parts[i][2]=''; 
            }
        } 
        return parts; 
    };

    var showWordParts = function (wordIndexToShow) {
        $('.spritzed').css({'visibility': 'hidden'});
        for (var k = 0; k < 3; k++) {
            $(part[k]).html(wordPartsArray[wordIndexToShow][k]);
        }
        //adjust the position via css
        //the div width is 400px because we set it to be so initially
        
        //get the width of the locus, divide it by two
        var halfLocusWidth = $(part[1]).width() / 2;
        
        //get the width of part0
        var part0Width = $(part[0]).width();
        //subtract half of the locus and part one from the div width
        //set the left margin of part1 equal to the difference
        
        $(part[0]).css({'margin-left': (200 - part0Width)});
        //$(part[0], part[1], part[2]).each().css({'visibility': 'visible'});
        $('.spritzed').css({'visibility': 'visible'});
    };
    
    var wait = function(time,func) {
        $('.spritzed').css({'visibility': 'hidden'});
        setTimeout(read,20);
    };
        
    var read = function() {
        if (currentWord <= totalWords && status == 'reading') {
            $(currentWordInput).val(currentWord);
            showWordParts(currentWord);
            currentWord++;
            if (currentWord == totalWords) {
                $(currentWordInput).val(0);
                $(readButton).show();
                $(pauseButton).hide();
                $(restartButton).show();
                $(settingsDiv).show();
                $(totalWordsLabel).show();
                $(totalWordsInput).show();
                $(statusDiv).show();
                $(contentDiv).show();
                status = 'stopped';
            }
            else {
                setTimeout(wait, 60000/wpm - 20);
            }
        }
    };
};