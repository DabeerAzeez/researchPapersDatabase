import wixData from 'wix-data';
import wixWindow from 'wix-window';
import wixUsers from 'wix-users';

import { checkItemProperties } from 'public/shared.js'
import { sleep } from 'public/shared.js'

const COLLECTION = "ResearchPapers"
const DATASET = "#RPDataSet"
const REPEATER = " #PublicationsRepeater"
const CURRENTUSER = wixUsers.currentUser;

/*
FOR REFERENCE, each item in the collection above has the following properties:

interface ResearchPaperItem {
  title: String;
  _id: String;
  content: String;
  abstract?: Image;
  publicationDate: Timestamp;
  link?: URL;
  publicationNumber: Number;
}
*/

/**** ON PAGE LOAD ****/

$w.onReady(async function () {

	await wixData.query(COLLECTION)
		.limit(1000)
		.descending("publicationDate") // Sort query by date (newest items first)
		.find()
		.then(async (results) => {
			let items = results.items;
			const totalDatabaseItems = items.length;

			// Allow admins and owners to update publication number automatically (if necessary)
			if (CURRENTUSER.loggedIn && (CURRENTUSER.role === 'Admin' || 'Owner')) {
				for (var i = 0; i < items.length; i++) {
					let item = items[i];
					let properIndex = totalDatabaseItems - i;
					if (item.publicationNumber !== properIndex) {
						item.publicationNumber = properIndex;
						await wixData.update(COLLECTION, item);
					}
				}
			}
		})

	refreshDataset(DATASET)

	// Double check that mobile alert message displays only on mobile
	if (wixWindow.formFactor === "Mobile") {
		await $w("#mobileAlertMessage").expand();
	} else {
		await $w("#mobileAlertMessage").collapse();
	}

});

/**
 * Refreshes dataset and updates page elements afterwards
 * @param {dataset} dataset - dataset to be refreshed
 */
function refreshDataset(dataset) {
	$w(dataset).onReady(() => {
		$w(dataset).refresh()
			.then(() => {
				updateElements();
			});
	})
}

/**** UPDATING DYNAMIC PAGE ELEMENTS ****/

/**
 * Update dynamic page elements
 */
function updateElements() {
	let total = $w(DATASET).getTotalCount(); // Get total number of papers in dataset (i.e. under current filter)

	updateTextResults(total);
	updateEndContainer(total);
	if (total > 0) {
		updateRepeater(); // Update repeater if there's items to put in it
	}
	updateNoItemsFound(total)
}

/**
 * Update dynamic text at top of the page to show how many results are available and how many are being displayed
 * @param {number} total - total number of dataset items under current filter
 */
function updateTextResults(total) {
	let currentlyDisplayed = $w(REPEATER).data.length;

	// Change wording of text results based on the total number of results
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
 * Check to see if all dataset results are being shown, toggle displaying 'loading buttons' or alternative container
 * @param {number} total - total number of dataset items under current filter
 */
function updateEndContainer(total) {
	let nonZeroPapers = total > 0;
	let allPagesLoaded = $w(DATASET).getCurrentPageIndex() === $w(DATASET).getTotalPageCount();

	if (nonZeroPapers && !allPagesLoaded) {
		$w("#loadingButtonsContainer").show(); // Show loading buttons only if there are more items to load
		$w("#noLoadingButtons").hide(); 
	} else {
		$w("#loadingButtonsContainer").hide();
		$w("#noLoadingButtons").show();
	}
}

/**
 * Loop over repeater items to style and notate various components based on item data
 */
function updateRepeater() {
	
	const REQUIRED_PROPERTIES = ["title", "content", "publicationDate", "publicationNumber", "link"]
	const YEARBOX_COLOR_LIGHT = "#FFBF3D";
  const YEARBOX_COLOR_DARK = "#DEA633";
  
  let previousItemYear;
	let colorFlag = true;

  // Loop over repeater items
	$w(REPEATER).forEachItem(($item, itemData, index) => {
		checkItemProperties(itemData, REQUIRED_PROPERTIES); // Check if item has all appropriate properties

		$item("#publicationNumber").text = itemData.publicationNumber.toString(); // Display publication number

		// Display 'image unavailable' as necessary
		if (!itemData.abstract) {
			$item("#abstractUnavailable").show();
		} else {
			$item("#abstractUnavailable").hide();
		}

		// Display link button and dashed line if link is available
		if (itemData.link) {
			$item("#linkButton").show()
			$item("#numToButtonLine").show()
		} else {
			$item("#linkButton").hide()
			$item("#numToButtonLine").hide()
		}

		let currentYear = itemData.publicationDate.getFullYear()

		// Toggle between bright/dark year box colors to make different years stand out
		if (index === 0) {
			colorFlag = true; // Bright color for first (top-most) repeater item
		} else if (previousItemYear !== currentYear) {
			colorFlag = !colorFlag; // Toggle color if year changes between two items
		}

		previousItemYear = currentYear;

		let chosenColor = colorFlag ? YEARBOX_COLOR_LIGHT : YEARBOX_COLOR_DARK;
		$item("#YearBox").style.backgroundColor = chosenColor;

		// Show loading GIF and hide text results until last repeater item is loaded
		if (index + 1 === $w(REPEATER).data.length) { // index + 1 because repeater index starts from 0
			$w("#loadingGIFTop").hide()
			$w("#textResults").show()
		} else {
			$w("#loadingGIFTop").show()
			$w("#textResults").hide()
		}

	});
}

/**
 * Display some text to the user if no items exist in the filtered dataset (i.e. if search query leads to 0 results)
 * @param {number} total - total number of dataset items under current filter
 */
async function updateNoItemsFound(total) {
	if (total > 0) {
		$w("#noItemsFound").hide()
		await $w(REPEATER).expand();
	} else if (total === 0) {
		$w("#noItemsFound").show()
		await $w(REPEATER).collapse();
	} else {
		throw new Error("Improper usage of noItemsCheck(), cannot parse input: " + total)
	}

	$w("#loadingGIFTop").hide();
}

/* IMAGE MOUSEIN-MOUSEOUT EVENT HANDLERS */

/**
 * Fade in 'border' box behind the publication image on mouse in 
 * (This method was chosen since hoverboxes are not supported inside repeaters)
 * @param {mouseIn event} event - mouseIn event for each publication image container
 */
export function publicationImage_mouseIn(event) {
	let $item = $w.at(event.context); // Access item where mouseIn event occurred
	$item("#imageBorder").show("fade", { "duration": 200 });
}

/**
 * Fade out 'border' box behind the publication image on mouse in 
 * (This method was chosen since hoverboxes are not supported inside repeaters)
 * @param {mouseIn event} event - mouseIn event for each publication image container
 */
export function publicationImage_mouseOut(event) {
	let $item = $w.at(event.context); // Access item where mouseIn event occurred
	$item("#imageBorder").hide("fade", { "duration": 200 });
}

/**** 'LOAD' BUTTONS FUNCTIONALITY ****/

/**
 * Load another page of data for the dataset and update dynamic page elements
 * @param {click event} event - click event for loadMoreButton
 */
export async function loadMoreButton_click(event) {
	$w("#loadingGIFmore").show();
	await $w(DATASET).loadMore();
	updateElements();
	$w("#loadingGIFmore").hide();
}

/**
 * Load all pages of data and update dynamic page elements incrementally
 * @param {click event} event - click event for loadMoreButton
 */
export async function loadAllButton_click(event) {
	$w("#loadingGIFAll").show();

	// Load more data until repeater has all items available
	while ($w(DATASET).getCurrentPageIndex() < $w(DATASET).getTotalPageCount()) {
		await $w(DATASET).loadMore(); // await makes repeater rows load incrementally instead of all at once
		updateElements()
		await sleep(1000);
	}

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

let debounceTimer; // To limit number of search queries per time interval
const DEBOUNCE_TIME = 200;

function filterDataset(searchQuery) {

	// Show user that results are processing
	$w("#loadingGIFTop").show();
	$w("#textResults").text = "Processing...";

	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}

	debounceTimer = setTimeout(() => {
		// Filter dataset for items with title or content fields that contain the search query, then update page elements
		$w(DATASET).setFilter(wixData.filter().contains("title", searchQuery)
				.or(wixData.filter().contains("content", searchQuery)))
			.then(() => updateElements())
	}, DEBOUNCE_TIME);

	if ($w(DATASET).getTotalCount() > 0) {
		$w(DATASET).loadPage(1); // Load only first page of data for any new search query
	}
}
