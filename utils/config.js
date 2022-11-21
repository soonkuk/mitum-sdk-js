let version = "v0.0.1";
export const v = () => {
	return version;
};
export const useV = (s) => {
	version = s;
};

let networkId = "mitum";
export const id = () => {
	return networkId;
};
export const useId = (s) => {
	networkId = s;
};
