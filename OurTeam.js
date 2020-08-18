// const BACKUPIMAGE = "https://static.wixstatic.com/media/c6776b_35c58bbf6dda4263ad8fd90b077a2592~mv2.png"
const BACKUPIMAGE = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Amerikanische_Pekingenten_2013_01%2C_cropped.jpg"

const REPEATER_FELLOWS = "#PostDoctoralFellows"

const DATASET_POSTDOC = "#PostDoctoralDS"

$w.onReady(function () {

	$w(DATASET_POSTDOC).onReady(() => setUpRepeaters());

});

export function collapseAnchorMenuButton_click(event) {
	// Add your code for this event here: 
	if ($w("#anchorMenu").hidden) {
		$w("#anchorMenu").show("float", { direction: "right" });
	} else {
		$w("#anchorMenu").hide("float", { direction: "right" });
	}

}

function setUpRepeaters() {
	$w(REPEATER_FELLOWS).forEachItem(($item, itemData, index) => {

		if (itemData.image === undefined) {
			$item("#memberImage").src = BACKUPIMAGE;
			console.log("image changed");
		}
	})
}