const DATASET = "#EquipmentDS"
const REPEATER = " #EquipmentRepeater"

$w.onReady(function () {
  
  // Loop over repeater items to hide show appropriate items based on availability
	$w(REPEATER).onItemReady(async ($item, itemData, index) => {
		if (itemData.image === undefined) {
			await $item("#imageComingSoon").expand();
			await $item("#equipmentImage").collapse();
		} else {
			await $item("#imageComingSoon").collapse();
			await $item("#equipmentImage").expand();
		}

		if (itemData.productLink) {
			$item("#linkButton").show();
		} else {
			$item("#linkButton").hide();
		}
	});
});

/**
 * Check to see if all data from available results is being shown and toggle loading button appropriately with an
 * alternative container
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
 */
async function updateEndContainer(total) {
	
	let nonZeroItems = total > 0;
	let allPagesLoaded = $w(DATASET).getCurrentPageIndex() === $w(DATASET).getTotalPageCount();

	// Show loading button only if there are more pages of papers to load
	if (nonZeroItems && !allPagesLoaded) {
		await $w("#loadMoreButton").expand(); 
		await $w("#noLoadingButtons").collapse();
	} else {
		await $w("#loadMoreButton").collapse(); 
		await $w("#noLoadingButtons").expand();
	}
}
