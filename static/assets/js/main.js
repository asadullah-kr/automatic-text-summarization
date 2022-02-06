$(document).ready(function() {
    $('#inputStr').on('input paste change keydown keypress keyup mousedown click mouseup', function() { 
        var textStr = $('#inputStr').val();
        if (!textStr.trim()) {
            $("#textWordCountDiv").fadeOut();
        } else {
            var wordCount = getNumOfWords( textStr );
            if(wordCount > 0){
               $("#textWordCountDiv").fadeIn();
               $("#textWordCount").text(wordCount);
            } else {
                $("#textWordCountDiv").fadeOut();
            }
        }
    });

    $("#methodInput").change(function() {
        if( parseInt($("#methodInput").val()) == 2){
            $('.sizeElements').hide();
        } else {
            $('.sizeElements').show();
        }
    });

    $("#btnSubmit").click(function() {
        $("#loadingDiv").show();
        $("#btnSubmit").prop('disabled', true);
        $('#summary').empty();
        $("#summaryWordCountDiv").hide();
        var textstr = $("#inputStr").val();
        var summarySize = $('input[name="summarySize"]:checked').val();
        var method = $("#methodInput").val();
       
        $.ajax({
            url: baseUrl,
            type: "post",
            data: {
                'textstr'   : textstr,
                'method'    : parseInt(method),
                'summarySize' : summarySize
            }
        }).then(function(data) {
            $("#btnSubmit").prop('disabled', false);
            $("#loadingDiv").hide();
            processSummary(textstr, data.summary);
        });

  });
});

function getNumOfWords(sentences){
    var wordCount = sentences.replace(/^[\s,.;]+/, "").replace(/[\s,.;]+$/, "").split(/[\s,.;]+/).length;
    return wordCount;
}


function processSummary(textstr, summaryData, ) {

    $('#summary').empty();

    if (summaryData.isArray) {

        var summary = document.createElement('h5');
        summary.innerHTML = "<b>Summary</b>:<br />";
        $('#summary').append(summary);

        var uList = document.createElement('ul');

        for (var index in summaryData) {
            var listElement = document.createElement('li');
            listElement.innerHTML = summaryData[index];
            uList.appendChild(listElement);
        }

        $('#summary').append(uList);

    } else {
        var summary = document.createElement('p');
        summary.innerHTML = "<b>Summary</b>: " + summaryData;
        $('#summary').append(summary);
        if (!summaryData.trim()) {
             $("#summaryWordCountDiv").fadeOut();
        } else {
            var wordCount = getNumOfWords( summaryData );
            if(wordCount > 0){
                $("#summaryWordCountDiv").fadeIn();
                $("#summaryWordCount").text(wordCount);
            } else {
                $("#summaryWordCountDiv").fadeOut();
            }
        }

    }

    $('#summary').hide().fadeIn(1000);
}