const web3 = require("web3");
const { padRight, utf8ToHex } = web3.utils;

const { getRandomSignedInt, computeVoteHashAncillary } = require("@uma/common");

// helpers (shouldn't need to edit)
let account = "0x7C7a1407c35B695E4eE530D80d4bd4C1aF8569E5"; // never changes
let votingContract = "0x8B1631ab830d11531aE83725fDa4D86012eCCd77"; // Use networks folder in uma repo
let salt = getRandomSignedInt();

let voting = [
  {
    time: 1658397474,
    identifier: padRight(utf8ToHex("YES_OR_NO_QUERY"), 64),
    ancillaryData:
      "0x6f6f5265717565737465723a63313836666139313433353363343462326533336562653035663231383436663130343862656461",
    roundId: "9628",
    price: "1000000000000000000",
  },
  {
    time: 1658397474,
    identifier: padRight(utf8ToHex("YES_OR_NO_QUERY"), 64),
    ancillaryData:
      "0x6f6f5265717565737465723a63313836666139313433353363343462326533336562653035663231383436663130343862656461",
    roundId: "9628",
    price: "1000000000000000000",
  },
];

async function voteParams() {
  let commits = [];
  let reveals = [];

  voting.forEach((x) => {
    const hash = computeVoteHashAncillary({
      price: x.price,
      salt: salt,
      account: account,
      time: x.time,
      ancillaryData: x.ancillaryData,
      roundId: x.roundId,
      identifier: x.identifier,
    });

    let commitVote = `[{"identifier":"${x.identifier}","time":"${x.time}","ancillaryData":"${x.ancillaryData}","hash":"${hash}"}]`;
    let revealVote = `[{"identifier":"${x.identifier}","time":"${x.time}","price":"${x.price}","ancillaryData":"${x.ancillaryData}","salt":"${salt}"}]`;

    commits.push(commitVote);
    reveals.push(revealVote);
  });

  async function getOutput(data) {
    const results = data.map((commit, i, row) => {
      if (i === 0 && row.length === 1) {
        // First and only one.
        return "[" + commit + "]";
      } else if (i === 0 && row.length > 1) {
        // First and not the only one.
        return "[" + commit;
      } else if (i + 1 === row.length && row.length > 1) {
        // Last one
        return commit + "]";
      } else {
        // Not first or last.
        return commit;
      }
    });
    return results;
  }

  async function runScript() {
    const commitData = await getOutput(commits);
    const revealData = await getOutput(reveals);

    console.log(commitData.join());
    console.log("\n" + revealData.join());
  }

  runScript();
}

voteParams();
