// --- Parsing --- //

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

function parse (text) {
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

  return result.document;
}