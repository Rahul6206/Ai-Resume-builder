const Handlebars = require("handlebars");

function registerHandlebarsHelpers() {

    Handlebars.registerHelper("join", (arr) => arr?.join(", ") || "");

    Handlebars.registerHelper("ifEmpty", function (v, opts) {
        return v && v.length ? opts.fn(this) : opts.inverse(this);
    });

    Handlebars.registerHelper("formatDate", function (date) {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d)) return date;
        return d.toLocaleString("en-US", { month: "short", year: "numeric" });
    });

    Handlebars.registerHelper("formatRange", function (start, end) {
        const s = Handlebars.helpers.formatDate(start);
        const e = end ? Handlebars.helpers.formatDate(end) : "Present";
        return `${s} - ${e}`;
    });
}

module.exports = { registerHandlebarsHelpers, Handlebars };