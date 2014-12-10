/* This code magnified each cell on mouseover. It works, but has several problems:
	1. It activates on mouseover and then covers the hovered cell. Moving the mouse again, even small amounts, will cause it to un-zoom and then zoom again. In many cases the cell will not zoom at all.
	2. The zooming animation is not pleasing, because the way Chrome renders fractional-size fonts doesn't look great.
	3. Magnified cells appear aligned with the upper-left corner instead of centered on the original. Fixable if the other problems can be overcome. */

	$('.cell').hover(function(){ // mouse enters
		$(this).after($(this).clone().addClass("magnifiedCell").css({"position":"absolute"}));
		var magnifiedCell = $(this).next();

		var normalCellWidth = 60;
		var normalCellHeight = 90;
		var normalIdentifierSize = 27;
		var normalNameSize = 11;
		var normalPopularitySize = 9;
		var magnificationMultiplier = 1.2;
		var magnifiedCellWidth = normalCellWidth * magnificationMultiplier;
		var magnifiedCellHeight = normalCellHeight * magnificationMultiplier;
		var magnifiedIdentifierSize = normalIdentifierSize * magnificationMultiplier;
		var magnifiedNameSize = normalNameSize * magnificationMultiplier;
		var magnifiedPopularitySize = normalPopularitySize * magnificationMultiplier;

		$(magnifiedCell).css("border-style", "solid");
		$(magnifiedCell).css("border-color", "black");

		$(magnifiedCell).animate({
			width: magnifiedCellWidth,
			height: magnifiedCellHeight
		}, 200).children(".tropeIdentifier").animate({
			fontSize: magnifiedIdentifierSize
		}, 200).end().children(".tropeName").animate({
			fontSize: magnifiedNameSize
		}, 200).end().children(".tropePopularity").animate({
			fontSize: magnifiedPopularitySize
		}, 200);

		var hoveredCellPosition = $(this).offset();
		// console.log(hoveredCellPosition);
		var magnifiedCellPosition = hoveredCellPosition.top + "px";
		// console.log(magnifiedCellPosition);
		$(magnifiedCell).offset(hoveredCellPosition);
		//console.log($(magnifiedCell));
	}, function () { // mouse leaves
		$(this).next().remove();
	});


	// Originally, hovering over a molecule would highlight the associated tropes. When I implemented pinning stories by clicking on them, having two sets of cells highlighted at once was confusing, so I removed the hovering functionality. The hoverIntent function is from http://cherne.net/brian/resources/jquery.hoverIntent.html, and it's quite useful.
	$('#StarWars').hoverIntent(function(){highlightCells(StarWarsTropes)}, function() {dehighlightCells(StarWarsTropes)});
	$('#MassEffect').hoverIntent(function(){highlightCells(MassEffectTropes)}, function() {dehighlightCells(MassEffectTropes)});
	$('#Dilbert').hoverIntent(function(){highlightCells(DilbertTropes)}, function() {dehighlightCells(DilbertTropes)});
	$('#Avatar').hoverIntent(function(){highlightCells(AvatarTropes)}, function() {dehighlightCells(AvatarTropes)});
	$('#MLP').hoverIntent(function(){highlightCells(MLPTropes)}, function() {dehighlightCells(MLPTropes)});
	$('#GurrenLagann').hoverIntent(function(){highlightCells(GurrenLagannTropes)}, function() {dehighlightCells(GurrenLagannTropes)});
	$('#DeathNote').hoverIntent(function(){highlightCells(DeathNoteTropes)}, function() {dehighlightCells(DeathNoteTropes)});
	$('#Firefly').hoverIntent(function(){highlightCells(FireflyTropes)}, function() {dehighlightCells(FireflyTropes)});
	$('#Wall-E').hoverIntent(function(){highlightCells(WallETropes)}, function() {dehighlightCells(WallETropes)});
	$('#Ghostbusters').hoverIntent(function(){highlightCells(GhostbustersTropes)}, function() {dehighlightCells(GhostbustersTropes)});

// Trying to get sprite animation working
	$('.molecule').click(function() {
		if (pinnedStoryMolecule) {
			if (pinnedStoryMolecule.get(0) == $(this).get(0)) { // Checks if the user has clicked on the story that was already pinned. get(0) strips out the jQuery wrapper around an object so we can successfully compare DOM objects
				pinnedStoryMolecule.css('background-position', 'top left');
				setTimeout(function(){ // Have to wait a bit to give the above line time to complete before we move on.
					pinnedStoryMolecule.css('transition-duration', '0.5s');
					pinnedStoryMolecule.css('background-position', '');
					pinnedStoryMolecule = null;
					pinnedTropes = [];
				}, 10);
			} else {
				pinnedStoryMolecule.css('background-position', 'top left');
				setTimeout(function() {
					pinnedStoryMolecule.css('transition-duration', '0.5s');
					pinnedStoryMolecule.css('background-position', '');	
					var previouslyPinnedTropes = pinnedTropes; // dehighlightCells() checks the pinnedTropes global variable and does not dehighlight the cells it flags. We need to move that data into a different variable before we call dehighlightCells().
					var pinnedStoryName = $(this).attr('id') + 'Tropes'; // get the name of the molecule that was clicked on
					pinnedTropes = window[pinnedStoryName]; //window[x] means "the variable whose name is stored in x"
					dehighlightCells(previouslyPinnedTropes);
					// above: remove the previous pinning. below: set the new pinning
					pinnedStoryMolecule = $(this);
					pinnedStoryMolecule.css('background-position', 'top right');
					highlightCells(pinnedTropes);
				}, 10);
			}
		} else { // the below is only executed once
			pinnedStoryMolecule = $(this);
			pinnedStoryMolecule.css('transition-duration', '0s');
			pinnedStoryMolecule.css('background-position', 'top right');
			var pinnedStoryName = $(this).attr('id') + 'Tropes';
			pinnedTropes = window[pinnedStoryName];
			highlightCells(pinnedTropes);
		};
	});
});