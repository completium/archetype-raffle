const {
  deploy,
  getAccount,
  setQuiet,
  expectToThrow,
  setMockupNow,
  setEndpoint,
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

// Duration constants
const OneMinute         = 60
const OneHour           = 60 * OneMinute

// Initialise arguments
const OPEN_BUY          = now + 10 * OneMinute
const CLOSE_BUY         = OPEN_BUY + 10 * OneHour
const CHEST_TIME        = 10000000                   // 20 seconds on standard computer
const REVEAL_FEE        = [ '2', '10' ]              // 20% (archetype rational type is 'pair int nat')

// Partial raffle key 1 123456
const LOCKED_RAFFLE_KEY_1 = "0x858b9aafb7d89ca6b9d9f2b683bfd1abd1dabddbc6cbafa48bbdd0ae9afec4e9a6f8ae81e985f8cbd49486ee88ccedc0f5cbcda9b1bfd5f6b8cef0938affb9ce93b186d7f6e7e0c8d3c5e0febeabaead97c4f6caace3dcf8fdee9ba0ba83d88e81a8dbeec5b5f3f7e58dd4c5e1af96a0e7b196a4c2b08980f0b5f0ebf7eca8a19eacdbeaf5faacdba5a6c4d8f995dfebc1c6bae4e9a1fd87b48bdcdafbf7f6b0b19fd9f8c6ec90fba48aa3dde0f0cbe4ccea88ca94c5ccb28f96b89ef0edbcac909afac28ce3def295f1d0d8eddef8df9fe7e7d1dea9a580e1e2cbed92ce8c8cdc8f91a394f68a86e6a0aceb97f8e6f28c90ae8cf3a6b3f3eba58ff4c6e3c2e0b4d1d38b94b5d98cdbda8081c0fa9bcceceaaea7faa897d7cbb694b38bdfb6e1f2c296f603d1ced3abebe5db8ea3e68defdd9ae9cbc6d4f0f3dafae1c78cffdcd6c4fde4ce83d8b2e3ac928bbaa6dc8cc6f8ddf5b8ed95bcb0d8fa9de9c39afd9aa6b08189ebd48addde8fbad6ceffe5e684ad9bede8c9bdbd9e98a3c1e49ed481c3cfad9cc880a795838ed8b8b1bdf6d4fee793e5bbf98c85e4cf89e990f8d5aae9c3e5fcd782bde2f2fe82b0d09ddfc2d8fd92da9af788ee85958286d8aecc91dac28fa9dcb1ca9addcd86e8e989d2e1b7b6fbe0c7afbe97d182ebade5fc9fd2f2baf19a898590f3c0c380f0d5c6aefdc48cefa9cebfd6aad1a083b8cafaa2ffbaa4cb8de2a9acebcbd5ca9ebae0de86e8b6bcc0e8a78f80d28fc397f3abffcd9a8ff3b2ee96d8cbe5dbd39582d6f3aa8ca4c6f1c3d69df3c1b8e0928edbf7c6e6dbe09bbee6df9806ab3f7ef06f7ac1868a1cfa8db0f7a7cd565a7464e5290dff00000015d8c58609c521ed06a5268079693dd0428a9824d377"
const CHEST_KEY_1         = "0xedf6a3dbd5a0e8b2a3d2f5bab5c7def1b3a494ddf7d1c7f2a1ebb0fb82f291d893e7ccc9b4fadfb5ffbfecc3c1f0fdbed0d1bfecc592fed1edcd8ccfdee09ce8afebc6af8f8ce1a181cc87a089f7bebcc0e29eb0feb5defee3d8f5d0dccbd1d1e4b7a2d9f48dffcafad0bfda80ab8285a59ae482e9d9ac98d6bbc3fa98c5f5a8b8e8e294bc94bb96a6b0e7b297c4dc9a818d9ba7affcf1acedd6d7a8fbd6ecaccbeea7f7acbcd4a8ece6d7a89c9bdb87e7acfcbfefd6b09687ed92c8e3dcac948689bcaede9d88cbf3cba1ec969dd9ef9b97a790c5eca6918aaea5c1a4b0add1c59888ebacadf2dfaed5c9c4ccf5b9f2aeabaec2e1b39faca6dea7a2bf92c1e48acf9f85a086eba6c7f1b0ab99d8a8ee84cfcf8689eae7c2f7a3c09cdf90f1d5cd898551f2b3e49fd2dfadf19a80a59af3c8e5c1c2b0ddb2d8bcfeabbbf5f7b8fbe1dfa5edc6fbe0eaebfcefd8d3c7a7d6b796fe8dedcefd98cf8ab98af1daeabef6febc80e38bc7b795c7bfe8f9d7bcbc91cce58ebcdfa3faedd3d5fad7eabbad91bf8c9b8e8aeccfe095bbcaa7efc4adabc5b9a9abd595aea6c8859db29aa3f4d1d38db5e8ceb8d9eb9b99c892fcd9e2c4ec84dca7cbe4efedb2d2d3e5caa6d68ee681bbfb8ae0d2b7a2f39bb8e6bc919ac0d4c2e4bd98cc939992ebb49a8bb19bdf88e29ea6df90bb9bd2dc89b783bb8280839cc5d2f9b0f2a1ffdd9e9bdbc0ebf0aff8f78aa2efb6bdf7e7f9b9def4b9e5deabb096dabfd5f2d7dbd8deafb182b9b6fafae3c3f698ade28dc4e5cbc1a4f096bc9590dca5f095dea78585d1e389c5fefecc8131"
const INVALID_CHEST_KEY_1 = "0xedf6a3dbd5a0e8b2a3d2f5bab5c7def1b3a494ddf7d1c7f2a1ebb0fb82f291d893e7ccc9b4fadfb5ffbfecc3c1f0fdbed0d1bfecc592fed1edcd8ccfdee09ce8afebc6af8f8ce1a181cc87a089f7bebcc0e29eb0feb5defee3d8f5d0dccbd1d1e4b7a2d9f48dffcafad0bfda80ab8285a59ae482e9d9ac98d6bbc3fa98c5f5a8b8e8e294bc94bb96a6b0e7b297c4dc9a818d9ba7affcf1acedd6d7a8fbd6ecaccbeea7f7acbcd4a8ece6d7a89c9bdb87e7acfcbfefd6b09687ed92c8e3dcac948689bcaede9d88cbf3cba1ec969dd9ef9b97a790c5eca6918aaea5c1a4b0add1c59888ebacadf2dfaed5c9c4ccf5b9f2aeabaec2e1b39faca6dea7a2bf92c1e48acf9f85a086eba6c7f1b0ab99d8a8ee84cfcf8689eae7c2f7a3c09cdf90f1d5cd898551f2b3e49fd2dfadf19a80a59af3c8e5c1c2b0ddb2d8bcfeabbbf5f7b8fbe1dfa5edc6fbe0eaebfcefd8d3c7a7d6b796fe8dedcefd98cf8ab98af1daeabef6febc80e38bc7b795c7bfe8f9d7bcbc91cce58ebcdfa3faedd3d5fad7eabbad91bf8c9b8e8aeccfe095bbcaa7efc4adabc5b9a9abd595aea6c8859db29aa3f4d1d38db5e8ceb8d9eb9b99c892fcd9e2c4ec84dca7cbe4efedb2d2d3e5caa6d68ee681bbfb8ae0d2b7a2f39bb8e6bc919ac0d4c2e4bd98cc939992ebb49a8bb19bdf88e29ea6df90bb9bd2dc89b783bb8280839cc5d2f9b0f2a1ffdd9e9bdbc0ebf0aff8f78aa2efb6bdf7e7f9b9def4b9e5deabb096dabfd5f2d7dbd8deafb182b9b6fafae3c3f698ade28dc4e5cbc1a4f096bc9590dca5f095dea78585d1e389c5fefecc813a"

// Partial raffle key 2 234567
const LOCKED_RAFFLE_KEY_2 = "0xa3b6caaeb7acdcb7918591e6f7e8e0b8e7e4f3c1a486d9fac2c89cb1decbd8e0ef8297c9ff84c6b48bab96ccec8fb088bae7f5f1c7b3d7fae9a2a38bcdb4f8ff9eb6ec9588e8a2b8ceb18ff8e5d5b7fc92bda79bb6a3a0cfc68085fff7b394cba3b0a6a7bfa1d595bbe08093bb86f3aaf6cec695ae84c0b8b1c7bdd091ddfab1a4b2dae6e4a5eade96b4add0908ffbc8cb82c9d6c1b7cdfcf1f5c5db85ec9f8ed9e0bcd0f2c5d597d286d3edcbb59cf7ff86d295a7fc9fefd98acaf1a68cf8f2ffb3dcbcadfea29b9e83dba9aba58dd883c3d0d0eff7c1dadb86dda896e3d892bfe782d5bdfb92d38cc1cfecb2eaa4d4848cfee59bdcb7a9d4cbdc99d5d4f69ab6ac97e9ad9e81fe85e9c1dfd5c793b9bc889e90d1b4a7aee4c2e89f84b5c5efdedadbc304abc0f7a6ead0fba5f397fa82c4b5a0fb9ed68cc2d69ae498ea959997d4a0da88c9fecdb4899fbce792deccb79bade8f7fe90ccd9fde1ef98f9b682b7d2f3aca197918c9e8abdd5bac5f8c6fd86f1a599f5bfd988b8b589d7cde4dafac8a685f0c5e6f7ba99add8cea8c6b08d9bb9e4d6c2b4d680b58588e3dfe4a8b8fdd6d2a7d586f2a8f5a8a5bffce5b998b8f8dda38ec2d9d2cbddb38182fca8e8fef7f087a6c7d3d8ce96fceeb7daaceea784bcc6d393da8096a3b6a8a2e8bdb6db9fb2f7edffe6afafb1edfc9f98f1c5d3838db9f6b4eda3e8a5a3c2b9a286d3a18597f3c1aa96b5d1ad859291baf198fda3d99cd2dce2eabc8fb9fcd4a8cde9d68aa78ce89fcdf2c9d0e9dc95d2fd86deb88283a68fe9a9e2b4a1d8fc8f989c8497cbabd9c19eee078dfc51fd314e39b07d35ed76c113724714f1e9eb119b8c4400000015048c9bb6a0e20d7a1e874ea9314751bf105378fffa"
const CHEST_KEY_2         = "0xf4e4f7bbd4b5d58ac6e4d8858bcebde9acced187a5e8ba8fbfaaf78ccf86f1959d9de9f1ead9ffca8fbdf0faf38cb9e7ebdcbdaef198bce0bcf7f6d2faddde899a83d8a9a59092e4c19bc6d0fad1d7e8daab9de093e8eda19cf7dc9786e1f19dead8eeca95a9a1f8a19595acefd1fa9c8093cd8ef6e1dab98984c5d29ac9d1e79ae2ec80b1bfa4da83f1a2f09f808cbdeb80d995a7cf9c86dc9687ed95ccd3b1bbebb2d4e4c4efdcfd88a2bbdad48fcfbbe3c7f8c783cbfeb9b58ba8fcfdb8f1cbd09dc186f0909ae6b2f2f7f4cccabcc9a9c986d5f5f1a3a69ad290b882c8b283bfd7e884f5d2dce6a8cbbcc5aae989e2e0a4b5bdd2d7998befc6f3ccdfc19a87f7c096829585a5e8f599edecd7b9c4b8eed9d6cbc7ba858b998293afc7df938caaab0b9e95dbc1e1eab3c8aaebd0d0f2d9e8a58da7a4ffcaf4bcd180c688d4ecce8bfac3d3cb92cc8ed9999fcfdc8a93bb91e2a5bd9298cd9ffbf4efa9f39ec2f78dd79deef8cca7d8d0c3a9b4d2b8fadfc2b88a819a98afceedd9e298c1bec2bdfbac92e2ecdbecfed985d0a5d2f997c794af909995e7c3b38eabebdb90b6bab9f5e6faf7bba39fe3c3a48f93c890ecf6c9b4da8a9792f39bddefff90bcac8fdbb790d4aebfd490a8e3f4e7b3ff9fd681cfb5a181e6f892c89185aeafa983c4b6f2cfb18b9fa1a8bdee84a18bc6fda4c586a1d4a1d6c5e3a7aea9ebaab199dfededecdbf6c4a3afd688bcafb897fff0d794caafe297c68190ede8bea688d7d3e6c1c0a9f097a0f59e82958cda8ab2c8cab2abf1e6b888b38ea5badf96a3f59f8b9bbbe0f2fce006"

/**
 * @description Partial raffle key 3 is 345678; This chest has been generated with the wrong time value
 * @command tezos-client hash data '345678' of type nat
 * @command timelock-utils --lock --data 05008e992a --time 10000001
 */
const LOCKED_RAFFLE_KEY_3 = "0xedf2d6c8f8bd8cb3dbe1e3b2d2b9c6fea9b7ad95b9ccfab3969bbbd7a08fea92bcff9ee090cb85f69aebb7c6a19af0e3cfe8e48b99ccfcc1bdfc9d9cc4ed9bb8c19dede0a3b3e2b3afe185db96d0dec38dc19eb2f2c4e5f09ccee2d3dadedfc0f2a6b1deb4f7d89decc9a298b2a0bac0e7aafb9de8c5b8b6a4ccd895fd97d0acf482c3e6b6bf83dc92a1d3f990e5dba1fda18f97b9f9f9ea839bdbfab5d6958b89a18ba6a8e7acf4f4d1aa8897b494abb1f6bde1a9aae2f6a982bbc286eefdffa4d0bcf1c99bb49bcaa4dbc597869bb5aeb8dff2c58ae3d0dd8ee2929684dacfbec8d485e9a893b3a398f6c2f6fd8db7cc9fae95b1c997e7caf8b8f1c9efecd88adc8dfeec8588c9a79af6c4faa7d78ee2dd87aedcc68bb9a9a49ba7f2b0e4fdec81a7f401c1dd9386cfb384d8e4deee92c4f7c6e9aab0b2a4c396fec5b9d2dee3c7fce2dc9b82e4bfb586f5b49cc3dfe0a3a9a3e0cff1c0b5cb8fa6f8beebcab48ea8a0a9bbb58884d2e084b2a0c6edcd94f5fdd7d3b0bce883dce39b9296f8b682e5daadbeb7c9ba90af9cebdc8885a6dffec7b1cea5bd81b8fef8d7ebfea6eae29d8bcddcfafbb898dcaedb9c8892efa5aaee83f891f890bb8bd9a6bed6eeafd4a1d8effcbd83fe9ef1b3bfe1cdbdc1ddeff1f6c3a9b3edf2a4a3fdc7d380d5f1a3f9cfb4d1e3dfa398ddc8d6f7be88c1b1cf8ca2c0d5b6ecd09bf2e0e8ca98fae6dbf4e689cc9cedc4e287d78f8cef89d5c7de8da0adc996c5e1d58b93ae88d6c6abd6b897d8e5c6fcde93d8d6ada2e6c3eeb094bba5a2a4a4b7f5fe988dde93b9b0e4e6ddeecc03ee6328372b1a0f6366c1f6c2cb62b3415eb35a022ecaabfd00000015a491185fbe2229c6e0e38e057562014056222b2b57"
/**
 * @description Key is obtained with the correct chest time; it generates a 'bogus cypher' error
 * @command timelock-utils --create-chest-key --chest ${LOCKED_RAFFLE_KEY_3} --time 10000000
 */
const CHEST_KEY_3         = "0xc0b0d29ddaf3bde590d9a9febfec9fb8a99ca4b8f4aff9aa8f85bccbdc99e786b0dd9ef588e0cf9c8ac9e8a6caa1aecdbdf2ccaeb49c9eec84aaecd9d782d1c5bcedf7d99cf4f2d2fa85fbbc99b5e8a186f9a6b4cdaac597e1acb88fa4ddf9f4ece980a1988fb394b383ff8adda7eff196ed9aa1dbfe9cc7aa9aadfaf0c4a686fc8a829de2d2a096e7b7b186c799959ae096b198a6c79fe2a4dfae9de3c2fab4f7ceb4afd598c8edc4cbc3c4d7f4d4feb4cac7c2d3e0c6c1ef8dedda9d9be1b0a7edd0f8ecebd3c4d497dfc4a6aff4aef5a1aceeee87fec9fec08d96cec4b3a08f8aeff086b1d79288dbb38089bfbeb583d590abc28dc4f0f2c6ebc3dc81a9e0bba3c29fbba2e8ebf5fcd78da0dab1cbafc490fcb8da9c92a98e85ac96e8b6fbc0dfecb8039fd18283ea98c38b98e2b093a6ed8eeca0a0b1c1bfd5cf84a0f7dbc9a7e983afacfbf2cfc5fced84b3ca81bee0a888d2acf5d7ecadf2d6faa0ef84bcdcecd7869c9eaaf395959fb6df9e9cac83e5fb97b5a39e9fadf9b787d8d1fca0f7bcf7a59ef3a5c9f2ecbb8ef7cdc0eff9b0b9abe0a9b9d2f087aae0df84abf3d8ffd9db9bcdf4e084e5a9cc9d88e8b2b1efb292bde1c8acd5d094b8fbd681f2f8dca380c7b0d79c82d9fda9ebb1e1e894d6f8a1b894a3a3f7d4f0fb95d1d7cdb19bc3f7e2bae193d5f496e2a1a2ad918bdfbb81c999e4e6fa8580f1cedfeac9dcd4a9fbcdd8c9c9b1fcecf3e89092f3c5d89bfda4bdeaa3d3f3d9d0b1aea69583bed5e58e9cb59ec3fa81fc94c099b08bc8f3e6f1f0d1d0fedc8d8af9868883c6c892dbce84b274"

// Errors
const errors = {
  EXISTS_NOT_REVEALED      : '"EXISTS_NOT_REVEALED"',
  INVALID_AMOUNT           : '"INVALID_AMOUNT"',
  INVALID_CALLER           : '"InvalidCaller"',
  INVALID_CHEST_KEY        : '"INVALID_CHEST_KEY"',
  INVALID_OPEN_CLOSE_DATE  : '"INVALID_OPEN_CLOSE_BUY"',
  INVALID_REVEAL_FEE       : '"INVALID_REVEAL_FEE"',
  INVALID_REVEAL_TIME      : '"INVALID_REVEAL_TIME"',
  INVALID_STATE            : '"InvalidState"',
  INVALID_TICKET_PRICE     : '"INVALID_TICKET_PRICE"',
  PLAYER_ALREADY_EXISTS    : '(Pair "KeyExists" "player")',
  PLAYER_ALREADY_REVEALED  : '"PLAYER_ALREADY_REVEALED"',
  RAFFLE_CLOSED            : '"RAFFLE_CLOSED"',
  RAFFLE_OPEN              : '"RAFFLE_OPEN"',
}

const closeTo = (value, target, epsilon) => { return Math.abs(value - target) < epsilon }

// Accounts
const owner = getAccount('bootstrap1');
const alice = getAccount('alice');
const jack  = getAccount('bootstrap2');
const bob   = getAccount('bootstrap3');

describe("Deploy", async () => {
  it("Raffle", async () => {
    [raffle, _] = await deploy('./contract/raffle.arl', {
      parameters: {
        owner        : owner.pkh,
        jackpot      : JACKPOT,
        ticket_price : TICKET_PRICE
      },
      as: owner.pkh
    });
  });
});

describe("Open Raffle", async () => {
  it("The unauthorized user Alice unsuccessfully calls 'initialise' entrypoint.", async () => {
    await expectToThrow(async () => {
      await raffle.initialise({
        arg : {
          ob : OPEN_BUY,
          cb : CLOSE_BUY,
          t  : CHEST_TIME,
          rf : REVEAL_FEE
        },
        as : alice.pkh
      })
    }, errors.INVALID_CALLER)
  });
  it("Owner unsuccessfully calls 'initialise' entrypoint with wrong 'close_buy'.", async () => {
    await expectToThrow(async () => {
      await raffle.initialise({
        arg : {
          ob : OPEN_BUY,
          cb : OPEN_BUY,
          t  : CHEST_TIME,
          rf : REVEAL_FEE
        },
        as : owner.pkh
      })
    }, errors.INVALID_OPEN_CLOSE_DATE)
  });
  it("Owner unsuccessfully calls 'initialise' entrypoint with wrong 'reveal_fee'.", async () => {
    await expectToThrow(async () => {
      await raffle.initialise({
        arg : {
          ob : OPEN_BUY,
          cb : CLOSE_BUY,
          t  : CHEST_TIME,
          rf : [ '20', '10' ]
        },
        as : owner.pkh
      })
    }, errors.INVALID_REVEAL_FEE)
  });
  it("Owner unsuccessfully calls 'initialise' entrypoint by sending not enough tez to the contract.", async () => {
    await expectToThrow(async () => {
      await raffle.initialise({
        arg : {
          ob : OPEN_BUY,
          cb : CLOSE_BUY,
          t  : CHEST_TIME,
          rf : REVEAL_FEE
        },
        as : owner.pkh
      })
    }, errors.INVALID_AMOUNT)
  });
  it("Owner successfully calls 'initialise' entrypoint.", async () => {
    await raffle.initialise({
      arg : {
        ob : OPEN_BUY,
        cb : CLOSE_BUY,
        t  : CHEST_TIME,
        rf : REVEAL_FEE
      },
      as : owner.pkh,
      amount : JACKPOT
    })
  });
  it("Owner unsuccessfully calls 'initialise' entrypoint because a raffle is already initialised.", async () => {
    await expectToThrow(async () => {
      await raffle.initialise({
        arg : {
          ob : OPEN_BUY,
          cb : CLOSE_BUY,
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
    setMockupNow(OPEN_BUY + 10);
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
    setMockupNow(CLOSE_BUY + 10);
    await expectToThrow(async () => {
      await raffle.buy({
        arg : {
          lrk : LOCKED_RAFFLE_KEY_1
        },
        as : alice.pkh,
        amount : TICKET_PRICE
      })
    }, errors.RAFFLE_CLOSED)
    setMockupNow(OPEN_BUY + 10);
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
  it("Bob successfully calls 'buy' entrypoint.", async () => {
    await raffle.buy({
      arg : {
        lrk : LOCKED_RAFFLE_KEY_3
      },
      as : bob.pkh,
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
    setMockupNow(CLOSE_BUY + 10);
    await expectToThrow(async () => {
      await raffle.reveal({
        arg : {
          addr : alice.pkh,
          k    : INVALID_CHEST_KEY_1
        },
        as : alice.pkh
      })
    }, errors.INVALID_CHEST_KEY)
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
  });
  it("Jack successfully calls 'reveal' entrypoint and gets the reveal fee.", async () => {
    await checkBalanceDelta(owner.pkh,  0, async () => {
    await checkBalanceDelta(jack.pkh, d => closeTo(d, 1, 0.01), async () => {
    await checkBalanceDelta(alice.pkh,   0, async () => {
      await raffle.reveal({
            arg : {
              addr : jack.pkh,
              k    : CHEST_KEY_2
            },
            as : jack.pkh
          })
    }) }) })
  });
});
describe("Test 'transfer' entrypoint", async () => {
  it("Owner unsucessfully calls 'transfer' entrypoint because Bob is not revealed.", async () => {
    await expectToThrow(async () => {
      await raffle.transfer({
        as : owner.pkh
      })
    }, errors.EXISTS_NOT_REVEALED)
  });
  it("Owner sucessfully calls 'reveal' entrypoint to remove Bob's chest, and gets the unlock reward.", async () => {
    await checkBalanceDelta(owner.pkh, d => closeTo(d, 1, 0.01), async () => {
    await checkBalanceDelta(alice.pkh,   0, async () => {
    await checkBalanceDelta(jack.pkh,    0, async () => {
      await raffle.reveal({
            arg : {
              addr : bob.pkh,
              k    : CHEST_KEY_3
            },
            as : owner.pkh
          })
    }) }) })
    // check that bob is removed from palyer
    const storage = await raffle.getStorage();
    assert (storage.player.size === 2)
  });
  it("Owner sucessfully calls 'transfer' entrypoint to send the jackpot to Jack.", async () => {
    await checkBalanceDelta(jack.pkh, 62, async () => {
      await raffle.transfer({
        as : owner.pkh
      })
    })
  })
})
