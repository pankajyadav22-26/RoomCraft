const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient({
    keyFilename: "EcommerceBackend/APIFile.json",
});

const labelDetectionController = async (req, res) => {
    try {
        const base64Image = req.body.base64Image;

        if (!base64Image) {
            return res.status(400).json({ error: "No image provided in the request." });
        }
        const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const [result] = await client.labelDetection({ image: { content: buffer } });
        const labels = result.labelAnnotations;

        if (!labels || labels.length === 0) {
            return res.status(200).json({ message: "No labels detected in the image." });
        }

        return res.status(200).json({
            message: "Label detected successfully",
            label: labels[0].description,
        });
    } catch (err) {
        console.error("Error occurred:", err.message);
        return res.status(500).json({ error: "An error occurred while detecting labels." });
    }
};

module.exports = { labelDetectionController };