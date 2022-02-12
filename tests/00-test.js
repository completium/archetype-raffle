const {
  deploy,
  getAccount,
  setQuiet,
  expectToThrow,
  setMockupNow,
  setEndpoint,
  getBalance,
  checkBalanceDelta } = require('@completium/completium-cli');
const assert = require('assert');

// Mockup mode
setQuiet(true);
setEndpoint('mockup')

// Mockup Time
const now = Math.floor(Date.now() / 1000)
setMockupNow(now)

// Contract
let raffle;

// Constants
const JACKPOT           = "50tz"
const TICKET_PRICE      = "1tz"
const MIN_DURATION      = 60 * 60   // 1 hour
// Raffle key is 123456, timelock duration is 1 hour
const LOCKED_RAFFLE_KEY = "0xc5ecdde89eb8c1e7aaeb85abb8f5e5cef3b4fa80c4aee2fccbf0a78ce0debaa5e9ddede3ddfbd9abdea28cc7dc99e6d3a9baf3cbae9adaaabc89cbc39e97e2c7a6cba99197d19ba09ddfd181afc997ffbcc5acb2d29ecbb698c2cacbdd83d1b4ced0bffe9cd78295b3fba4d9f9d5f4d4ec9ad3c7e1a8eeb9dba5cbd8a2dbf29af8e4a4c1e4b1edacf98fccefaef9fea4f0bacdd38ecbfe81c3f9839b9e9ab8fbf5f1eabac48a9f8ca7c588eefe94d1f18bd9bcee9aecde8dd285cf9098f4e1a7eec787f3a0e0ff9cd0ce8ec5a2a4e5ecb08fce899eb5baa397fabf90de9397cebc81bbdfb386e6b4da9fd8fdd19ed9f8d684c782b0aacfeebae4f6e7d1c5c1e6a093c68081cf83b991b4ecd7b38aee92deddcad79eb9abe0a0a0c6b5909dc58495f69445fff5ae9cefe8b8beb2fb86ccf5c9ad91989bdad8a3cfbedaffa2de8bf19dc6ac8cbc8a9584fa9f85f9ba958fc6bbc09ac8e7d5f0fdb98b86c1c7d59ad7c6dfc2d2cefaf5d9db909bf0e3acd3ccc792bc9bccbab4a4febda9b685dbc39ea2a4a7b69990d3abd8b9b3d7dbc581b984f3e08a98f7f7f0e697cc8dfd88edc8c3ca8dc3b2a9ccf6cdd6d0efcc848bc8ead5858bbabfcfc1c8ecea84fd9b96a5e4eabb8c918dafe6f78d83e8e1c2e5f8ee88a4ee8dcaeeafffebfcbbfda1e9eb86c582f2eedd9299cbc0a7fce083ced8c8ddb0e7eaacb696c1fccdadcdc8e3c6f7b9de84eece9bb7919094fef4fdf6efd8b1ba8bbecb9380add4f59ddbf9a19f95facc84e9d0a99bfa93f1fcc3a0fbde9b9ce0c7e8dec6e8d1dfa7dda6f490bb9580abfdbcc0e202e5ff731c3c17d080ee430edd30979a47aa653656e11e593800000015c2ca2a23b732a72932611618ad9ea324986377591e"
const CHEST_KEY         = "0xa0aceddfb3c9fbe1b8c382c7d5a7dedbe2e5adf9edcfc3e9d084caa6aeb9818ff1e985cb9efe8fa089ceeaa0f5d0bcb583e2f29196f2d3908fffffdcda868faffcb78fb697e7eaf3e7dca9d4b5dda2c3e4f8adf8abf484ecae85f7d6e0f2d28cb69af1d7b19082e8d8d7ba96e7e1e0bb8ac9b9fcf0a9e5b7c1a499c4faf4c8a3a9c8e4d09aa780eac6cee1b78a97a3e983abf9a5f1e8d2a2a2b5e3bcb8c4effeb7a3a68a85a497cd91c9a2c096c3f596deb8d1aca3a5aff28effb8cfc9c7ced892e3a7c09deeb8c8ec9387a3b384b5c8bccaafc7a9a2c1cfd8c7becfd7d6828a9af8f4988fe4ead3b59ecfb8ff8cabf8be90d4c8bdbddfce9cd7c2bb81edc4b7ad80a59a978f8c9debe7aaf08cf0c588f3eaade6b9f4e4e6edf1ed9c9988e48d9ba0aa8f01d18bac92b886db9dd798b5f6fdc891a28da2c4c48da1918897a2b7c2dfa0b78ab8e291b68fb1a2bfa5e8b88e9cabb0b5b0feabcffc9cfeee888ac4afeed9dc8bf5a4eaa9ae89a3838cf6cfd4f8acff8fa7aef7a9889fbbc7d8f6dde4edf3e58096e580e299e5b082b9cf85f3fe8ac6c0998eb1bcbab9bfb8fba39faea7bce0f6fed9ea86dfdad58cf7cbc7fcc4ecf7e2e898d3b19582e38c8092b7e4a0cddc83eb8bc38d91fefed6be869496b8e4fc99d5fae5c6a2b2dcabe2a4ea85b68b87b182d7e8cac29fe0b9efd6d0eb999ffa98aaaf9bf09fe7c4b39d81db97e4e7bbaef0e3bfedd69d9089bc8d91b292afa6c8b389fc9fb7aaa8decab6d9b493a6eafaa5baffe8fb85f2d483ecd1f2d1e58f938df9d8d5e385fe96c5f58ae1e0b09bf2b3c2931f"
const INVALID_CHEST_KEY = "0xa0aceddfb3c9fbe1b8c382c7d5a7dedbe2e5adf9edcfc3e9d084caa6aeb9818ff1e985cb9efe8fa089ceeaa0f5d0bcb583e2f29196f2d3908fffffdcda868faffcb78fb697e7eaf3e7dca9d4b5dda2c3e4f8adf8abf484ecae85f7d6e0f2d28cb69af1d7b19082e8d8d7ba96e7e1e0bb8ac9b9fcf0a9e5b7c1a499c4faf4c8a3a9c8e4d09aa780eac6cee1b78a97a3e983abf9a5f1e8d2a2a2b5e3bcb8c4effeb7a3a68a85a497cd91c9a2c096c3f596deb8d1aca3a5aff28effb8cfc9c7ced892e3a7c09deeb8c8ec9387a3b384b5c8bccaafc7a9a2c1cfd8c7becfd7d6828a9af8f4988fe4ead3b59ecfb8ff8cabf8be90d4c8bdbddfce9cd7c2bb81edc4b7ad80a59a978f8c9debe7aaf08cf0c588f3eaade6b9f4e4e6edf1ed9c9988e48d9ba0aa8f01d18bac92b886db9dd798b5f6fdc891a28da2c4c48da1918897a2b7c2dfa0b78ab8e291b68fb1a2bfa5e8b88e9cabb0b5b0feabcffc9cfeee888ac4afeed9dc8bf5a4eaa9ae89a3838cf6cfd4f8acff8fa7aef7a9889fbbc7d8f6dde4edf3e58096e580e299e5b082b9cf85f3fe8ac6c0998eb1bcbab9bfb8fba39faea7bce0f6fed9ea86dfdad58cf7cbc7fcc4ecf7e2e898d3b19582e38c8092b7e4a0cddc83eb8bc38d91fefed6be869496b8e4fc99d5fae5c6a2b2dcabe2a4ea85b68b87b182d7e8cac29fe0b9efd6d0eb999ffa98aaaf9bf09fe7c4b39d81db97e4e7bbaef0e3bfedd69d9089bc8d91b292afa6c8b389fc9fb7aaa8decab6d9b493a6eafaa5baffe8fb85f2d483ecd1f2d1e58f938df9d8d5e385fe96c5f58ae1e0b09bf2b3c2931a"

// Errors
const errors = {
  INVALID_CALLER        : '"InvalidCaller"',
  INVALID_CLOSE_DATE    : '"INVALID_CLOSE_DATE"',
  INVALID_AMOUNT        : '"INVALID_AMOUNT"',
  INVALID_TICKET_PRICE  : '"INVALID_TICKET_PRICE"',
  PLAYER_ALREADY_EXISTS : '(Pair "KeyExists" "player")',
  RAFFLE_CLOSED         : '"RAFFLE_CLOSED"',
  RAFFLE_OPEN           : '"RAFFLE_OPEN"',
  INVALID_TIMELOCK      : '"INVALID_TIMELOCK"',
  INVALID_STATE         : '"InvalidState"'
}

const closeTo = (value, target, epsilon) => { return Math.abs(value - target) < epsilon }

// Accounts
const owner = getAccount('bootstrap1');
const alice = getAccount('alice');
const jack  = getAccount('bootstrap2');

describe("Deploy", async () => {
  it("Raffle", async () => {
    [raffle, _] = await deploy('./contract/raffle.arl', {
      parameters: {
        owner        : owner.pkh,
        min_duration : MIN_DURATION,
        jackpot      : JACKPOT,
        ticket_price : TICKET_PRICE
      },
      as: owner.pkh
    });
  });
});

describe("Open Raffle", async () => {
  it("The unauthorized user Alice unsuccessfully calls 'open' entrypoint.", async () => {
    await expectToThrow(async () => {
      await raffle.open({
        arg : {
          cd    : now,
          d     : "Raffle test",
          lrk   : LOCKED_RAFFLE_KEY
        },
        as : alice.pkh
      })
    }, errors.INVALID_CALLER)
  });
  it("Admin unsuccessfully calls 'open' entrypoint with wrong 'close_date'.", async () => {
    await expectToThrow(async () => {
      await raffle.open({
        arg : {
          cd    : [now + MIN_DURATION - 10],
          d     : "Raffle test",
          lrk   : LOCKED_RAFFLE_KEY
        },
        as : owner.pkh
      })
    }, errors.INVALID_CLOSE_DATE)
  });
  it("Admin unsuccessfully calls 'open' entrypoint by sending not enough tez to the contract.", async () => {
    await expectToThrow(async () => {
      await raffle.open({
        arg : {
          cd    : [now + MIN_DURATION + 10],
          d     : "Raffle test",
          lrk   : LOCKED_RAFFLE_KEY
        },
        as : owner.pkh
      })
    }, errors.INVALID_AMOUNT)
  });
  it("Admin successfully calls 'open' entrypoint.", async () => {
    await raffle.open({
      arg : {
        cd    : [now + MIN_DURATION + 10],
        d     : "Raffle test",
        lrk   : LOCKED_RAFFLE_KEY
      },
      as : owner.pkh,
      amount : JACKPOT
    })
  });
  it("Admin unsuccessfully calls 'open' entrypoint because a raffle is already open.", async () => {
    await expectToThrow(async () => {
      await raffle.open({
        arg : {
          cd    : [now + MIN_DURATION + 10],
          d     : "Raffle test",
          lrk   : LOCKED_RAFFLE_KEY
        },
        as : owner.pkh,
        amount : JACKPOT
      })
    }, errors.INVALID_STATE)
  });
});
describe("Test 'buy' entrypoint (at this point a raffle is open)", async () => {
  it("Alice unsuccessfully calls 'buy' by sending a wrong amount of tez.", async () => {
    await expectToThrow(async () => {
      await raffle.buy({ as : alice.pkh })
    }, errors.INVALID_TICKET_PRICE)
  });
  it("Alice unsuccessfully calls 'buy' entrypoint because raffle is closed.", async () => {
    setMockupNow(now + MIN_DURATION + 10);
    await expectToThrow(async () => {
      await raffle.buy({
        as : alice.pkh,
        amount : TICKET_PRICE
      })
    }, errors.RAFFLE_CLOSED)
    setMockupNow(now);
  });
  it("Alice successfully calls 'buy' entrypoint.", async () => {
    await raffle.buy({
      as : alice.pkh,
      amount : TICKET_PRICE
    })
  });
  it("Alice unsuccessfully calls 'buy' entrypoint because she has already bought one.", async () => {
    await expectToThrow(async () => {
      await raffle.buy({
        as : alice.pkh,
        amount : TICKET_PRICE
      })
    }, errors.PLAYER_ALREADY_EXISTS)
  });
  it("Jack successfully calls 'buy' entrypoint.", async () => {
    await raffle.buy({
      as : jack.pkh,
      amount : TICKET_PRICE
    })
  });
});
describe("Test 'transfer_jackpot' entrypoint (at this point a raffle is open and two players participated)", async () => {
  it("Alice unsuccessfully calls 'transfer_jackpot' entrypoint because it is before the 'close_date'.", async () => {
    await expectToThrow(async () => {
      await raffle.transfer_jackpot({
        arg : {
          k : CHEST_KEY
        },
        as : alice.pkh
      })
    }, errors.RAFFLE_OPEN)
  });
  it("Alice unsuccessfully calls 'transfer_jackpot' entrypoint because of an invalid chest key.", async () => {
    setMockupNow(now + MIN_DURATION + 10);
    await expectToThrow(async () => {
      await raffle.transfer_jackpot({
        arg : {
          k : INVALID_CHEST_KEY
        },
        as : alice.pkh
      })
    }, errors.INVALID_TIMELOCK)
  });
  it("Alice successfully calls 'transfer_jackpot' entrypoint.", async () => {
    await checkBalanceDelta(owner.pkh,  2, async () => {
    await checkBalanceDelta(alice.pkh, d => closeTo(d, 50, 0.01), async () => {
    await checkBalanceDelta(jack.pkh,   0, async () => {
      await raffle.transfer_jackpot({
        arg : {
          k : CHEST_KEY
        },
        as : alice.pkh
      })
    }) }) })
  });
  it("Alice unsuccessfully calls 'transfer_jackpot' entrypoint because jackpot is already transferred.", async () => {
    await expectToThrow(async () => {
      await raffle.transfer_jackpot({
        arg : {
          k : CHEST_KEY
        },
        as : alice.pkh
      })
    }, errors.INVALID_STATE)
  })
})