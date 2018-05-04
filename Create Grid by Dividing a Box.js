/*
File: Create Grid by dividing a box
Description: This Java Script creates a grid of boxes from an existing box
*/

//import basic checks
if(typeof(isLayoutOpen) == "undefined")
{
	//import basic checks
	app.importScript(app.getAppScriptsFolder() + "/Dependencies/qx_validations.js");
	console.log("Loaded library for basic validation checks from application.");
}

if(typeof(setUnits) == "undefined")
{
	//import measurements
	app.importScript(app.getAppScriptsFolder() + "/Dependencies/qx_measurements.js");
	console.log("Loaded library for measurements from application.");
}

if(isLayoutOpen())
{
	if(isBoxSelected)
	{
		//Get all Selected Boxes from the Layout
		var box = getSelectedBox();
		if(!isBoxRotated(box))
		{
			//get the box width in pts
			var boxWidth = getBoxWidth(box);
			
			//get the box height in pts
			var boxHeight = getBoxHeight(box);
			
			if(box.getAttribute("box-content-type") == "text")
			{
				//get the horizontal text inset in pts
				var boxTextInsetH = getBoxHorizontalInsets(box);
				
				//get the vertical text inset in pts
				var boxTextInsetV = getBoxVerticalInsets(box);
			}
			else
			{
				//set the horizontal text inset to zero
				var boxTextInsetH = 0;
				
				//set the vertical text inset to zero
				var boxTextInsetV = 0;
			}
			//get the frame width in pts
			var boxBorderWidth = getBoxBorderWidth(box);
		
			//calculate the effective box width
			var effectiveBoxWidth = boxWidth - (boxTextInsetH + boxBorderWidth);
			
			//calculate the effective box height
			var effectiveBoxHeight = boxHeight - (boxTextInsetV + boxBorderWidth);
			
			//get the current horizontal measurement units of the layout
			var currHorzUnits= getUnits(box.style.qxLeft);
			
			//get the current vertical measurement units of the layout
			var currVertUnits= getUnits(box.style.qxTop);
			
			//input number of rows, columns and gutter widths
			var colInput = getValidInput(effectiveBoxWidth,  currHorzUnits,  "column");
			if(colInput != null)
			{
				var rowInput = getValidInput(effectiveBoxHeight, currVertUnits, "row");
				if(rowInput != null)
				{
					createGrid(colInput, rowInput, box, boxWidth, boxHeight);//all measurements in points
				}
			}
		}
	}
}


/*======================Functions used in the JavaScript=============================*/

//check if the box is rotated
function isBoxRotated(box){
	if(box.style.qxTransform != "rotate(0deg) skew(0deg)")
	{
		alert("The script cannot run on rotated or skewed boxes. \nPlease select another box!");
		return true;
	}
	else
	{
		return false;
	}
}

//function to calculate the width of the box in pts
function getBoxWidth(box){
	return roundOff((convertAnyUnitToPoints(box.style.qxRight)) - (convertAnyUnitToPoints(box.style.qxLeft)), 1000);
}

//function to calculate the height of the box in pts
function getBoxHeight(box){
	return roundOff((convertAnyUnitToPoints(box.style.qxBottom)) - (convertAnyUnitToPoints(box.style.qxTop)), 1000);
}

//function to calculate the horizontal box inset in pts
function getBoxHorizontalInsets(box){
	if(box.style.qxPadding == "")//if multiple insets are applied
		return roundOff((convertAnyUnitToPoints(box.style.qxPaddingLeft) + convertAnyUnitToPoints(box.style.qxPaddingRight)), 1000);
	else
		return roundOff((2 * convertAnyUnitToPoints(box.style.qxPadding)), 1000);
}

//function to calculate the horizontal box inset in pts
function getBoxVerticalInsets(box){
	if(box.style.qxPadding == "")//if multiple insets are applied
		return roundOff((convertAnyUnitToPoints(box.style.qxPaddingTop) + convertAnyUnitToPoints(box.style.qxPaddingBottom)), 1000);
	else
		return roundOff((2 * convertAnyUnitToPoints(box.style.qxPadding)), 1000);
}

//function to get the width of border applied on the box in pts
function getBoxBorderWidth(box){
		return roundOff((2* convertAnyUnitToPoints(box.style.qxBorderWidth)), 1000);
}

//gets the valid input for count and gap
function getValidInput(effectiveBoxDim, currUnits, countOf){
	var output= [];
	var flag =0;
	while(flag != 1){
		var count = getCount(countOf);
		if(count != null)
		{
			var inputStr = countOf+" gutter measurement\n\nExamples: 0.5in, 3pt etc.";
			var defVal = "1"+currUnits;
			var gap = getNumInputWithUnits(inputStr, defVal, currUnits, "0pt", effectiveBoxDim, true);
			if(gap != null)
			{
				//validate column number and gap
				if(isValidCountAndGap(count, gap, effectiveBoxDim))
				{
					output[0]= count;
					output[1]= gap;
					return output;
				}
			}
			else
			{
				return null;
			}
		}
		else
		{
			return null;
		}
	}
}

//gets valid count input for rows and columns
function getCount(countOf){
	var flag =0;
	while(flag != 1){
		var count = prompt("How many "+countOf+"s?\nWhole numbers only. Partial boxes are not available", "2");
		if(count == null)
			return null;
		else if(isInvalidCount(Number(count)))
			flag=0;
		else
			return Number(count);
	}
}

//checks if a given input of row and column count is integer or not
function isInvalidCount(count){
	if(!isInt(count)){
		alert("Please enter only whole numbers for count!");
		return true;
	}
	return false;
}

//checks if the count and gap measurements are valid or not
function isValidCountAndGap(count, gap, maxValue){
	if((count * gap) > maxValue)
	{
		alert("Values out of Range. Please decrease count or gap!");
		return false;
	}
	else
	{
		return true;
	}	
}

//creates a grid of boxes on the given input
function createGrid(colInput, rowInput, box, boxWidth, boxHeight){
	var columns= colInput[0];
	console.log("Number of columns: "+columns);
	var columnGutter= convertAnyUnitToPoints(colInput[1]);//only numeric value in pts
	console.log("Column Gutter width: "+ columnGutter+ "pt");
	var rows= rowInput[0];
	console.log("Number of rows: "+rows);
	var rowGutter= convertAnyUnitToPoints(rowInput[1]); 
	console.log("row Gutter width: "+ rowGutter+ "pt");
	//get the content type of the box
	var contentType = box.getAttribute("box-content-type");
	console.log("Box content type: "+ contentType);
	//get the page number of box
	var boxpage = box.style.qxPage;
	//calculating columnWidth and rowWidth
	var columnWidth= (boxWidth- (columns-1)*columnGutter)/columns;
	console.log("Column  width: "+ columnWidth);
	var rowWidth= (boxHeight - (rows-1)*rowGutter)/rows;
	console.log("row width: "+ rowWidth);
	//getting box offsets
	var bTop= convertAnyUnitToPoints(box.style.qxTop);
	var bLeft= convertAnyUnitToPoints(box.style.qxLeft);
	
	//declaring an array of boxes
	var boxarr= [];
	//creating boxes
	for(var i= 0; i<rows; i++)
	{
		for(var j=0; j<columns; j++)
		{
			boxarr[columns*i +j]= document.createElement("qx-box");
			boxarr[columns*i +j].setAttribute("box-content-type", contentType);
			boxarr[columns*i +j].style.qxTop= (bTop + ((rowWidth+ Number(rowGutter))*i)) + "pt";
			boxarr[columns*i +j].style.qxBottom= (bTop + ((rowWidth+ Number(rowGutter))*i)+ rowWidth) + "pt";
			boxarr[columns*i +j].style.qxLeft= (bLeft + ((columnWidth+ Number(columnGutter))*j)) + "pt";
			boxarr[columns*i +j].style.qxRight= (bLeft + ((columnWidth+ Number(columnGutter))*j)+ columnWidth) + "pt";
			boxarr[columns*i +j].style.qxPage = boxpage;
			box.parentNode.appendChild(boxarr[columns*i +j]);
		}
	}
}