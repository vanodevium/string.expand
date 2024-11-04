const get = (o, k, d, u) => {
  const v = (k?.split?.call ? k.split(".") : k).reduce(
    (acc, k) => (acc ? acc?.[k] : u),
    o,
  );

  return v === u ? d : v;
};

const expand = (tpl = "", data = {}, options = {}) => {
  options = Object.assign({}, options, {
    delimiters: ["{", "}"],
    sanitize: false,
  });

  const re = new RegExp(
    `${options.delimiters[0]}([\\s\\S]+?)${options.delimiters[1]}`,
    "g",
  );

  return tpl.replace(re, function (_, exp) {
    if (options.sanitize) {
      if (typeof options.sanitize === "function") {
        return options.sanitize(exp);
      }

      return new Function("data", "with (data) {return " + exp + "}")(data);
    }

    return get(data, exp);
  });
};

export default expand;
export { expand, get };
