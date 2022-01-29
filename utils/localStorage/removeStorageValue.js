export default function removeStorageValue(key) {
	if (typeof window !== "undefined") localStorage.removeItem(key);
}
