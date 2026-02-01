const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
let puppeteer;
let chromium;

if (process.env.NODE_ENV === "production") {
    puppeteer = require("puppeteer-core");
    chromium = require("@sparticuz/chromium");
} else {
    puppeteer = require("puppeteer");
}



const { generateWithGemini, safeExtractJSON } = require("../utils/geminiHelpers");
const { registerHandlebarsHelpers, Handlebars } = require("../utils/templateHelpers");

registerHandlebarsHelpers();

module.exports.GenerateAiResume = async (req, res) => {
    const template = req.body?.template;
    const resumeData = req.body?.resumeData; 

    if (!template) {
        return res.status(400).json({ message: "Template not provided" });
    }


    let browser;

    try {



        if (!resumeData)
            return res.status(400).json({ message: "No resume data received" });

        const cleanedResumeData = { ...resumeData };
        delete cleanedResumeData._id;
        delete cleanedResumeData.createdAt;
        delete cleanedResumeData.updatedAt;
        delete cleanedResumeData.user;


        const aiPrompt = `
You are a professional ATS resume rewriting AI. Rewrite and enhance the entire resume using the user-provided JSON.

### RULES:
- Fill the entire A4 page with strong, professional, concise content.
- Keep the SAME JSON structure and keys.
- Improve ALL sections (summary, experience, projects, education, skills).
- Expand weak descriptions with context-based, realistic achievements.
- Do NOT invent fake companies, fake internships, fake degrees.
- Do NOT add extra JSON keys.
- Keep formatting clean (no markdown).
- Return ONLY valid JSON.

### Input JSON:
${JSON.stringify(cleanedResumeData, null, 2)}`;

        let improvedData = cleanedResumeData;

        try {
            const aiResponse = await generateWithGemini(aiPrompt);
            improvedData = safeExtractJSON(aiResponse);
        } catch (err) {
            console.warn("AI rewrite failed , using original data", err.message);
        }

        // sanitize
        for (const key in improvedData) {
            if (typeof improvedData[key] === "string") {
                improvedData[key] = sanitizeHtml(improvedData[key], {
                    allowedTags: [],
                    allowedAttributes: {},
                });
            }
        }
        const templatePath = path.join(
            __dirname,
            "..",
            "templates",
            `${template}.html`
        );
        if (!fs.existsSync(templatePath)) {
            return res.status(400).json({
                message: `Template file not found: ${template}.html`,
            });
        }

        const htmlTemplate = fs.readFileSync(templatePath, "utf8");
        const compiledHTML = Handlebars.compile(htmlTemplate)(improvedData);

        // launch ONCE
        if (process.env.NODE_ENV === "production") {
            const executablePath = await chromium.executablePath();

            browser = await puppeteer.launch({
                args: chromium.args,
                executablePath: executablePath || "/usr/bin/google-chrome",
                headless: chromium.headless,
            });
        } else {
            browser = await puppeteer.launch({ headless: true });
        }






        const page = await browser.newPage();
        await page.setContent(compiledHTML, {
            waitUntil: "load",
            timeout: 60000,
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' }
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=AI_Resume_${template}.pdf`,
            "Content-Length": pdfBuffer.length,
        });


        return res.send(pdfBuffer);

    } catch (error) {
        console.error("Resume Generation Error:", error);
        return res.status(500).json({
            message: "Error generating resume",
        });
    }
    finally {
        if (browser) {
            await browser.close();
        }

    }
};