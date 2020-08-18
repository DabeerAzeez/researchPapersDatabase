export function collapseAnchorMenuButton_click(event) {
	// Add your code for this event here: 
	if ($w("#anchorMenu").hidden) {
		$w("#anchorMenu").show("float", { direction: "right" });
	} else {
		$w("#anchorMenu").hide("float", { direction: "right" });
	}

}
