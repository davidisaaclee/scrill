function makeElement(options) {
	var result = document.createElement(options.tag);

	if (options.properties !== undefined) {
		_.extend(result, options.properties);
	}

	return result;
}

function Document() {
	_.extend(this, {
		paragraphs: []
	});
}

_.extend(Document.prototype, {
	appendParagraph: function () {
		this.paragraphs.push(new Paragraph());
		return this;
	},

	appendAtom: function (atom) {
		if (_.last(this.paragraphs) === undefined) {
			this.appendParagraph();
		}

		_.last(this.paragraphs).appendAtom(atom);
		return this;
	}
});



function Paragraph() {
	_.extend(this, {
		atoms: []
	});
}

Paragraph.prototype.appendAtom = function (atom) {
	this.atoms.push(atom);
	return this;
};


// function parse_inWord (document, workingString, text) {
//	switch (_.head(text)) {
//	case undefined:
//		return document;

//   case " ":
//	  return parse_inSpace(document.appendAtom(workingString), text);

//	case "\n":
//	  return parse_inSpace(document.appendAtom(workingString), text);

//	default:
//		return parse_inWord(document, workingString + _.head(text), _.tail(text));
//	}
// }

// function parse_inSpace (document, text) {
//	switch (_.head(text)) {
//	case undefined:
//		return document;

//   case " ":
//	  return parse_inSpace(document.appendAtom(" "), _.tail(text));

//	case "\n":
//		return parse_inSpace(document.appendParagraph(), _.tail(text));

//	default:
//		return parse_inWord(document, "", text);
//	}
// }

/*
ParseResult ::= { state: ParseState
								, document: Document
								, input: [Character]
								, workingString: String
								}

ParseState ::= "end" | "space" | "word"
*/

// (Document, String, [Character]) -> ParseResult
function parse_inWord (document, workingString, text) {
	switch (_.head(text)) {
	case undefined:
		return {
			state: "end",
			document: document
		};

  case " ":
		return {
			state: "space",
			document: document.appendAtom(workingString),
			input: text
		};

	case "\n":
		return {
			state: "space",
			document: document.appendAtom(workingString),
			input: text
		};

	default:
		return {
			state: "word",
			document: document,
			input: _.tail(text),
			workingString: workingString + _.head(text)
		};
	}
}

// (Document, [Character]) -> ParseResult
function parse_inSpace (document, text) {
	switch (_.head(text)) {
	case undefined:
		return {
			state: "end",
			document: document
		};

  case " ":
		return {
			state: "space",
			document: document.appendAtom(" "),
			input: _.tail(text)
		};

	case "\n":
		return {
			state: "space",
			document: document.appendParagraph(),
			input: _.tail(text)
		};

	default:
		return {
			state: "word",
			document: document,
			input: text,
			workingString: ""
		};
	}
}

function display (text, node) {
	// var list = text.split("");
	var result = parse_inSpace(new Document(), text.split(""));

	while (result.state !== "end") {
		switch (result.state) {
			case "space":
				result = parse_inSpace(result.document, result.input);
				break;

			case "word":
				result = parse_inWord(result.document, result.workingString, result.input);
				break;
		}
	}

	var doc = result.document;

	var html = doc.paragraphs.map(function (paragraph, paragraphIndex) {
		var paragraphElement = makeElement({
			tag: "p"
		});

		paragraph.atoms
			// Make elements out of each atom.
			.map(function (atom, atomIndex) {
				return makeElement({
					tag: "span",
					properties: {
						innerHTML: atom,
						id: "atom-" + paragraphIndex + "-" + atomIndex
					}
				});
			})
			// Append each element onto the paragraph element.
			.forEach(paragraphElement.appendChild, paragraphElement);

		return paragraphElement;
	}).forEach(node.appendChild, node);
}

function requestText(path) {
  var request = new XMLHttpRequest();
	request.onreadystatechange = function () {
	  if (request.readyState == 4 && request.status == 200) {
	    display(request.responseText, document.querySelector("#text"));
	  }
	};

	request.open("GET", path, true);
	request.send();
}

window.onload = function () { requestText("Text/lorem.txt") };