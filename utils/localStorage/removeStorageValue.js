export default function removeStorageValue(key) {
	if (typeof window !== "undefined") {
		if (localStorage.getItem(key)) localStorage.removeItem(key);
	}
}
