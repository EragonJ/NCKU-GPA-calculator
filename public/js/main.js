$(document).ready(function() {

    var allGPA = 0,
        allCredits = 0,
        finalGPA = 0,
        semesterNames = getSemesterNames();

    $.each(semesterNames, function(k, name) {

        var $html = getEachSemesterHTML( name );
        var info = getEachSemesterInfo( $html );

        allGPA += info[0];
        allCredits += info[1];
    });

    finalGPA = parseFloat(Math.round((allGPA / allCredits) * 1000)) / 1000;

    alert("所有GPA : " + allGPA + ", 所有學分 : " + allCredits + ", 最終GPA : " + finalGPA);
        
    // console.log('all GPA: '+ allGPA + ', all credits'+ allCredits);
});

function getSemesterNames() {

    var names = [];
    $('input:submit').each(function() {
        var name = $(this).val();
        // %A4W 上 %A4U 下
        name = name.replace('上', '%A4W');
        name = name.replace('下', '%A4U');
        names.push( name );
    });
 
    return names;
}

function getEachSemesterHTML( name ) {

    var $html = null,
        baseURL = 'https://qrys.sso2.ncku.edu.tw/ncku/qrys05.asp';

    
    $.ajax({
        url : baseURL + '?submit1=' + name,
        type : 'post',
        dataType : 'html',
        async : false,
        processData : false, // It's important to tell jQuery not to process the query string
        success : function( rawHTML ) {

            // console.log( 'Semester : '+ name );

            // http://stackoverflow.com/questions/4155680/jquery-object-from-complete-html-document
            rawHTML = rawHTML.replace(/(\/body|\/html)/i, "\/div")
                             .replace(/html/i, "div class='html'")
                             .replace(/body/i, "div class='body'");

            $html = $(rawHTML);
        }
    });

    return $html;
}

function getEachSemesterInfo( $html ) {

    var allGPA = 0,
        allCredits = 0;

    $html.find('form table[bgcolor="#66CCFF"] tr:gt(1):not(:last)').each(function(v) {

        /*
         *  Because :eq(n) which n starts from 0, I have to minus 1
         */
        var creditIndex = 6 - 1,
            pointsIndex = 8 - 1,
            credit = $(this).find('td:eq('+ creditIndex + ') b').html(),
            points = $(this).find('td:eq('+ pointsIndex + ') b').html();

            /*
             *  This will happen when :not(:last) selector is used - an empty td
             */
            if ( credit === null || points === null || !isValidPoints( points ) ) {
                return;
            }

            credit = parseInt(credit, 10);
            points = parseInt(points, 10);

            allGPA += getCombinedGPA( credit, points );
            allCredits += credit;

            // console.log('points : ' + points);
    });

    return [allGPA, allCredits];
}

function getCombinedGPA( credit, points ) {
    return credit * getGPA( points );
}

function getGPA( points ) {

    if ( points <= 49 ) {
        return 0;
    }
    else if ( points <= 59 ) {
        return 1;
    }
    else if ( points <= 69 ) {
        return 2;
    }
    else if ( points <= 79 ) {
        return 3;
    }
    else if ( points <= 100 ) {
        return 4;
    }
    else {
        throw "toGPA failed, passed in points : " + points;
    }
}

function isValidPoints( str ) {
    return !!str.match(/\d+/);
}
