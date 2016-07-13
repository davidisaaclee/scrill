// --- Model --- //

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

_.extend(Paragraph.prototype, {
  appendAtom: function (atom) {
    this.atoms.push(atom);
    return this;
  }
});