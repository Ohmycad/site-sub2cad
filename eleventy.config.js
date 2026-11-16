const slugify = (s) =>
  (s || "")
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

module.exports = function (eleventyConfig) {
  // Site vitrine : copié tel quel (jamais passé au moteur de gabarits)
  [
    "src/.nojekyll",
    "src/index.html",
    "src/mentions-legales",
    "src/confidentialite",
    "src/assets",
    "src/css",
    "src/js",
    "src/robots.txt",
    "src/llms.txt",
  ].forEach((p) => eleventyConfig.addPassthroughCopy(p));
  ["src/index.html", "src/mentions-legales/**", "src/confidentialite/**"].forEach((p) =>
    eleventyConfig.ignores.add(p)
  );

  eleventyConfig.addFilter("slug", slugify);
  eleventyConfig.addFilter("dateFR", (d) =>
    new Date(d).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })
  );
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString());
  eleventyConfig.addFilter("byCategory", (posts, name) =>
    (posts || []).filter((p) => p.data.category === name)
  );

  eleventyConfig.addCollection("post", (c) =>
    c.getFilteredByTag("post").sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("categories", (c) => {
    const map = new Map();
    c.getFilteredByTag("post").forEach((p) => {
      const cat = p.data.category;
      if (cat) map.set(cat, (map.get(cat) || 0) + 1);
    });
    return [...map.entries()].map(([name, count]) => ({ name, slug: slugify(name), count }));
  });

  return {
    dir: { input: "src", includes: "_includes", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
