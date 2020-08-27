/**
 * Check an item with a ._id property (e.g. a repeater item being read from a database) for a set of required properties
 * @param {object} itemData - object to be checked for all required properties
 * @param {array [string]} requiredProperties - array of all properties that are required
 * @throws {Error} if item is passed without an ._id property
 * @throws {Error} if the item is missing any of the required properties
 */
export function checkItemProperties(item, requiredProperties) {
  if (item._id === undefined) {
      throw new Error("Improper usage of checkItemProperties(); received an item without an ID")
  }
  
  requiredProperties.forEach((property) => {
    if (!item.hasOwnProperty(property)) {
      throw new Error("Item ID: " + item._id + " missing property: " + property)
    }
  });
}
