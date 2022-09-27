# Running Superuman Voting Script

### Installation

```bash
yarn
```

### Usage

Once installed, you can edit the params and deploy the script using:

```bash
node index.js
```

If you would like the script to be output to a separate file, use:

```bash
node index.js > votingRound_{inputRoundID}.txt
```

In the current state, the commitVote and revealVote contract calls can easily be copied and pasted into the Snapshot Transaction JSON input. The retrieveRewards contract call needs the params that are output to be manually input as arguments.

### Notes on Params

Timestamp: Use etherscan / events. Set timestamp param for each vote

rawIdentifier: Use etherscan / events. Use https://web3-type-converter.onbrn.com/ to convert value.

roundId: Find using voting contract

ancillaryData: Use etherscan / events. Use https://web3-type-converter.onbrn.com/ to convert value.

priceOptions
- 0 is "NO" 
- 1 is "YES" / "1000000000000000000". Use https://eth-converter.com/.
- magic number is -57896044618658097711785492504343953926634992332820282019728792003956564819968