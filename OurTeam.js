// TODO: Check if maximum load capacities for repeaters are enough

import wixWindow from 'wix-window';

// const BACKUPIMAGE = "https://static.wixstatic.com/media/c6776b_35c58bbf6dda4263ad8fd90b077a2592~mv2.png" // Actual backup image
const BACKUPIMAGE = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Amerikanische_Pekingenten_2013_01%2C_cropped.jpg" // for fu

// Indexes to differentiate similar repeaters, item IDs, and other relevant elements of the page
const POST_DOCTORAL_FELLOWS = "PDF";
const PHD_STUDENTS = "PHD";
const MASC_STUDENTS = "MAS";
const UNDERGRADUATES = "UND";
const ALUMNI = "ALM";

const MEMBER_TYPES = [POST_DOCTORAL_FELLOWS, PHD_STUDENTS, MASC_STUDENTS, UNDERGRADUATES]

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
		if (itemData.memberType.length > 1) {
			throw new Error("Following member has more than one member type: " + itemData.name)
		}

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
		let alumnusDescription;
		let startYear;
		let endYear;
		let memberType;

		memberType = itemData.memberType[0];

		if (itemData.memberType.length > 1) {
			throw new Error("Following member has more than one member type: " + itemData.name)
		}
		
		if (memberType === "Ph.D. Student") {
			memberType = "Ph.D"
		}

		if (itemData.startTime) {
			startYear = itemData.startTime.getFullYear().toString();
		} else {
			throw new Error("Following alumnus has no start date: " + itemData.name) // alumni must have a start date
		}
		
		if (itemData.endTime) {
			endYear = itemData.endTime.getFullYear().toString();
		} else {
			throw new Error("Following alumnus has no end date: " + itemData.name) // alumni must have an end date
		}

		let optionalNewLine = wixWindow.formFactor === "Mobile" ? "\n" : ""

		if (startYear === endYear) {
			alumnusDescription = memberType + optionalNewLine + " (" + startYear + ")";
		} else {
			alumnusDescription = memberType + optionalNewLine + " (" + startYear + " - " + endYear + ")";
		}

		$item("#alumnusDescription").text = alumnusDescription;
	})
}