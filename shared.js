/**
 * Check an item with a _.id (e.g. a repeater item being read from a database) for a set of required properties
 * @param {object} itemData - object to be checked for all required properties
 * @param {array [string]} requiredProperties - array of all properties that are required
 */
export function checkItemProperties(item, requiredProperties) {
	requiredProperties.forEach((property) => {
		if (!item.hasOwnProperty(property)) {
			throw new Error("Item ID: " + item._id + " missing property: " + property)
		}
	});
}