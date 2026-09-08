const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const { matches, edit } = require("../lib/store");

const NOTES_FILE = path.join(__dirname, "..", "notes.json");

const notes = [
  { id: 1, text: "buy milk" },
  { id: 2, text: "call the bank" },
  { id: 3, text: "milk the almonds" },
];

test("search finds every note that contains the term", () => {
  const result = matches(notes, "milk");
  assert.strictEqual(result.length, 2);
});

test("search finds a single containing note", () => {
  const result = matches(notes, "bank");
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].id, 2);
});

test("search returns nothing when no note contains the term", () => {
  const result = matches(notes, "xyz");
  assert.strictEqual(result.length, 0);
});

test("edit returns false and leaves the store untouched when the id doesn't exist", () => {
  const hadFile = fs.existsSync(NOTES_FILE);
  const original = hadFile ? fs.readFileSync(NOTES_FILE, "utf8") : null;
  fs.writeFileSync(NOTES_FILE, JSON.stringify({ nextId: 2, notes: [{ id: 1, text: "buy milk" }] }));

  try {
    const ok = edit(999, "new text");
    assert.strictEqual(ok, false);

    const data = JSON.parse(fs.readFileSync(NOTES_FILE, "utf8"));
    assert.strictEqual(data.notes[0].text, "buy milk");
  } finally {
    if (hadFile) {
      fs.writeFileSync(NOTES_FILE, original);
    } else {
      fs.unlinkSync(NOTES_FILE);
    }
  }
});
