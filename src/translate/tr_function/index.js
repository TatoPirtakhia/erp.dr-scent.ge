// translate.js
const translate = (t, id, fallback) => {
	const text = t(id, fallback);
	if (typeof text === 'string') return text;
	return id;
};

export default translate;
