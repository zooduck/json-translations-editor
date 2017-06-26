import flat from "flat";

const thumbnail_file = document.getElementById("thumbnailFile");
const progress = document.getElementById("progress");
const translations_table = document.getElementById("translationsTable");
const translations_table_row_TEMPLATE = document.getElementById("translationsTableRow_TEMPLATE");
const alert_bar = document.getElementById("alertBar");

function textShuffle(txt) {
	let chars = txt.substr(0, 1000).split("");
	let newChars = [];
	for (let i = 0, l = chars.length; i < l; i++) {
		let rand = Math.floor(Math.random() * l);
		newChars.push(chars[rand]);
	}
	return newChars.join(" ");
}
function applyShuffledText (txt, el, delay, totalDelay) {
	setTimeout(function(){
		el.innerHTML = txt;
		setProgress(`${(delay / totalDelay) * 100}%`);
	}, delay);
}
function setProgress (percent = "0%") {
	progress.querySelector(".progress-bar").style.width = percent;
	let pretext = parseInt(percent) < 50? "Reading file..." : "Converting...";
	if (parseInt(percent) >= 100) {
		progress.querySelector(".before").innerHTML = "Done!";
	} else {
		progress.querySelector(".before").innerHTML = `${pretext} ${Math.floor(parseInt(percent))}%`;
	}
}
function addRow (row, delay) {
	setTimeout(() => {
		translations_table.appendChild(row);
	}, delay);
}
function emptyTranslationsTable () {
	for (let child of Array.from(translations_table.children)) {
		// console.log("child", child);
		if (!child.className.match(/tr/)) {
			continue;
		}
		translations_table.removeChild(child);
	}
}
function buildTranslationsTable (jsonData) {
	let obj = JSON.parse(jsonData);
	obj = flat(obj); // flatten
	let delay = 0;
	let numKeys = Object.keys(obj).length;
	//let delayAdd = 1000 / numKeys;
	let delayAdd = 150;
	let commonKeyPattern = /^@:/;

	for (let prop in obj) {
			let key = prop;
			let en = obj[prop].toString();

			let row = translations_table_row_TEMPLATE.cloneNode(true);
			row.classList.remove("template");

			row.querySelectorAll(".td")[0].innerHTML = key;
			row.querySelectorAll(".td")[1].innerHTML = en;

			if (en.match(commonKeyPattern)) {
				let commonVal = obj[en.substr(2)];
				let commonKey = en;
				row.querySelectorAll(".td")[1].innerHTML += ` (${commonVal})`;
			}

			row.querySelector("textarea").addEventListener("keydown", (e) => {
				let key = e.keyCode || e.charCode;
				if (key === 13) {
					e.preventDefault();
				}
			});
			row.querySelector("textarea").addEventListener("blur", (e) => {
				let key = e.keyCode || e.charCode;
				if (key === 13) {
					e.preventDefault();
				}
				if (e.target.value != "") {
					e.target.parentNode.previousElementSibling.classList.add("line-through");
				} else {
					e.target.parentNode.previousElementSibling.classList.remove("line-through");
				}
			});

			addRow(row, delay);

			delay += delay < 1200? delayAdd : 0;
			console.log(delay);
	}
}
function createThumbnailTextFile (textData, fileName) {
	thumbnail_file.classList.remove("json-parsed", "expand");
	let h4 = thumbnail_file.querySelector("h4");
	let pre = thumbnail_file.querySelector("pre");
	h4.innerHTML = `# ${fileName}`;
	let delay = 0;
	let delayAdds = [];
	let totalDelay = 0;
	let iterations = 50;
	for (let i = 0; i < iterations; i++) {
		let delayAdd = Math.floor(Math.random() * 100) % 2 == 0? 40 : 100;
		delayAdds.push(delayAdd);
		totalDelay += delayAdd;
	}
	for (let i = 0; i < iterations; i++) {
		let shuffledText = textShuffle(textData);
		applyShuffledText(shuffledText, pre, delay, totalDelay);
		delay += delayAdds.pop();
	}

	setTimeout(() => {
		thumbnail_file.classList.add("json-parsed");
	}, totalDelay);

	setTimeout(function(){
		pre.innerHTML = textData;
		setProgress("100%");
		// thumbnail_file.classList.add("json-parsed");
		buildTranslationsTable(textData);
	}, totalDelay + 250);
}
function isValidJSON (data) {
	try {
		JSON.parse(data);
	}
	catch (error) {
		return {valid: false, error: error.message}
	}
	return {valid: true, error: null}
}
function errorService () {
	let table = {
		ERROR: {
			GENERIC: "Sorry but you must have broken something init!"
		},
		SUCCESS: {
			GENERIC: "Success!"
		}
	}
	return {
		getMsg: (key) => {
			return flat(table)[key];
		}
	}
}
function alertService () {
	return {
		raise: (errorKey, options = {msg: "", type: ""}) => {
			let errorMsg = "";
			let type = options.type || errorKey.split(".")[0];

			if (errorKey === "CUSTOM") {
				errorMsg = options.msg;
			} else {
				errorMsg = errorService().getMsg(errorKey);
			}

			alert_bar.querySelector("h2").innerHTML = errorMsg;

			alert_bar.classList.remove("active", "error", "success");

			if (type.match(/error/i)) {
				alert_bar.classList.add("error");
			} else if (type.match(/success/i)) {
				alert_bar.classList.add("success");
			}

			alert_bar.classList.add("active");

			setTimeout(() => {
				alert_bar.classList.remove("active");
			}, 2500);
		}
	}
}
export default {
	log() {
		console.log("services.js log() method called");
	},
	es6BabelTest() {
		console.log("services.js es6BabelTest() method called");
		const ES6_ARROW_FN = () => console.log(ES6_ARROW_FN)
		console.log("babel converted ES6_ARROW_FN = () => console.log(ES6_ARROW_FN) to:");
		console.log(ES6_ARROW_FN);
	},
	fileHandler() {
		let files = this.files;
		for (let file of files) {
			let reader = new FileReader();
			reader.onload = (e) => {
				let textData = e.target.result;
				let checkValid = isValidJSON(textData);
				if (checkValid.valid) {
					emptyTranslationsTable();
					createThumbnailTextFile(textData, file.name);
				} else {
					alertService().raise("CUSTOM", {msg: checkValid.error, type: "ERROR"});
				}

			}
			reader.readAsText(file);
		}
	},
	thumbnailFileExpand(e) {
		e.target.parentNode.classList.toggle("expand");
	}
}
