const {
  deploy,
  getAccount,
  setQuiet,
  expectToThrow,
  setMockupNow,
  setEndpoint,
  packTyped } = require('@completium/completium-cli');
const assert = require('assert');

// Mockup mode
setQuiet(true);
setEndpoint('mockup')

// Contract
let raffle;

// Constants
const JACKPOT      = "50tz"
const MIN_DURATION = 60 * 60   // 1 hour
const now          = Date.now() / 1000

// Errors
const errors = {
    INVALID_CALLER     : '"InvalidCaller"',
    INVALID_CLOSE_DATE : '"INVALID_CLOSE_DATE"',
    INVALID_AMOUNT     : '"INVALID_AMOUNT"',
    NOT_APPROVED       : '"NOT_APPROVED"',
    EXPIRED_PROPOSAL   : '"EXPIRED_PROPOSAL"',
    INVALID_SIGNATURE  : '"INVALID_SIGNATURE"',
    INVALID_STATE      : '"InvalidState"'
  }

// Accounts
const owner = getAccount('bootstrap1');
const alice = getAccount('alice');
const jack = getAccount('bootstrap2');

describe("Deploy", async () => {
  it("Raffle", async () => {
    [raffle, _] = await deploy('./contract/raffle.arl', {
      parameters: {
        owner        : owner.pkh,
        min_duration : MIN_DURATION,
        jackpot      : JACKPOT
      },
      as: owner.pkh
    });
  });
});

describe("Open Raffle", async () => {
  it("The unauthorized user Alice unsuccessfully call open", async () => {
    await expectToThrow(async () => {
      await raffle.open({
        arg : {
          cd    : null,
          c     : null,
          w     : null
        },
        as : alice.pkh
      }), errors.INVALID_CALLER })
  });
  it("Admin unsuccessfully call open_raffle with wrong close_date", async () => {
    await expectToThrow(async () => {
      await raffle.open({
        arg : {
          cd    : [now + MIN_DURATION - 10],
          c     : null,
          w     : null
        },
        as : owner.pkh
      }), errors.INVALID_CLOSE_DATE })
  });
  it("Admin unsuccessfully call open_raffle by sending not enough tez to the contract", async () => {
    await expectToThrow(async () => {
      await raffle.open({
        arg : {
          cd    : [now + MIN_DURATION + 10],
          c     : null,
          w     : null
        },
        as : owner.pkh
      }), errors.INVALID_AMOUNT })
  });
  it("Admin successfully call open_raffle", async () => {
    await raffle.open({
      arg : {
        cd    : [now + MIN_DURATION + 10],
        c     : null,
        w     : null
      },
      as : owner.pkh,
      amount : JACKPOT
    })
  })
})