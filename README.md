# Running Superuman Voting Script

### Installation

```bash
yarn
```

### Usage

Once installed, you can edit the params and deploy the script using:

```bash
yarn test
```

If you would like the script to be output to a separate file, use:

```bash
yarn test > votingParams.txt
```

In the current state, the commitVote and revealVote contract calls can easily be copied and pasted into the Snapshot Transaction JSON input. The retrieveRewards contract call needs the params that are output to be manually input as arguments.

TODO: 
1. Change the contract calls to batchCommit and batchReveal.
2. Check with gnosis/snapshot on reason tuple is not being imported.
