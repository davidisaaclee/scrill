// --- Retrieval --- //

function requestText (path) {
	request(path, "GET", function (responseText) {
		display(responseText, document.querySelector("#text"));
	});
}

function requestFileIndex () {
	request("Text/index.json", "GET", function (responseText) {
		var obj = JSON.parse(responseText);

		if (obj.files !== undefined) {
			obj.files.forEach(function (fileName) {
				requestText("Text/" + fileName);
			});
		}
	});
}


// --- View --- //

// (Int, Int) -> String
function idForAtom (paragraphIndex, atomIndex) {
	return "atom-" + paragraphIndex + "-" + atomIndex;
}

// AtomIndex ::= { paragraphIndex: Int, atomIndex: Int }

// String -> AtomIndex
function parseAtomID (atomID) {
	var split = atomID.split("-");

	return {
		paragraphIndex: parseInt(split[1]),
		atomIndex: parseInt(split[2])
	};
}

// ComparisonResult ::= -1 | 0 | 1

// (AtomIndex, AtomIndex) -> ComparisonResult
// (ComparisonResult = 1 if leftAtom comes before rightAtom)
function compareAtoms (leftAtom, rightAtom) {
	if (leftAtom.paragraphIndex < rightAtom.paragraphIndex) {
		return 1
	} else if (leftAtom.paragraphIndex > rightAtom.paragraphIndex) {
		return -1
	} else {
		if (leftAtom.atomIndex < rightAtom.atomIndex) {
			return 1
		} else if (leftAtom.atomIndex > rightAtom.atomIndex) {
			return -1
		} else {
			return 0
		}
	}
}

function display (text, node) {
	var doc = parse(text);

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
						id: idForAtom(paragraphIndex, atomIndex)
					}
				});
			})
			// Append each element onto the paragraph element.
			.forEach(paragraphElement.appendChild, paragraphElement);

		return paragraphElement;
	}).forEach(node.appendChild, node);
}


// --- Interaction --- //

function handleSelection () {
	var selection = window.getSelection();
	var anchorIndices = parseAtomID(selection.anchorNode.parentElement.id);
	var focusIndices = parseAtomID(selection.focusNode.parentElement.id);

	var start, end;
	if (compareAtoms(anchorIndices, focusIndices) < 0) {
		start = focusIndices;
		end = anchorIndices;
	} else {
		start = anchorIndices;
		end = focusIndices;
	}

	for (var paragraphIdx = start.paragraphIndex; paragraphIdx <= end.paragraphIndex; paragraphIdx++) {
		for (var atomIdx = start.atomIndex; atomIdx <= end.atomIndex; atomIdx++) {
			var element = document.querySelector("#" + idForAtom(paragraphIdx, atomIdx));
			element.classList.add("selected");
		}
	}
}




// --- Run --- //

window.onload = requestFileIndex;