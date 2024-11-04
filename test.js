import assert from "assert";
import expand, { get } from "./index.js";

const checkExpand = (template, data, expected) => {
  const out = expand(template, data);
  assert.strictEqual(
    out,
    expected,
    `expand("${template}", ${JSON.stringify(data)}) should be ${expected}, got ${out}`,
  );
  console.log(` ✓ expand("${template}", ${JSON.stringify(data)})`);
};

[
  {
    template: `hello {name} and {name}`,
    data: { name: "world" },
    expected: "hello world and world",
  },
  {
    template: `hello {foo.bar}`,
    data: { foo: { bar: "world" } },
    expected: "hello world",
  },
].map((t) => {
  checkExpand(t.template, t.data, t.expected);
});

let obj = {
  undef: undefined,
  zero: 0,
  one: 1,
  n: null,
  f: false,
  a: {
    two: 2,
    b: {
      three: 3,
      c: {
        four: 4,
      },
    },
  },
};

const checkGetter = (path, value, def) => {
  const out = get(obj, path, def);
  assert.strictEqual(
    out,
    value,
    `get(obj, "${path}") should be ${value}, got ${out}`,
  );
  console.log(` ✓ get(obj, "${path}"${def ? ', "' + def + '"' : ""})`);

  if (path) {
    const arr = path.split(".");
    assert.strictEqual(get(obj, arr, def), value);
    console.log(
      ` ✓ get(obj, ${JSON.stringify(arr)}${def ? ', "' + def + '"' : ""})`,
    );
    console.log(` ✓ get(obj, ${JSON.stringify(arr)})`);
  }
};

console.log("> No Defaults");
checkGetter("", undefined);
checkGetter("one", obj.one);
checkGetter("one.two", undefined);
checkGetter("a", obj.a);
checkGetter("a.two", obj.a.two);
checkGetter("a.b", obj.a.b);
checkGetter("a.b.three", obj.a.b.three);
checkGetter("a.b.c", obj.a.b.c);
checkGetter("a.b.c.four", obj.a.b.c.four);
checkGetter("n", obj.n);
checkGetter("n.badKey", undefined);
checkGetter("f", false);
checkGetter("f.badKey", undefined);

// test defaults
console.log("\n> With Defaults");
checkGetter("", "foo", "foo");
checkGetter("undef", "foo", "foo");
checkGetter("n", null, "foo");
checkGetter("n.badKey", "foo", "foo");
checkGetter("zero", 0, "foo");
checkGetter("a.badKey", "foo", "foo");
checkGetter("a.badKey.anotherBadKey", "foo", "foo");
checkGetter("f", false, "foo");
checkGetter("f.badKey", "foo", "foo");

// check undefined key throws an error
assert.throws(get.bind(this, obj, undefined));
assert.throws(get.bind(this, obj, undefined, "foo"));

// check undefined obj doesn't throw errors and uses default
const backupObj = obj;
obj = undefined;
checkGetter("one", undefined);
checkGetter("one", "foo", "foo");
obj = backupObj;

console.log("✅ Success!");
process.exit(0);
