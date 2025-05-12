import { safeJSONParse, } from "./util.js";
import {
	setMany,
	getMany,
	removeMany,
} from "./many.js";


// ***********************

get.many = (...args) => getMany(get,...args);
set.many = (...args) => setMany(set,...args);
remove.many = (...args) => removeMany(remove,...args);


// ***********************

var storageType = "session-storage";
export {
	storageType,
	has,
	get,
	set,
	remove,
	keys,
	entries,
};
var publicAPI = {
	storageType,
	has,
	get,
	set,
	remove,
	keys,
	entries,
};
export default publicAPI;


// ***********************

async function has(name) {
	// note: https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem#return_value
	return (globalThis.sessionStorage.getItem(name) !== null);
}

async function get(name) {
	return safeJSONParse(globalThis.sessionStorage.getItem(name));
}

async function set(name,value) {
	try {
		globalThis.sessionStorage.setItem(
			name,
			value != null && typeof value == "object" ?
				JSON.stringify(value) :
				String(value)
		);
		return true;
	}
	catch (err) {
		if (err.name == "QuotaExceededError") {
			throw new Error("Local-storage is full.",{ cause: err, });
		}
		throw err;
	}
}

async function remove(name) {
	globalThis.sessionStorage.removeItem(name);
	return true;
}

async function keys() {
	var storeKeys = [];
	for (let i = 0; i < globalThis.sessionStorage.length; i++) {
		storeKeys.push(globalThis.sessionStorage.key(i));
	}
	return storeKeys;
}

async function entries() {
	var storeEntries = [];
	for (let i = 0; i < globalThis.sessionStorage.length; i++) {
		let name = globalThis.sessionStorage.key(i);
		storeEntries.push([
			name,
			safeJSONParse(globalThis.sessionStorage.getItem(name)),
		]);
	}
	return storeEntries;
}
