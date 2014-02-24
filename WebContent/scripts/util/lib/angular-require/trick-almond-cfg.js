var baseUrl;
(function() {
	var originalConfig = require.config;
	require.config = function(cfg) {
		if( cfg && cfg.baseUrl ) baseUrl = cfg.baseUrl;
		originalConfig.call(require,cfg);
	};
})();
