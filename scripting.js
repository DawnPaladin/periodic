var StarWarsTropes = ['#5ma', '#C', '#Emp', '#Dra', '#Neo', '#Fai'];
var MassEffectTropes = ['#H', '#Stw', '#Om', '#Eld', '#Jt'];
var DilbertTropes = ['#Sta', '#Sq', '#Hil'];
var AvatarTropes = ['#5ma', '#Stw', '#Emp', '#Hft', '#Det', '#Av', '#Rq'];
var MLPTropes = ['#Bbw', '#Ccl', '#Gh', '#Wb', '#Det', '#Ag', '#Ae'];
var GurrenLagannTropes = ['#Ih', '#Ham', '#Det', '#Kh', '#Dyn', '#Ag', '#Bwb', '#Bti', '#Stw'];
var DeathNoteTropes = ['#Av', '#Xan', '#C', '#Ah'];
var FireflyTropes = ['#Lrg', '#Mal', '#Rcy', '#Sbn'];
var WallETropes = ['#Ae', '#Mcg', '#Wb', '#Rar', '#Ag', '#Rcy'];
var GhostbustersTropes = ['#5ma', '#Mad', '#Iac', '#Hil'];

var categoryColors = ['#BCBEC0', '#E4D1BA', '#EFE5D8', '#E6E7E8', '#C6E8F0', '#CAE4B7', '#83C66F', '#FABBA3', '#FCD7C8', '#FBF7C1', '#FDBE68', '#F6ADCD'];
var hoveredCategoryColors = ['#929A9D', '#F49F3C', '#FCBF80', '#B7CCEA', '#96D9F2', '#B3D78A', '#55B948', '#F6926A', '#F89E72', '#FCF18B', '#FBAD43', '#F388A2'];
var columnDelay = [0, 200, 400, 500, 1100, 1200, 1300, 1300, 1400, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2100, 2300, 2200, 2300];
var fadeInTime = 250;
var fadeOutTime = 500;
var pinnedTropes = [];
var pinnedStoryMolecule = null;

function checkCellID(cell, list) {
	for (var i = list.length - 1; i >= 0; i--) {
		if(cell.is(list[i])) return true;
	};
	return false;
}

function highlightCell(cell) {
	var classString = $(cell).attr("class");
	var category = Number(classString.substring(13,15));
	var categoryIndex = category - 1; //because indexes count from 0, and my categories count from 1
	$(cell).animate({backgroundColor: hoveredCategoryColors[categoryIndex]}, fadeInTime);
}

function dehighlightCell(cell) {
	var classString = $(cell).attr("class");
	var category = Number(classString.substring(13,15));
	var categoryIndex = category - 1; //because indexes count from 0, and my categories count from 1
if (!checkCellID($(cell), pinnedTropes)) {
		$(cell).animate({backgroundColor: categoryColors[categoryIndex]}, fadeOutTime);
	};
}

function highlightCells(arrayOfCells) {
	for (var i = arrayOfCells.length - 1; i >= 0; i--) {
		highlightCell(arrayOfCells[i]);
	};
}

function dehighlightCells(arrayOfCells) {
	for (var i = arrayOfCells.length - 1; i >= 0; i--) {
		dehighlightCell(arrayOfCells[i]);
	};
}

function fadeOutExcept(arrayOfCells) {
	$('.cell').stop(false, true); //hurries animations in progress
	$('.currentStory').removeClass('currentStory');
	for (var i = arrayOfCells.length - 1; i >= 0; i--) {
		$(arrayOfCells[i]).addClass('currentStory');
	};
	$('.cell').not('.currentStory').fadeTo(fadeOutTime, .5);
	$('.currentStory').fadeTo(fadeInTime, 1);
}

function fadeIn() {
	$('.currentStory').removeClass('currentStory');
	$('.cell').fadeTo(fadeOutTime, 1);
}

function pulseTable() {
	function pulseColumn(columnObject, initialDelay) {
		function pulse (cell, delay) {
			var classString = $(cell).attr("class");
			var category = Number(classString.substring(13,15));
			var categoryIndex = category - 1; //because arrays count from 0, and my categories count from 1
			if (!checkCellID($(cell), pinnedTropes)) {
				$(cell).delay(delay).animate({backgroundColor: hoveredCategoryColors[categoryIndex]}, fadeInTime, function(){
					$(cell).animate({backgroundColor: categoryColors[categoryIndex]}, fadeOutTime)
				});
			};
		}
		$(columnObject).fadeTo(0, 100);
		var columnLength = $(columnObject).children('a').length;
		for (var i = 0; i < columnLength; i++) {
			var cellDelay = 50 * i + initialDelay;
			var currentCell = $(columnObject).find(".cell:eq(" + i + ")");
			pulse($(currentCell), cellDelay);
		};
	}
	tableWidth = $('#PToS').children('.column').length;
	for (var i = 0; i < tableWidth; i++) {
		var x = columnDelay[i] * 0.5;
		var currentColumn = $('#PToS').find(".column:eq(" + i + ")");
		pulseColumn($(currentColumn), x);
	};
}

function enableTestingFunctions() {
	$('#options').css('visibility', 'visible');
	var testingFrame = '<div id="previewWindow"><iframe id="tropePreview" src="" scrolling="no" sandbox=""></iframe></div>';
	var optionsDiv = '<div id="options"><input id="previewSwitch" type="checkbox"><label for="previewSwitch">Preview window</label><input id="alignmentCheckbox" type="checkbox"><label for="alignmentCheckbox">Are you blocking ads? (affects preview layout)</label><button id="test">Test</button></div>';
	$('body').append(testingFrame);
	$('#chartName').append(optionsDiv);
	$('#test').click(function(){ pulseTable(); });
}

var fadeInOnLoad = false;

$(document).ready(function() {
	if (fadeInOnLoad) {
		$('.cell, .columnLabel, .legend, .twoColumnLabel, .posterPlug, #licensing, #footer').fadeTo(0, 0);
		pulseTable();
		window.setTimeout(function() {
			$('.cell, .columnLabel, .legend, .twoColumnLabel, .posterPlug, #licensing, #footer')/*.delay(2500)*/.fadeTo(1500, 1);
		}, 3500);
	}
	pulseTable();
	setInterval(pulseTable, 60000); //pulse the table every 60 seconds

	$('.cell').hover(function(){ // mouse enters

		// This next bit of code runs the preview box. It was an idea I had where you could hover over a trope cell and see the first few lines of the trope page describing it, loaded in an iframe directly from TVTropes - you could learn about the trope without even clicking on it. Unfortunately, TVTropes has "breakout" code installed designed to prevent people from loading the site in an iframe; the sandboxing feature I found to get around that only works in Chrome. Also, because of the restrictions on cross-site scripting, finding the right spot on the TVTropes page was tricky; I couldn't consistently make the preview show up inside the preview box. This made the preview look terrible, so I disabled it. It probably would have caused undue server load, anyway. But I couldn't bring myself to scrap the entire feature, so all the code is still here. If you'd like to play with it, type enableTestingFunctions() in the JavaScript console and then check the box that appears.

		var previewBoxEnabled = $('#previewSwitch').is(':checked');
		if (previewBoxEnabled === true) { // alert('Preview box checked'); };

    		$('#previewWindow').css("visibility", "visible");
			$('#tropePreview').attr("src", $(this).parent().attr("href")); //change the contents of the preview window when user hovers over a cell
			var loc = $(this).offset(); //get location of hovered cell
			var previewWindowWidth = 610; // from style.css
			if(loc.left + 61 + previewWindowWidth < $(window).width()) { //if the preview window will not spill past the right edge of the browser window
				loc.left = loc.left + 61;
				$('#previewWindow').css({"border-left": "10px solid #58595B", "border-right": "none"});
			} else {
				loc.left = loc.left - previewWindowWidth - 10; // push the window left its width, plus the width of the right-side border it's about to get
				$('#previewWindow').css({"border-right": "10px solid #58595B", "border-left": "none"});
			}
			$('#previewWindow').offset(loc); //place preview window by hovered cell

			var adBlocked = $('#alignmentCheckbox').is(':checked');
	    	if(adBlocked === true) {
		        // adblocker active
		        $('#tropePreview').css("margin-top", "-190px");
			} else {
		        // no adblocker
		        $('#tropePreview').css("margin-top", "-260px");
	    	}
    	}

		highlightCell(this);

	}, function () { // mouse leaves
		$('#previewWindow').css("visibility", "hidden");
		dehighlightCell(this);
	});

	$('.molecule').click(function() {
		if (pinnedStoryMolecule) {
			if (pinnedStoryMolecule.get(0) == $(this).get(0)) { // Fires when the user clicks on the story that was already pinned. get(0) strips out the jQuery wrapper around an object so we can successfully compare DOM objects
				pinnedStoryMolecule.css('background-position', '');
				pinnedStoryMolecule.addClass('unlockedMolecule').removeClass('lockedMolecule');
				var previouslyPinnedTropes = pinnedTropes; // dehighlightCells() checks the pinnedTropes global variable and does not dehighlight the cells it flags. We need to move that data into a different variable before we call dehighlightCells().
				pinnedStoryMolecule = null;
				pinnedTropes = [];
				dehighlightCells(previouslyPinnedTropes);
				fadeIn();
			} else { // changing from one pinned molecule to another
				pinnedStoryMolecule.css('background-position', '');
				var previouslyPinnedTropes = pinnedTropes; // dehighlightCells() checks the pinnedTropes global variable and does not dehighlight the cells it flags. We need to move that data into a different variable before we call dehighlightCells().
				var pinnedStoryName = $(this).attr('id') + 'Tropes'; // get the name of the molecule that was clicked on
				pinnedTropes = window[pinnedStoryName]; //window[x] means "the variable whose name is stored in x"
				pinnedStoryMolecule.addClass('unlockedMolecule').removeClass('lockedMolecule');
				dehighlightCells(previouslyPinnedTropes, 0);
				// above: remove the previous pinning. below: set the new pinning
				pinnedStoryMolecule = $(this);
				pinnedStoryMolecule.css('background-position', 'top');
				pinnedStoryMolecule.addClass('lockedMolecule').removeClass('unlockedMolecule');
				highlightCells(pinnedTropes);
				fadeOutExcept(pinnedTropes);
			}
		} else { // pinning a molecule, no others are pinned
			pinnedStoryMolecule = $(this);
			pinnedStoryMolecule.css('background-position', 'top');
			pinnedStoryMolecule.addClass('lockedMolecule').removeClass('unlockedMolecule');
			var pinnedStoryName = $(this).attr('id') + 'Tropes';
			pinnedTropes = window[pinnedStoryName];
			highlightCells(pinnedTropes);
			fadeOutExcept(pinnedTropes);
		};
	});
});
