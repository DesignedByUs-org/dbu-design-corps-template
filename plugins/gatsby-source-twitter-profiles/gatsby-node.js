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

function getProfileLocation({ location }) {
  return {
    mask: includes(location, ["100M mask mayday"]),
    li: includes(location, ["projectli", "project li"]),
    truthbot: includes(location, ["truth bot brigade", "truth bot"]),
    earthspeaks: includes(location, ["earth speaks"]),
    designedby: includes(location, ["designed by"]),
    breathe: includes(location, ["breathestat", "breathe stat"]),
    fivethings: includes(location, ["5things live"]),
    indisting: includes(location, ["indistinguishable"]),
    consensual: includes(location, ["consensual"]),
    democracy: includes(location, ["designing democracy"]),
    melange: includes(location, ["melange"]),
    kakuma: includes(location, ["studio kakuma"]),
  };
}

function getProfilePosition({ description }) {
  return {
    inventor: includes(description, ["inventor"]),
    ceo: includes(description, ["ceo"]),
    distinguisheddesigner: includes(description, ["distinguished designer"]),
    founder: includes(description, ["founder"]),
    apprentice: includes(description, ["apprentice"]),
    designfellow: includes(description, ["design fellow"]),
    cdo: includes(description, ["chief design officer"]) &&
      !includes(description, ["cdo"]),
    corps: includes(description, ["design corps"]),
    speaker: includes(description, ["speaker"]),
    vp: includes(description, ["vp"]),
  };
}

function getProfileExpertise({ description }) {
  return {
    datascience: includes(description, ["data scientist"]) &&
      !includes(description, ["data engineer"]),
    prodmanager: includes(description, ["product manager"]) &&
      !includes(description, ["product design manager"]),
    designtech: includes(description, ["design technologist"]),
    animator: includes(description, ["animator"]),
    cognitive:
      includes(description, ["cognitive design"]) &&
      !includes(description, ["cognitive experience designer"]),
    engineer: includes(description, ["engineer", "engineering"]),
    industrial: includes(description, ["industrial designer"]),
    technologist: includes(description, ["technoogist"]),
    scientist: includes(description, ["scientist"]),
    interior: includes(description, ["interior design", "interior designer"]),
    research: includes(description, ["research", "researcher"]),
    artist: includes(description, ["artist",]),
    fashion: includes(description, ["fashion design", "fashion designer"]),
    architect: includes(description, ["architect"]),
    writer: includes(description, ["writer"]),
    human: includes(description, ["human factors"]),
    voice: includes(description, ["voice design", "voice designer" ]),
    sound: includes(description, ["sound design", "sound designer"]),
    gesture: includes(description, ["gesture design", "gesture designer"]),
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
            location: getProfileLocation(profile),
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
