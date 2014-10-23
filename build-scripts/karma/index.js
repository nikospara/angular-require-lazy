module.exports = {
	"preprocessor:preInstrumented": ["factory", require("./preInstrumentedPreprocessor")],
	"reporter:coverage": ["type", require("./reporter")]
};
