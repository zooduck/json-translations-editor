module.exports = {
	plugins: {
		"postcss-import": {},
		"postcss-cssnext": {
			browsers: ["last 5 versions", "> 5%"] // the Browserslist config can alternately be set directly in package.json (see example below)
		},
	}
};

// package.json

// "browserslist": [
// 	"> 1%",
// 	"last 2 versions",
// 	"IE 10"
// ]
