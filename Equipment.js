$w.onReady(function () {
	// Show 'image coming soon' if image unavailable
	$w("#EquipmentRepeater").onItemReady((($item, itemData, index) => {
		if (itemData.image === undefined) {
			$item("#imageComingSoon").expand();
			$item("#equipmentImage").collapse();
		} else {
			$item("#imageComingSoon").collapse();
			$item("#equipmentImage").expand();
		}

		if (itemData.productLink) {
			$item("#linkButton").show();
		} else {
			$item("#linkButton").hide();
		}
	}))
});

/**
 * Check to see if all data from available results is being shown and toggle loading button appropriately with an
 * alternative container
 */
function updateEndContainer() {
	let total = $w("#EquipmentDS").getTotalCount();
	let nonZeroItems = total > 0;
	let allPagesLoaded = $w('#EquipmentDS').getCurrentPageIndex() === $w('#EquipmentDS').getTotalPageCount();

	// Show loading button only if there are more pages of papers to load
	if (nonZeroItems && !allPagesLoaded) {
		$w("#loadMoreButton").expand(); 
		$w("#noLoadingButtons").collapse();
	} else {
		$w("#loadMoreButton").collapse(); 
		$w("#noLoadingButtons").expand();
	}
}

/**
 * Manually load another page of data for the dataset and display a loading GIF as necessary
 * @param {click event} event - click event for loadMoreButton
 */
export async function loadMoreButton_click(event) {
	$w("#loadingGIFmore").show();
	await $w("#EquipmentDS").loadMore();
	$w("#loadingGIFmore").hide();

	updateEndContainer();
}