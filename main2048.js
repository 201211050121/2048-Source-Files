// JavaScript Document
var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var eny = 0;

$(document).ready(function() {
	prepareForMobile();
    newgame();
});

function prepareForMobile()
{
	if(documentWidth > 500)
	{
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}
	$("#grid-container").css('width',gridContainerWidth - 2*cellSpace);
	$("#grid-container").css('height',gridContainerWidth - 2*cellSpace);
	$("#grid-container").css('padding',cellSpace);
	$("#grid-container").css('border-radius',0.02*gridContainerWidth);
	
	$(".grid-cell").css("width", cellSideLength);
	$(".grid-cell").css("height", cellSideLength);
	$(".grid-cell").css("border-radius", 0.02*cellSideLength);
}

function newgame()
{
	//init
	init();
	//radom to num 2 or 4
	generateNumber();
	generateNumber();
}

function init()
{
	for ( var i = 0; i < 4; i++)
		for(var j = 0; j < 4; j++)
		{
			var gridcell = $('#grid-cell-'+i+"-"+j);
			gridcell.css('top', getPosTop(i, j));
			gridcell.css('left', getPosLeft(i, j));
		}
		
	for(var i = 0; i < 4; i++)
	{
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for(var j = 0; j < 4; j++)
		{
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}
	updateBoardView();
	score = 0;
	updatescore(score);
}

function updateBoardView()
{
	$(".number-cell").remove();
	for(var i = 0; i < 4; i++)
		for(var j = 0; j < 4; j++)
		{
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var thenumbercell = $("#number-cell-"+i+'-'+j);
			if(board[i][j] == 0)
			{
				thenumbercell.css('width','0px');
				thenumbercell.css('height','0px');
				thenumbercell.css('top',getPosTop(i,j)+ cellSideLength/2);
				thenumbercell.css('left',getPosLeft(i,j)+cellSideLength/2);
			}
			else
			{
				thenumbercell.css('width',cellSideLength);
				thenumbercell.css('height',cellSideLength);
				thenumbercell.css('top',getPosTop(i,j));
				thenumbercell.css('left',getPosLeft(i,j));
				thenumbercell.css('background-color',getNumberGroundColor(board[i][j]));
				thenumbercell.css('color',getNumberColor(board[i][j]));
				thenumbercell.text(getTextValue(board[i][j]));
			}
			hasConflicted[i][j] = false;
		}
		$(".number-cell").css("line-height",cellSideLength + 'px');
		$(".number-cell").css("font-size", 0.2*cellSideLength + 'px');
}

function generateNumber()
{
	if(nospace(board))
	return false;
	//position
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));
	var times = 0;
	while(times < 50)
	{
		if(board[randx][randy] == 0)
		   break;
		 var randx = parseInt(Math.floor(Math.random() * 4));
	     var randy = parseInt(Math.floor(Math.random() * 4));
		 
		 times++;
	}
	if(times == 50)
	{
		for(var i = 0; i < 4; i++)
		{
			for(var j = 0; j < 4; j++)
			if(board[i][j] == 0)
			{
				randx = i;
				randy = j;
			}
		}
	}
	//number
	var randNumber = Math.random() < 0.5?2:4;
	//display
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx, randy, randNumber);
   return true;
}

$(document).keydown(function (event)
{
	
	switch(event.keyCode)
	{
		case 37: //left
		event.preventDefault();
			if(moveLeft())
			{
				setTimeout("generateNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		break;
		case 38: //up
		event.preventDefault();
		if(moveUp())
			{
				setTimeout("generateNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		break;
		case 39: //right
		event.preventDefault();
		if(moveRight())
			{
				setTimeout("generateNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		break; 
		case 40: //down
		event.preventDefault();
		if(moveDown())
			{
				setTimeout("generateNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		break;
		default: //其他
		break;
	}
});

document.addEventListener('touchstart',function(event)
{
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
	
	var deltax = endx - startx;
	var deltay = endy - starty;
	if(Math.abs(deltax) < 0.2*documentWidth && Math.abs(deltay) < 0.2*documentWidth)
	return;
	
	if(Math.abs(deltax) >= Math.abs(deltay) ) //x
	{
		if(deltax > 0)   //right
		{
			if(moveRight())
			{
				setTimeout("generateNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}
		else            //left
		{
			if(moveLeft())
			{
				setTimeout("generateNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}
	}
	else    //y
	{
		if(deltay > 0)   //down
		{
			if(moveDown())
			{
				setTimeout("generateNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}
		else                 //up
		{
			if(moveUp())
			{
				setTimeout("generateNumber()", 210);
				setTimeout("isgameover()", 300);
			}
		}
	}
});

document.addEventListener("touchmove",function(event)
{
	event.preventDefault();
}
);


document.addEventListener('touchend',function(event)
{
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
});

function isgameover()
{
	if(nospace(board) && nomove(board))
	{
		gameover();
	}
}

function gameover()
{
	if(score < 10000)
	{
		alert("Duang! 叔叔，我们不约$_$");
	}
	else if(score >= 10000)
	{
		alert("Duang! 叔叔，我们约么^_^");
	}
}

function nomove(board)
{
	if(canMoveLeft(board) ||
	   canMoveUp(board) ||
	   canMoveRight(board) ||
	   canMoveDown(board))
	   return false;
	  return true;
}

function moveLeft()
{
	if(!canMoveLeft(board))
		return false;
	//moveleft
	for(var i = 0; i < 4; i++)
	{
		for(var j = 1; j < 4; j++)
		{
			if(board[i][j] != 0)
			{
				for(var k = 0; k < j; k++)
				{
					if(board[i][k] == 0 && noBlockHorizontal(i, k, j, board) && hasConflicted[i][k] == false)
					//move;
					{
					showMoveAnimation(i,j,i,k);
					board[i][k] = board[i][j];
					board[i][j] = 0;
					continue;
					}
			else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && hasConflicted[i][k] == false)
			{
			//move
			showMoveAnimation(i,j,i,k);
			//add
			board[i][k] += board[i][j];
			board[i][j] = 0; 
			//add score
			score += board[i][k];
			updatescore(score);
			hasConflicted[i][k] = true;
			continue;
			}
				}
			}
		}
	}
	setTimeout("updateBoardView()",220);
	return true;
}
function moveUp()
{
	if(!canMoveUp(board))
		return false;
	//moveleft
	for(var j = 0; j < 4; j++)
	{
		for(var i = 1; i < 4; i++)
		{
			if(board[i][j] != 0)
			{ 
				for(var k = 0; k < i; k++)
				{
					if(board[k][j] == 0 && noBlockVertical(j, k, i, board) && hasConflicted[k][j] == false)
					//move;
					{
					showMoveAnimation(i,j,k,j);
					board[k][j] = board[i][j];
					board[i][j] = 0;
					continue;
					}
			  else if(board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && hasConflicted[k][j] == false)
			{
			//move
			showMoveAnimation(i,j,k,j);
			//add
			board[k][j] += board[i][j];
			board[i][j] = 0; 
			//add score
			score += board[k][j];
			updatescore(score);
			hasConflicted[k][j] = true;
			continue;
			}
				}
			}
		}
	}
	setTimeout("updateBoardView()",220);
	return true;
}

function moveRight()
{
	if(!canMoveRight(board))
		return false;
	//moveleft
	for(var i = 0; i < 4; i++)
	{
		for(var j = 2; j >= 0; j--)
		{
			if(board[i][j] != 0)
			{
				for(var k = 3; k > j; k--)
				{
					if(board[i][k] == 0 && noBlockHorizontal(i, j, k, board) && hasConflicted[i][k] == false)
					//move;
					{
					showMoveAnimation(i,j,i,k);
					board[i][k] = board[i][j];
					board[i][j] = 0;
					continue;
					}
			else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && hasConflicted[i][k] == false)
			{
			//move
			showMoveAnimation(i,j,i,k);
			//add
			board[i][k] += board[i][j];
			board[i][j] = 0; 
			//add score
			score += board[i][k];
			updatescore(score);
			hasConflicted[i][k] = true;
			continue;
			}
				}
			}
		}
	}
	setTimeout("updateBoardView()",220);
	return true;
}
function moveDown()
{
	if(!canMoveDown(board))
		return false;
	//moveleft
	for(var j = 0; j < 4; j++)
	{
		for(var i = 2; i >= 0; i--)
		{
			if(board[i][j] != 0)
			{
				for(var k = 3; k > i; k--)
				{
					if(board[k][j] == 0 && noBlockVertical(j, i, k, board) && hasConflicted[k][j] == false)
					//move;
					{
					showMoveAnimation(i,j,k,j);
					board[k][j] = board[i][j];
					board[i][j] = 0;
					continue;
					}
					else if(board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && hasConflicted[k][j] == false)
			{
			//move
			showMoveAnimation(i,j,k,j);
			//add
			board[k][j] += board[i][j];
			board[i][j] = 0; 
			//add score
			score += board[k][j];
			updatescore(score);
			hasConflicted[k][j] = true;
			continue;
			}
				}
			}
		}
	}
	setTimeout("updateBoardView()",220);
	return true;
}

