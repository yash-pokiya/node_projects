const shortid = require("shortid");

const URL = require("../models/url");

async function generateNewShortUrl(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ msg: "Url must be required..!" });
  }
  if (!body.url.startsWith("http://") && !body.url.startsWith("https://")) {
    body.url = "https://" + body.url;
  }
  const shortId = shortid.generate();
  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.status(200).render( "home", { ShortUrl: shortId });
}

async function redirectMailUrl(req, res) {
  const shortIdParams = req.params.shortId;
  const findShort = await URL.findOneAndUpdate(
    {
      shortId: shortIdParams,
    },
    {
      $push: {
        visitHistory: { timestamp: new Date() },
      },
    },
  );
  if (!findShort) {
    return res.status(404).json({ msg: "Short URL not found" });
  }
  const redirectMailWebLink = findShort.redirectURL;
  return res.redirect(redirectMailWebLink);
}

const viewAnalytics = async (req, res) => {
  const shortId = req.params.shortId;
  const analytics = await URL.findOne({ shortId });
  res
    .status(200)
    .render("analytics" , {
      shortId , 
      totalClicks : analytics.visitHistory.length,
      history : analytics.visitHistory,
    })
};

const homeRender = async(req,res) => {
  const allUrls = await URL.find({});
 return res.render("home", {
  urls : allUrls
 });
}

module.exports = {
  generateNewShortUrl,
  redirectMailUrl,
  viewAnalytics,
  homeRender
};
