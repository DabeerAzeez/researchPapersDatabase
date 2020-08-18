/**
 * Hoare Lab Research Papers Interactive Database
 * by Dabeer Abdul-Azeez | Most recently updated: Aug. 17th, 2020
 * 
 * @implements Wix Corvid API (see documentation here: https://www.wix.com/corvid/reference/api-overview/introduction)
 * Built for https://hoaretr.wixsite.com/hoarelab/researchpapers
 * 
 * An interactive database of papers authored by members of the Hoare Laboratory for Engineered Smart Materials. Allows
 * users to search all published papers, complete with titles, citations, links to the online versions of the journals, 
 * featured photos of graphical abstracts or interesting figures, and a search bar which dynamically updates the website
 * content to deliver the research papers filtered to your liking.
 */

import wixData from 'wix-data';
import wixWindow from 'wix-window';
import wixUsers from 'wix-users';

const DATABASE = "ResearchPapers"
const DATASET = "#RPDataSet"
const REPEATER = " #PublicationsRepeater"

/*
FOR REFERENCE, each database item has the following properties:

interface ResearchPaperItem {
  title: String;
  ID: String;
  content: String;
  abstract?: Image;
  publicationDate: Timestamp;
  link?: URL;
  publicationNumber: Number;
}
*/

/**** ON PAGE LOAD ****/

$w.onReady(async function () {
	let databaseChanged = false;
	const currentUser = wixUsers.currentUser;

	await wixData.query(DATABASE)
		.limit(1000)
		.descending("publicationDate") // sort query by date (newest items first)
		.find()
		.then(async (results) => {
			let items = results.items;
			const totalDatabaseItems = items.length;

			// Update each publication's publication number automatically (as necessary) based on total number of papers
			if (currentUser.loggedIn && currentUser.role === 'Admin') {
				for (var i = 0; i < items.length; i++) {
					let item = items[i];
					let properIndex = totalDatabaseItems - i;
					if (item.publicationNumber !== properIndex) {
						item.publicationNumber = properIndex;
						await wixData.update(DATABASE, item);

						if (databaseChanged === false) {
							databaseChanged = true;
						}
					}
				}
			}
		})

	// refresh dataset if it was changed above
	if (databaseChanged) {
		refreshDataset()
	}

	updateElements();

	// Double check that mobile alert message displays only on mobile
	if (wixWindow.formFactor === "Mobile") {
		$w("#mobileAlertMessage").expand();
	} else {
		$w("#mobileAlertMessage").collapse();
	}

});

/**
 * Refreshes dataset and updates page elements afterwards.
 */
export function refreshDataset() {
	$w(DATASET).onReady(() => {
		$w(DATASET).refresh()
			.then(() => {
				updateElements();
			});
	})
}

/**** UPDATING DYNAMIC PAGE ELEMENTS ****/

/**
 * Update dynamic page elements, including text results, repeater and container below repeater ("end container")
 */
function updateElements() {
	let total = $w(DATASET).getTotalCount(); // Get total number of papers under current filter

	updateTextResults(total);
	updateEndContainer(total);
	if (total > 0) {
		updateRepeater(); // update repeater if there's items to put in it
	}
	updateNoItemsFound(total)
}

/**
 * Update dynamic text at top of the page to show how many results there are and how many are being displayed
 * @param {number} total - total number of papers under current filter
 */
function updateTextResults(total) {
	let currentlyDisplayed = $w(REPEATER).data.length;

	if (total > 1) {
		$w('#textResults').text = `Showing ${currentlyDisplayed} of ${total} results`;
	} else if (total === 1) {
		$w('#textResults').text = "One result was found";
	} else if (total === 0) {
		$w('#textResults').text = "No results found";
	} else {
		throw new Error("Error occured when updating text results.")
	}
}

/**
 * Check to see if all data from available results is being shown and toggle displaying 'loading buttons' appropriately with an
 * alternative container
 * @param {number} total - total number of papers under current filter
 */
function updateEndContainer(total) {
	let nonZeroPapers = total > 0;
	let allPagesLoaded = $w(DATASET).getCurrentPageIndex() === $w(DATASET).getTotalPageCount();

	if (nonZeroPapers && !allPagesLoaded) {
		showLoadingButtons(true); // Show loading buttons only if there are more pages of papers to load
	} else {
		showLoadingButtons(false);
	}
}

/**
 * Toggles between showing loading buttons and alternative container instead
 * @param {boolean} choice - choice whether to show loading buttons or alternative container
 */
function showLoadingButtons(choice) {
	if (choice === true) {
		$w("#loadingButtonsContainer").show();
		$w("#noLoadingButtons").hide();
	} else if (choice === false) {
		$w("#loadingButtonsContainer").hide();
		$w("#noLoadingButtons").show();
	} else {
		throw new Error("Improper usage of showLoadingButtons()")
	}
}

/**
 * Loop over repeater items to style and notate various components based on item data
 */
async function updateRepeater() {
	let previousItemYear;
	let colorFlag = true;

	// Loop over repeater items
	$w(REPEATER).forEachItem(($item, itemData, index) => {

		$item("#publicationNumber").text = itemData.publicationNumber.toString(); // set publication number

		// Show 'image unavailable' as necessary
		if (!itemData.abstract) {
			$item("#abstractUnavailable").show();
		} else {
			$item("#abstractUnavailable").hide();
		}

		// Change colour of year box to make different years stand out from each other in the repeater
		try {
			let currentYear = itemData.publicationDate.getFullYear()

			if (index === 0) {
				colorFlag = true; // make the first yearbox a bright yellow
			} else if (previousItemYear !== currentYear) {
				colorFlag = !colorFlag; // toggle color flag if the year changes between two repeater items
			}

			previousItemYear = currentYear;

			let chosenColor = colorFlag ? "#FFBF3D" : "#dea633"; // choose between a bright / darker colour for the year box
			$item("#YearBox").style.backgroundColor = chosenColor;
		} catch (err) {
			$item("#YearBox").style.backgroundColor = "#000000"; // Make sidebar black if error (e.g. if no date available)
		}

		// Show loading GIF and hide text results until last repeater item is loaded
		if (index + 1 === $w(REPEATER).data.length) { // repeater index starts from 0
			$w("#loadingGIFTop").hide()
			$w("#textResults").show()
		} else {
			$w("#loadingGIFTop").show()
			$w("#textResults").hide()
		}

		// show link button and dashed line if link is available
		if (itemData.link) {
			$item("#linkButton").show()
			$item("#numToButtonLine").show()
		} else {
			$item("#linkButton").hide()
			$item("#numToButtonLine").hide()
		}
	});
}

/**
 * Display some text to the user if no items exist in the filtered dataset (i.e. if search query leads to 0 results)
 * @param {number} total - total number of papers under current filter
 */
async function updateNoItemsFound(total) {
	if (total > 0) {
		$w("#noItemsFound").hide()
		await $w(REPEATER).expand();
	} else if (total === 0) {
		$w("#noItemsFound").show()
		await $w(REPEATER).collapse();
	} else {
		throw new Error("Improper usage of noItemsCheck(), cannot parse input: ", total)
	}

	$w("#loadingGIFTop").hide();
}

/* IMAGE MOUSEIN-MOUSEOUT EVENT HANDLERS */

/**
 * Fade in a border around the publication image on hover (done manually since hoverboxes not supported in repeaters)
 * @param {mouseIn event} event - mouseIn event for each publication image container
 */
export function publicationImage_mouseIn(event) {
	let $item = $w.at(event.context);
	$item("#imageOverlay").show("fade", { "duration": 200 });
}

/**
 * Fade out a border around the publication image on mouse out (done manually since hoverboxes not supported in repeaters)
 * @param {mouseIn event} event - mouseIn event for each publication image container
 */
export function publicationImage_mouseOut(event) {
	let $item = $w.at(event.context);
	$item("#imageOverlay").hide("fade", { "duration": 200 });
}

/**** 'LOAD' BUTTONS FUNCTIONALITY ****/

/**
 * Manually load another page of data for the dataset and update dynamic page elements
 * @param {click event} event - click event for loadMoreButton
 */
export async function loadMoreButton_click(event) {
	$w("#loadingGIFmore").show();
	await $w(DATASET).loadMore();
	updateElements();
	$w("#loadingGIFmore").hide();
}

/**
 * Load pages of data incrmementally until all have been loaded, then update dynamic page elements
 * @param {click event} event - click event for loadMoreButton
 */
export async function loadAllButton_click(event) {
	$w("#loadingGIFAll").show();

	// Load more data until repeater has all items available
	while ($w(DATASET).getCurrentPageIndex() < $w(DATASET).getTotalPageCount()) {
		await $w(DATASET).loadMore(); // await makes repeater rows load incrementally instead of all at once
	}

	updateElements();
	$w("#loadingGIFAll").hide();
}

/**** SEARCH BOX AND SEARCH RESET EVENT HANDLERS ****/

/**
 * Filter dataset based on user search query and update some dynamic page elements
 * @param {keyPress event} event - keyPress event for search bar
 */
export function searchBar_keyPress(event) {
	filterDataset($w("#searchBar").value);
}

/**
 * Empty out search bar and filter dataset with a blank search query
 * @param {click event} event - click event for the searchResetButton
 */
export function searchResetButton_click(event) {
	$w("#searchBar").value = "";
	filterDataset("");
}

let debounceTimer;

function filterDataset(searchQuery) {

	// Show user that results are processing
	$w("#loadingGIFTop").show();
	$w("#textResults").text = "Processing...";

	// Make sure the user doesn't get ahead of the browser
	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}

	debounceTimer = setTimeout(() => {
		// filter dataset for items with title / content fields that contain the search query
		$w(DATASET).setFilter(wixData.filter().contains("title", searchQuery)
				.or(wixData.filter().contains("content", searchQuery)))
			.then(() => updateElements())
	}, 200);

	$w(DATASET).loadPage(1); // By default load only first page of data for any new search query
}