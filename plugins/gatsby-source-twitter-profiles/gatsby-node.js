const crypto = require("crypto");
const _ = require("lodash");
const Twitter = require("twitter");
const addDescriptionLinks = require("./add-description-links");

const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

function includes(description, terms) {
  return terms.some((term) => {
    // The terms should not appear within a word. This means that they must
    // include a space or any other non-letter.
    //
    // For example, we don't want "Oakland" to appear as "la" because Oakland
    // contains "la" within the string. We also want "writer/designer" to
    // register as both writer and designer.
    //
    // We add a space around `${description}` so that the regex captures
    // descriptions that start with the term. The regex alone is not able to
    // handle that.
    const regex = RegExp(`[\\W]${term}[\\W]`, "gi");
    return regex.test(` ${description} `);
  });
}

function getProfileProgram({ description }) {
  return {
    mask: includes(description, ["100M mask mayday", "100MMM Mayday"]),
    li: includes(description, ["projectli", "project li"]),
    truthbot: includes(description, ["truth bot brigade", "truth bot", "truthbot", "truthbot brigade"]),
    earthspeaks: includes(description, ["earth speaks", "earthspeaks"]),
    designedby: includes(description, ["designed by", "designedby"]),
    breathe: includes(description, ["breathestat", "breathe stat"]),
    fivethings: includes(description, ["5things live"]),
    indisting: includes(description, ["indistinguishable"]),
    consensual: includes(description, ["consensual"]),
    democracy: includes(description, ["designing democracy"]),
    melange: includes(description, ["melange"]),
    kakuma: includes(description, ["studio kakuma"]),
  };
}

function getProfilePosition({ description }) {
  return {
    inventor: includes(description, ["inventor"]),
    ceo: includes(description, ["ceo"]),
    distinguisheddesigner: includes(description, ["distinguished designer"]),
    founder: includes(description, ["founder", "co-founder", "cofounder"]),
    apprentice: includes(description, ["apprentice"]),
    designfellow: includes(description, ["design fellow"]),
    cdo: includes(description, ["chief design officer"]) &&
      !includes(description, ["cdo"]),
    corps: includes(description, ["design corps"]),
    speaker: includes(description, ["speaker"]),
    entrepreneur: includes(description, ["entrepreneur", "business"]),
    vp: includes(description, ["vp"]),
  };
}

function getProfileExpertise({ description }) {
  return {
    datascience: includes(description, ["data scientist","data engineer", "Machine Learning Engineer", "Machine Learning Scientist", "Applications Architect", "Enterprise Architect", "Data Architect", "Infrastructure Architect", "Statistician", "Data Analyst", "data"]),
    prodmanager: includes(description, ["product manager", "product design manager"]),
    designtech: includes(description, ["design technologist"]),
    animator: includes(description, ["animator", "generative", "character designer", "stop motion", "flash animator", "composting artist", "visual effects modeling", "rigging", "layout artist"]),
    cognitive: includes(description, ["cognitive design", "cognitive experience designer", "ai", "iot", "ai designer", "machine learning", "generative design", "creative coding", "cognitive ergonomics", "neuro ergonomics", "algorithmic design", "machine learning", "ergonomics"]),
    engineer: includes(description, ["engineer", "engineering"]),
    industrial: includes(description, ["industrial designer", "Industrial Engineer", "Tool design", "Stencil making", "Automobile designer", "Airline interior designer", "furniture designer", "appliance designer", "toy designer", "footwear designer"]),
    technologist: includes(description, ["technologist"]),
    scientist: includes(description, ["scientist", "Dr. Science", "Dr.", "science", "Audiologist", "doctor", "astronomer", "botanist", "epidemiologist", "ethologist", "Biologist", "Biomedical Engineer", "Cell Biologist", "Chemist", "Geologist", "marine biologist", "oceanographer", "Seismologist", "Zoologist", "Volcanologist", "Archaeologist", "Virologist"]),
    interior: includes(description, ["interior design", "interior designer", "Interior", "Spatial Designer", "Exhibition Designer", "visual merchandiser"]),
    research: includes(description, ["research", "researcher"]),
    artist: includes(description, ["artist", "actor", "musician", "painter", "sculptor", "singer", "art director", "talent", "photographer", "illustrator", "calligrapher", "printmaker", "graphic arts", "drawing", "generative art", "literature", "cinema", "pop art"]),
    fashion: includes(description, ["fashion design", "fashion designer", "fashion"]),
    architect: includes(description, ["architect"]),
    writer: includes(description, ["writer", "screenwriter"]),
    human: includes(description, ["human factors", "HCI", "human-computer interaction", "ergonomics", "workplace safety", "human error", "product design", "usability", "safety scientist", "Usability Engineering", "Cognitive", "Experimental Psychology", "Kinesiology", "Industrial Design", "Biomedical Engineering", "ux"]),
    voice: includes(description, ["voice design", "voice designer" ]),
    sound: includes(description, ["sound design", "sound designer", "SFX", "Voice Over", "music", "audio effects", "foley sounds", "dialogue", "audio production", "radio", "digital audio", "musical",  "audiography", "sound mixer", "Boom operator", "sound technician", "sound editor", "Re-recording mixer", "Foley artist", "Dubbing ADR", "Composer", "Music supervisor", "Music editor", "Orchestrator"]),
    math: includes(description, ["mathematician", "math"]),
    gesture: includes(description, ["gesture design", "gesture designer"]),
    proddesign: includes(description, ["sets", "props", "lighting", "graphics", "costumes", "camera angles", "theatre", "film", "television", "tv", "podcast productions", "entertainment", "production", "production designer", "production design"]),
  };
}

exports.sourceNodes = async (
  { actions, createNodeId, store, cache },
  { bearerToken, consumerKey, consumerSecret, twitterIdForFollowingList }
) => {
  if (!bearerToken) {
    throw new Error(
      "You must provide a `bearerToken` to `gatsby-source-twitter-profiles`."
    );
  }

  const { createNode } = actions;

  const client = new Twitter({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    bearer_token: bearerToken,
  });

  const followingList = await client.get("friends/ids", {
    user_id: twitterIdForFollowingList,
    stringify_ids: true,
  });

  const chunkedDesigners = await Promise.all(
    _.chunk(followingList.ids, 100).map(async (chunk) => {
      const results = await client.get("users/lookup", {
        user_id: chunk.join(","),
      });

      return results;
    })
  );

  const profiles = _.flatten(chunkedDesigners);

  await Promise.all(
    profiles.map(async (profile) => {
      const jsonString = JSON.stringify(profile);

      const gatsbyNode = {
        profile: {
          ...profile,
          description: addDescriptionLinks(profile),
          tags: {
            program: getProfileProgram(profile),
            expertise: getProfileExpertise(profile),
            position: getProfilePosition(profile),
          },
        },
        id: createNodeId(`Twitter Profile: ${profile.id_str}`),
        parent: "__SOURCE__",
        children: [],
        internal: {
          type: "TwitterProfile",
          contentDigest: crypto
            .createHash("md5")
            .update(jsonString)
            .digest("hex"),
        },
      };

      const fileNode = await createRemoteFileNode({
        url: profile.profile_image_url_https.replace("_normal", "_400x400"),
        store,
        cache,
        createNode,
        createNodeId,
      });

      if (fileNode) {
        gatsbyNode.localFile___NODE = fileNode.id;
      }

      createNode(gatsbyNode);
    })
  );
};
