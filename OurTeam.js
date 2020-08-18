// TODO: Check if maximum load capacities for repeaters are enough
// TODO: Fix anchors and anchor menu (use strips?)
// TODO: Change start/end TIME to DATE
/* 
// TODO: Code alumni
- If end year = start year, then just show the year
- If no end year, then say 'Current'
*/

// const BACKUPIMAGE = "https://static.wixstatic.com/media/c6776b_35c58bbf6dda4263ad8fd90b077a2592~mv2.png" // Actual backup image
const BACKUPIMAGE = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Amerikanische_Pekingenten_2013_01%2C_cropped.jpg" // for fu

// Indexes to differentiate similar repeaters, item IDs, and other relevant elements of the page
const POST_DOCTORAL_FELLOWS = "PDF";
const PHD_STUDENTS = "PHD";
const MASC_STUDENTS = "MAS";
const UNDERGRADUATES = "UND";
const ALUMNI = "ALM";

const MEMBER_TYPES = [POST_DOCTORAL_FELLOWS, PHD_STUDENTS, MASC_STUDENTS, UNDERGRADUATES] // TODO: Add missing member types

$w.onReady(function () {

	// Set up image repeaters for each member type
	MEMBER_TYPES.forEach((memberType) => {
		$w("#Dataset" + memberType).onReady(() => setUpImgRepeater(memberType)); // set up repeater for each member type
	});

	// Set up alumni repeater
	$w("#Dataset" + ALUMNI).onReady(() => setUpAlumniRepeater());
});

export function collapseAnchorMenuButton_click(event) {
	if ($w("#anchorMenu").hidden) {
		$w("#anchorMenu").show("float", { direction: "right" });
	} else {
		$w("#anchorMenu").hide("float", { direction: "right" });
	}

}

/**
 * Set up image repeaters, those for non-alumni, featuring a headshot above their name and no description below their name
 */
function setUpImgRepeater(memberType) {
	$w("#Repeater" + memberType).forEachItem(($item, itemData, index) => {
		if (itemData.image === undefined) {
			$item("#memberImage" + memberType).src = BACKUPIMAGE;
		}
	})
}

/**
 * Set up repeater for alumni, no headshot for anyone, description is placed below their name
 */
function setUpAlumniRepeater() {
	$w("#Repeater" + ALUMNI).forEachItem(($item, itemData, index) => {
		let alumnusDescription = itemData.memberType[0] + " (" + itemData.startTime.getFullYear().toString() + "-" + itemData.endTime.getFullYear().toString() + ")"
		$item("#alumnusDescription").text = alumnusDescription;
		console.log(alumnusDescription, "alumnus description changed");
	})
}