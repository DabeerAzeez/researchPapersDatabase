/**
 * See https://github.com/GuyInFridge/researchPapersDatabase for more documentation
 */

import wixWindow from 'wix-window';

const BACKUPIMAGE = "https://static.wixstatic.com/media/c6776b_35c58bbf6dda4263ad8fd90b077a2592~mv2.png"

// Indexes to differentiate similar repeaters, item IDs, and other relevant elements of the page
const POST_DOCTORAL_FELLOWS = "PDF";
const PHD_STUDENTS = "PHD";
const MASC_STUDENTS = "MAS";
const UNDERGRADUATES = "UND";
const ALUMNI = "ALM";

const HIGHLIGHTED_MEMBERS = [POST_DOCTORAL_FELLOWS, PHD_STUDENTS, MASC_STUDENTS, UNDERGRADUATES]

$w.onReady(function () {

	// Set up image repeaters for each member type
	HIGHLIGHTED_MEMBERS.forEach((memberType) => {
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
		// Checking for missing fields
		let requiredProperties = ["name", "alumnus", "memberType"]

		requiredProperties.forEach((property) => {
			if (!itemData.hasOwnProperty(property)) {
				throw new Error("Item ID: " + itemData._id + " missing property: " + property)
			}
		});

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
		// Checking for missing fields
		let requiredProperties = ["name", "alumnus", "memberType", "startTime", "endTime"]

		requiredProperties.forEach((property) => {
			if (!itemData.hasOwnProperty(property)) {
				throw new Error("Item ID: " + itemData._id + " missing property: " + property)
			}
		});

		if (itemData.memberType.length > 1) {
			throw new Error("Following member has more than one member type: " + itemData.name)
		}

		let startDate = new Date(itemData.startTime);
		let endDate = new Date(itemData.endTime);

		if (startDate > endDate) {
			throw new Error("Following member has end date after start date: " + itemData.name)
		}

		let memberType = itemData.memberType[0];

		if (memberType === "Ph.D. Student") {
			memberType = "Ph.D"
		}

		let optionalNewLine = wixWindow.formFactor === "Mobile" ? "\n" : ""

		// throw errors about missing start/end dates if no override is present
		let startYear = startDate.getFullYear();
		let endYear = endDate.getFullYear();
		let alumnusDescription = "";

		if (!itemData.adtOverride) {
			if (startYear === endYear) {
				alumnusDescription = memberType + optionalNewLine + " (" + startYear.toString() + ")";
			} else {
				alumnusDescription = memberType + optionalNewLine + " (" + startYear.toString() + " - " + endYear.toString() + ")";
			}
		} else {
			alumnusDescription = memberType + optionalNewLine + " (" + itemData.adtOverride + ")";
		}

		$item("#alumnusDescription").text = alumnusDescription;
	})
}