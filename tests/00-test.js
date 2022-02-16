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

// Contract parameters
const JACKPOT           = "50tz"
const TICKET_PRICE      = "5tz"
const MIN_DURATION      = 60 * 60       // 1 hour

// Open argument
const CLOSE_DATE        = [now + MIN_DURATION + 10]  // minimum duration plus 10 seconds
const CHEST_TIME        = 10000000
const REVEAL_FEE        = [ '2', '10' ]              // 20% (archetype rational type is 'pair int nat')

// Partial raffle key one 123456
const LOCKED_RAFFLE_KEY_1 = "0x858b9aafb7d89ca6b9d9f2b683bfd1abd1dabddbc6cbafa48bbdd0ae9afec4e9a6f8ae81e985f8cbd49486ee88ccedc0f5cbcda9b1bfd5f6b8cef0938affb9ce93b186d7f6e7e0c8d3c5e0febeabaead97c4f6caace3dcf8fdee9ba0ba83d88e81a8dbeec5b5f3f7e58dd4c5e1af96a0e7b196a4c2b08980f0b5f0ebf7eca8a19eacdbeaf5faacdba5a6c4d8f995dfebc1c6bae4e9a1fd87b48bdcdafbf7f6b0b19fd9f8c6ec90fba48aa3dde0f0cbe4ccea88ca94c5ccb28f96b89ef0edbcac909afac28ce3def295f1d0d8eddef8df9fe7e7d1dea9a580e1e2cbed92ce8c8cdc8f91a394f68a86e6a0aceb97f8e6f28c90ae8cf3a6b3f3eba58ff4c6e3c2e0b4d1d38b94b5d98cdbda8081c0fa9bcceceaaea7faa897d7cbb694b38bdfb6e1f2c296f603d1ced3abebe5db8ea3e68defdd9ae9cbc6d4f0f3dafae1c78cffdcd6c4fde4ce83d8b2e3ac928bbaa6dc8cc6f8ddf5b8ed95bcb0d8fa9de9c39afd9aa6b08189ebd48addde8fbad6ceffe5e684ad9bede8c9bdbd9e98a3c1e49ed481c3cfad9cc880a795838ed8b8b1bdf6d4fee793e5bbf98c85e4cf89e990f8d5aae9c3e5fcd782bde2f2fe82b0d09ddfc2d8fd92da9af788ee85958286d8aecc91dac28fa9dcb1ca9addcd86e8e989d2e1b7b6fbe0c7afbe97d182ebade5fc9fd2f2baf19a898590f3c0c380f0d5c6aefdc48cefa9cebfd6aad1a083b8cafaa2ffbaa4cb8de2a9acebcbd5ca9ebae0de86e8b6bcc0e8a78f80d28fc397f3abffcd9a8ff3b2ee96d8cbe5dbd39582d6f3aa8ca4c6f1c3d69df3c1b8e0928edbf7c6e6dbe09bbee6df9806ab3f7ef06f7ac1868a1cfa8db0f7a7cd565a7464e5290dff00000015d8c58609c521ed06a5268079693dd0428a9824d377"
const CHEST_KEY_1         = "0xedf6a3dbd5a0e8b2a3d2f5bab5c7def1b3a494ddf7d1c7f2a1ebb0fb82f291d893e7ccc9b4fadfb5ffbfecc3c1f0fdbed0d1bfecc592fed1edcd8ccfdee09ce8afebc6af8f8ce1a181cc87a089f7bebcc0e29eb0feb5defee3d8f5d0dccbd1d1e4b7a2d9f48dffcafad0bfda80ab8285a59ae482e9d9ac98d6bbc3fa98c5f5a8b8e8e294bc94bb96a6b0e7b297c4dc9a818d9ba7affcf1acedd6d7a8fbd6ecaccbeea7f7acbcd4a8ece6d7a89c9bdb87e7acfcbfefd6b09687ed92c8e3dcac948689bcaede9d88cbf3cba1ec969dd9ef9b97a790c5eca6918aaea5c1a4b0add1c59888ebacadf2dfaed5c9c4ccf5b9f2aeabaec2e1b39faca6dea7a2bf92c1e48acf9f85a086eba6c7f1b0ab99d8a8ee84cfcf8689eae7c2f7a3c09cdf90f1d5cd898551f2b3e49fd2dfadf19a80a59af3c8e5c1c2b0ddb2d8bcfeabbbf5f7b8fbe1dfa5edc6fbe0eaebfcefd8d3c7a7d6b796fe8dedcefd98cf8ab98af1daeabef6febc80e38bc7b795c7bfe8f9d7bcbc91cce58ebcdfa3faedd3d5fad7eabbad91bf8c9b8e8aeccfe095bbcaa7efc4adabc5b9a9abd595aea6c8859db29aa3f4d1d38db5e8ceb8d9eb9b99c892fcd9e2c4ec84dca7cbe4efedb2d2d3e5caa6d68ee681bbfb8ae0d2b7a2f39bb8e6bc919ac0d4c2e4bd98cc939992ebb49a8bb19bdf88e29ea6df90bb9bd2dc89b783bb8280839cc5d2f9b0f2a1ffdd9e9bdbc0ebf0aff8f78aa2efb6bdf7e7f9b9def4b9e5deabb096dabfd5f2d7dbd8deafb182b9b6fafae3c3f698ade28dc4e5cbc1a4f096bc9590dca5f095dea78585d1e389c5fefecc8131"
const INVALID_CHEST_KEY_1 = "0xedf6a3dbd5a0e8b2a3d2f5bab5c7def1b3a494ddf7d1c7f2a1ebb0fb82f291d893e7ccc9b4fadfb5ffbfecc3c1f0fdbed0d1bfecc592fed1edcd8ccfdee09ce8afebc6af8f8ce1a181cc87a089f7bebcc0e29eb0feb5defee3d8f5d0dccbd1d1e4b7a2d9f48dffcafad0bfda80ab8285a59ae482e9d9ac98d6bbc3fa98c5f5a8b8e8e294bc94bb96a6b0e7b297c4dc9a818d9ba7affcf1acedd6d7a8fbd6ecaccbeea7f7acbcd4a8ece6d7a89c9bdb87e7acfcbfefd6b09687ed92c8e3dcac948689bcaede9d88cbf3cba1ec969dd9ef9b97a790c5eca6918aaea5c1a4b0add1c59888ebacadf2dfaed5c9c4ccf5b9f2aeabaec2e1b39faca6dea7a2bf92c1e48acf9f85a086eba6c7f1b0ab99d8a8ee84cfcf8689eae7c2f7a3c09cdf90f1d5cd898551f2b3e49fd2dfadf19a80a59af3c8e5c1c2b0ddb2d8bcfeabbbf5f7b8fbe1dfa5edc6fbe0eaebfcefd8d3c7a7d6b796fe8dedcefd98cf8ab98af1daeabef6febc80e38bc7b795c7bfe8f9d7bcbc91cce58ebcdfa3faedd3d5fad7eabbad91bf8c9b8e8aeccfe095bbcaa7efc4adabc5b9a9abd595aea6c8859db29aa3f4d1d38db5e8ceb8d9eb9b99c892fcd9e2c4ec84dca7cbe4efedb2d2d3e5caa6d68ee681bbfb8ae0d2b7a2f39bb8e6bc919ac0d4c2e4bd98cc939992ebb49a8bb19bdf88e29ea6df90bb9bd2dc89b783bb8280839cc5d2f9b0f2a1ffdd9e9bdbc0ebf0aff8f78aa2efb6bdf7e7f9b9def4b9e5deabb096dabfd5f2d7dbd8deafb182b9b6fafae3c3f698ade28dc4e5cbc1a4f096bc9590dca5f095dea78585d1e389c5fefecc813a"

// Partial raffle key one 234567
const LOCKED_RAFFLE_KEY_2 = "0xa3b6caaeb7acdcb7918591e6f7e8e0b8e7e4f3c1a486d9fac2c89cb1decbd8e0ef8297c9ff84c6b48bab96ccec8fb088bae7f5f1c7b3d7fae9a2a38bcdb4f8ff9eb6ec9588e8a2b8ceb18ff8e5d5b7fc92bda79bb6a3a0cfc68085fff7b394cba3b0a6a7bfa1d595bbe08093bb86f3aaf6cec695ae84c0b8b1c7bdd091ddfab1a4b2dae6e4a5eade96b4add0908ffbc8cb82c9d6c1b7cdfcf1f5c5db85ec9f8ed9e0bcd0f2c5d597d286d3edcbb59cf7ff86d295a7fc9fefd98acaf1a68cf8f2ffb3dcbcadfea29b9e83dba9aba58dd883c3d0d0eff7c1dadb86dda896e3d892bfe782d5bdfb92d38cc1cfecb2eaa4d4848cfee59bdcb7a9d4cbdc99d5d4f69ab6ac97e9ad9e81fe85e9c1dfd5c793b9bc889e90d1b4a7aee4c2e89f84b5c5efdedadbc304abc0f7a6ead0fba5f397fa82c4b5a0fb9ed68cc2d69ae498ea959997d4a0da88c9fecdb4899fbce792deccb79bade8f7fe90ccd9fde1ef98f9b682b7d2f3aca197918c9e8abdd5bac5f8c6fd86f1a599f5bfd988b8b589d7cde4dafac8a685f0c5e6f7ba99add8cea8c6b08d9bb9e4d6c2b4d680b58588e3dfe4a8b8fdd6d2a7d586f2a8f5a8a5bffce5b998b8f8dda38ec2d9d2cbddb38182fca8e8fef7f087a6c7d3d8ce96fceeb7daaceea784bcc6d393da8096a3b6a8a2e8bdb6db9fb2f7edffe6afafb1edfc9f98f1c5d3838db9f6b4eda3e8a5a3c2b9a286d3a18597f3c1aa96b5d1ad859291baf198fda3d99cd2dce2eabc8fb9fcd4a8cde9d68aa78ce89fcdf2c9d0e9dc95d2fd86deb88283a68fe9a9e2b4a1d8fc8f989c8497cbabd9c19eee078dfc51fd314e39b07d35ed76c113724714f1e9eb119b8c4400000015048c9bb6a0e20d7a1e874ea9314751bf105378fffa"
const CHEST_KEY_2         = "0xf4e4f7bbd4b5d58ac6e4d8858bcebde9acced187a5e8ba8fbfaaf78ccf86f1959d9de9f1ead9ffca8fbdf0faf38cb9e7ebdcbdaef198bce0bcf7f6d2faddde899a83d8a9a59092e4c19bc6d0fad1d7e8daab9de093e8eda19cf7dc9786e1f19dead8eeca95a9a1f8a19595acefd1fa9c8093cd8ef6e1dab98984c5d29ac9d1e79ae2ec80b1bfa4da83f1a2f09f808cbdeb80d995a7cf9c86dc9687ed95ccd3b1bbebb2d4e4c4efdcfd88a2bbdad48fcfbbe3c7f8c783cbfeb9b58ba8fcfdb8f1cbd09dc186f0909ae6b2f2f7f4cccabcc9a9c986d5f5f1a3a69ad290b882c8b283bfd7e884f5d2dce6a8cbbcc5aae989e2e0a4b5bdd2d7998befc6f3ccdfc19a87f7c096829585a5e8f599edecd7b9c4b8eed9d6cbc7ba858b998293afc7df938caaab0b9e95dbc1e1eab3c8aaebd0d0f2d9e8a58da7a4ffcaf4bcd180c688d4ecce8bfac3d3cb92cc8ed9999fcfdc8a93bb91e2a5bd9298cd9ffbf4efa9f39ec2f78dd79deef8cca7d8d0c3a9b4d2b8fadfc2b88a819a98afceedd9e298c1bec2bdfbac92e2ecdbecfed985d0a5d2f997c794af909995e7c3b38eabebdb90b6bab9f5e6faf7bba39fe3c3a48f93c890ecf6c9b4da8a9792f39bddefff90bcac8fdbb790d4aebfd490a8e3f4e7b3ff9fd681cfb5a181e6f892c89185aeafa983c4b6f2cfb18b9fa1a8bdee84a18bc6fda4c586a1d4a1d6c5e3a7aea9ebaab199dfededecdbf6c4a3afd688bcafb897fff0d794caafe297c68190ede8bea688d7d3e6c1c0a9f097a0f59e82958cda8ab2c8cab2abf1e6b888b38ea5badf96a3f59f8b9bbbe0f2fce006"

// Errors
const errors = {
  INVALID_CALLER          : '"InvalidCaller"',
  INVALID_CLOSE_DATE      : '"INVALID_CLOSE_DATE"',
  INVALID_AMOUNT          : '"INVALID_AMOUNT"',
  INVALID_TICKET_PRICE    : '"INVALID_TICKET_PRICE"',
  PLAYER_ALREADY_EXISTS   : '(Pair "KeyExists" "player")',
  RAFFLE_CLOSED           : '"RAFFLE_CLOSED"',
  RAFFLE_OPEN             : '"RAFFLE_OPEN"',
  INVALID_TIMELOCK        : '"INVALID_TIMELOCK"',
  INVALID_STATE           : '"InvalidState"',
  PLAYER_ALREADY_REVEALED : '"PLAYER_ALREADY_REVEALED"',
  IVALID_REVEAL_FEE       : '"INVALID_REVEAL_FEE"'
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
          cd : now,
          t  : CHEST_TIME,
          rf : REVEAL_FEE
        },
        as : alice.pkh
      })
    }, errors.INVALID_CALLER)
  });
  it("Admin unsuccessfully calls 'open' entrypoint with wrong 'close_date'.", async () => {
    await expectToThrow(async () => {
      await raffle.open({
        arg : {
          cd : [now + MIN_DURATION - 10],
          t  : CHEST_TIME,
          rf : REVEAL_FEE
        },
        as : owner.pkh
      })
    }, errors.INVALID_CLOSE_DATE)
  });
  it("Admin unsuccessfully calls 'open' entrypoint by sending not enough tez to the contract.", async () => {
    await expectToThrow(async () => {
      await raffle.open({
        arg : {
          cd : CLOSE_DATE,
          t  : CHEST_TIME,
          rf : REVEAL_FEE
        },
        as : owner.pkh
      })
    }, errors.INVALID_AMOUNT)
  });
  it("Admin successfully calls 'open' entrypoint.", async () => {
    await raffle.open({
      arg : {
        cd : CLOSE_DATE,
        t  : CHEST_TIME,
        rf : REVEAL_FEE
      },
      as : owner.pkh,
      amount : JACKPOT
    })
  });
  it("Admin unsuccessfully calls 'open' entrypoint because a raffle is already open.", async () => {
    await expectToThrow(async () => {
      await raffle.open({
        arg : {
          cd : CLOSE_DATE,
          t  : CHEST_TIME,
          rf : REVEAL_FEE
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
      await raffle.buy({
        arg : {
          lrk : LOCKED_RAFFLE_KEY_1
        },
        as : alice.pkh
      })
    }, errors.INVALID_TICKET_PRICE)
  });
  it("Alice unsuccessfully calls 'buy' entrypoint because raffle is closed.", async () => {
    setMockupNow(now + MIN_DURATION + 10);
    await expectToThrow(async () => {
      await raffle.buy({
        arg : {
          lrk : LOCKED_RAFFLE_KEY_1
        },
        as : alice.pkh,
        amount : TICKET_PRICE
      })
    }, errors.RAFFLE_CLOSED)
    setMockupNow(now);
  });
  it("Alice successfully calls 'buy' entrypoint.", async () => {
    await raffle.buy({
      arg : {
        lrk : LOCKED_RAFFLE_KEY_1
      },
      as : alice.pkh,
      amount : TICKET_PRICE
    })
  });
  it("Alice unsuccessfully calls 'buy' entrypoint because she has already bought one.", async () => {
    await expectToThrow(async () => {
      await raffle.buy({
        arg : {
          lrk : LOCKED_RAFFLE_KEY_1
        },
        as : alice.pkh,
        amount : TICKET_PRICE
      })
    }, errors.PLAYER_ALREADY_EXISTS)
  });
  it("Jack successfully calls 'buy' entrypoint.", async () => {
    await raffle.buy({
      arg : {
        lrk : LOCKED_RAFFLE_KEY_2
      },
      as : jack.pkh,
      amount : TICKET_PRICE
    })
  });
});
describe("Players reveal their raffle key (at this point a raffle is open and two players participated)", async () => {
  it("Alice unsuccessfully calls 'reveal' entrypoint because it is before the 'close_date'.", async () => {
    await expectToThrow(async () => {
      await raffle.reveal({
        arg : {
          addr : alice.pkh,
          k    : CHEST_KEY_1
        },
        as : alice.pkh
      })
    }, errors.RAFFLE_OPEN)
  });
  it("Alice unsuccessfully calls 'reveal' entrypoint because of an invalid chest key.", async () => {
    setMockupNow(now + MIN_DURATION + 10);
    await expectToThrow(async () => {
      await raffle.reveal({
        arg : {
          addr : alice.pkh,
          k    : INVALID_CHEST_KEY_1
        },
        as : alice.pkh
      })
    }, errors.INVALID_TIMELOCK)
  });
  it("Alice successfully calls 'reveal' entrypoint and gets the reveal fee.", async () => {
    await checkBalanceDelta(owner.pkh,  0, async () => {
    await checkBalanceDelta(alice.pkh, d => closeTo(d, 1, 0.01), async () => {
    await checkBalanceDelta(jack.pkh,   0, async () => {
      await raffle.reveal({
            arg : {
              addr : alice.pkh,
              k    : CHEST_KEY_1
            },
            as : alice.pkh
          })
    }) }) })
  });
  it("Alice unsuccessfully calls 'reveal' entrypoint because her raffle key is already revealed.", async () => {
    await expectToThrow(async () => {
      await raffle.reveal({
        arg : {
          addr : alice.pkh,
          k    : CHEST_KEY_1
        },
        as : alice.pkh
      })
    }, errors.PLAYER_ALREADY_REVEALED)
  })
  it("Owner successfully calls 'reveal' entrypoint to reveal Jack's raffle key; jackpot is transferred.", async () => {
    await checkBalanceDelta(owner.pkh, d => closeTo(d, 1, 0.01), async () => {
    await checkBalanceDelta(alice.pkh,   0, async () => {
    await checkBalanceDelta(jack.pkh, d => closeTo(d, 58, 0.1), async () => {
      await raffle.reveal({
            arg : {
              addr : jack.pkh,
              k    : CHEST_KEY_2
            },
            as : owner.pkh
          })
    }) }) })
  })
})