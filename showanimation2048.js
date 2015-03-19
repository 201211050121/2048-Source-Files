function showNumberWithAnimation( i , j , randNumber ){

    var numberCell = $('#number-cell-' + i + "-" + j );

    numberCell.css('background-color',getNumberGroundColor( randNumber ) );
    numberCell.css('color',getNumberColor( randNumber ) );
    numberCell.text(getTextValue(randNumber));

    numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop( i , j ),
        left:getPosLeft( i , j )
    },50);
}

function showMoveAnimation(fromx,fromy, tox, toy)
{
	var numbercell = $("#number-cell-"+fromx+'-'+fromy);
	numbercell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy)
		},200);
}

function updatescore(score)
{
	$("#score").text(score);
}
