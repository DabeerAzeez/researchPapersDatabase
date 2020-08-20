/**
 * See https://github.com/GuyInFridge/researchPapersDatabase for more documentation
 */

const DATASET = "#EquipmentDS"
const REPEATER = " #EquipmentRepeater"

$w.onReady(function () {

	// Loop over repeater items to hide show appropriate items based on availability
	$w(REPEATER).onItemReady(async ($item, itemData, index) => {

		// Show 'image coming soon' if image is unavailable
		if (itemData.image === undefined) {
			await $item("#imageComingSoon").expand();
			await $item("#equipmentImage").collapse();
		} else {
			await $item("#imageComingSoon").collapse();
			await $item("#equipmentImage").expand();
		}

		// Show link button if link is available
		if (itemData.productLink) {
			$item("#linkButton").show();
		} else {
			$item("#linkButton").hide();
		}
	});
});

/**
 * Manually load another page of data for the dataset and display a loading GIF as necessary
 * @param {click event} event - click event for loadMoreButton
 */
export async function loadMoreButton_click(event) {
	$w("#loadingGIFmore").show();
	await $w(DATASET).loadMore();
	$w("#loadingGIFmore").hide();

	let total = $w(DATASET).getTotalCount();

	updateEndContainer(total);
}

/**
 * Check to see if dataset results are being shown, toggle displaying 'loading buttons' with an alternative container
 * @param {number} total - total number of dataset items under current filter
 */
async function updateEndContainer(total) {

	let nonZeroItems = total > 0;
	let allPagesLoaded = $w(DATASET).getCurrentPageIndex() === $w(DATASET).getTotalPageCount();

	// Show loading buttons only if there are more items to load
	if (nonZeroItems && !allPagesLoaded) {
		await $w("#loadingButtonsContainer").expand();
		await $w("#noLoadingButtons").collapse();
	} else {
		await $w("#loadingButtonsContainer").collapse();
		await $w("#noLoadingButtons").expand();
	}
}