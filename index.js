const web3 = require("web3");
const { padRight, utf8ToHex } = web3.utils;

const { getRandomSignedInt, computeVoteHashAncillary } = require("@uma/common");

// Set these params for each vote
let account = "0x7C7a1407c35B695E4eE530D80d4bd4C1aF8569E5";
let rawIdentifier = "ACROSS-V2";
let ancillaryData =
  "0x6f6f5265717565737465723a63313836666139313433353363343462326533336562653035663231383436663130343862656461";
let roundId = "9598";
let priceOptions = ["0"];
let time = 1658397474;
let votingContract = "0x8B1631ab830d11531aE83725fDa4D86012eCCd77";

// helpers (no need to edit)
let salt = getRandomSignedInt();
let identifier = padRight(utf8ToHex(rawIdentifier), 64);

// examples if you want to manually input the salt or identifier
// let salt = "10362209928390478891184510577979174390435882974088600354474359802993390640650"
// let identifier = "0x4143524f53532d56320000000000000000000000000000000000000000000000"

function voteParams() {
  priceOptions.map((price) => {
    const hash = computeVoteHashAncillary({
      price: price,
      salt: salt,
      account: account,
      time: time,
      ancillaryData: ancillaryData,
      roundId: roundId,
      identifier: identifier,
    });

    // The commit and reveal are easily imported into the Snapshot tx builder.
    let commitVote = `[{"to": "${votingContract}","value": "0", "method":"commitVote(bytes32,uint256,bytes,bytes32)", "params": ["${identifier}", "${time}", "${ancillaryData}", "${hash}"], "operation":"0"},`;

    let revealVote = `{"to": "${votingContract}","value": "0","method":"revealVote(bytes32,uint256,int256,int256)","params": ["${identifier}", "${time}", "${price}","${salt}"],"operation":"0"}]`;

    // retrieve rewards needs to manually be input for each argument into the tx builder due to an issue with tuples.
    // make sure you are on the same network as the voting contract or the abi will not populate.
    let retrieveRewards =
      ' "Type":" Contract interaction",\n' +
      ' "To (address)":"' +
      votingContract +
      '",\n' +
      ' "value": "0",\n' +
      ' "function": "retrieveRewards()",\n' +
      ' "voterAddress (address)":"' +
      account +
      '",\n' +
      ' "roundId (uint256)":"' +
      roundId +
      '",\n' +
      ' "toRetrieve (tuple[])": [{"identifier":"' +
      identifier +
      '","time":"' +
      time +
      '","ancillaryData":"' +
      ancillaryData +
      '"}]\n';

    console.log(
      `\n\ncommitVote and revealVote params for ${price}:\n` +
        commitVote +
        `\n` +
        revealVote +
        `\n\n` +
        retrieveRewards
    );
    console.log("- The salt used for commitVote: " + salt);
  });
}

voteParams();
