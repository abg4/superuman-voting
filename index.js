const web3 = require("web3");
const { padRight, utf8ToHex } = web3.utils;
const { getRandomSignedInt, computeVoteHashAncillary } = require("@uma/common");

// networks file (https://github.com/UMAprotocol/protocol/blob/master/packages/core/networks/1.json)
let votingContract = "0x8B1631ab830d11531aE83725fDa4D86012eCCd77";
// voter dapp or voting contract
let roundId = "9657";
// safe address (should not need to be changed)
let safe = "0xC75aDbf2a5a6A51302c1c7cC789366ed16e1E0F3";
// voter dapp
let rawIdentifier = "YES_NO_QUERY";
// voter dapp
let ancillaryData =
  "0x6F6F5265717565737465723A63313836666139313433353363343462326533336562653035663231383436663130343862656461";
// price you are voting for. Should be 0, 1000000000000000000, or magic number (TODO: add value)
let priceOptions = ["1000000000000000000"];
// voter dapp
let time = 1668720167;

// helpers (no need to edit)
let salt = getRandomSignedInt();
let identifier = padRight(utf8ToHex(rawIdentifier), 64);

function voteParams() {
  priceOptions.map((price) => {
    const hash = computeVoteHashAncillary({
      price: price,
      salt: salt,
      account: safe,
      time: time,
      ancillaryData: ancillaryData,
      roundId: roundId,
      identifier: identifier,
    });

    let commitVote = `[{"to": "${votingContract}","value": "0", "method":"commitVote(bytes32,uint256,bytes,bytes32)", "params": ["${identifier}", "${time}", "${ancillaryData}", "${hash}"], "operation":"0"}]`;
    let revealVote = `[{"to": "${votingContract}","value": "0","method":"revealVote(bytes32,uint256,int256,int256)","params": ["${identifier}", "${time}", "${price}","${ancillaryData}","${salt}"],"operation":"0"}]`;

    console.log("Voting Details: ");
    console.log("- Voting Contract: ", votingContract);
    console.log("- Voting Round: ", roundId);
    console.log("- Safe Address: ", safe);

    console.log(commitVote + `\n` + revealVote);
  });
}

voteParams();
