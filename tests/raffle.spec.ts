
import { configure_experiment, expect_to_fail, get_account, set_mockup, set_mockup_now } from "@completium/experiment-ts";

import { raffle } from './binding/raffle'

// import assert from 'assert'
import { Chest, Chest_key, Nat, Rational, Tez } from "@completium/archetype-ts-types";
import { assert } from "console";

const NOW = new Date();
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOURS = 60 * ONE_MINUTE;


/* Contract parameters ----------------------------------------------------- */

const JACKPOT: Tez = new Tez(50)
const TICKET_PRICE: Tez = new Tez(5)

/* Initialise arguments ---------------------------------------------------- */
const OPEN_BUY = new Date(NOW.getTime() + 10 * ONE_MINUTE)
const CLOSE_BUY = new Date(NOW.getTime() + 10 * ONE_HOURS)
const CHEST_TIME = new Nat(10000000) // 20 seconds on standard computer
const REVEAL_FEE = new Rational(20, 100)

/* Partial raffle key 1 123456 --------------------------------------------- */
const LOCKED_RAFFLE_KEY_1 = new Chest("a0aaa3d89aa2d59cf7ea8fc4bbf1a4b1af9893d8cde69eaebadff1a487e5a2beadbd9f8dcc84cfc799e3a2fff7bae497adc8c2dfd8d192e1baa9d3a0868ceffcbaa5a8bbebbafbe4b2fee7dae7d68bdfcee3eafcd09eb0f6c4dee3c5f685a0e1d4a4cf8cc2ebdcc3c38f95eeebbbfbf4edc78380db82bc94f0ef92bdc2feb9a8aedf8ab5abed91cdb7d6c6dce788dadcb9b8baa0fbb0cbeacaa5d1ef87bed38480b6b5f3fbc7b6b4ffd5c7d9ac8ec09298ebcbccf999c2bcd3a5b3e3a28485d999a3adca8c9eeef6dea88fdb96b7d0e49085edc792d7feb8c6b0d3aac387d9a0ca8589858de5d7cdb894f2c79df1f682bdc2ce87c796d0decababbc4fac4a6c1fef6b5cea3fcaed3e09dcdb68193f4f5ee8ca996ad8bcff6d28788d0caf5eaeecbb5c8be0a28cc21e50b92bcac704f7bd79554edcdd0332f919f450c8d0000001894d6ced168d44f9211ebc071e741a9fee651bdcbd6b2308d")
const CHEST_KEY_1 = new Chest_key("8cf2b7b69bd4e18dc7a39c989ee3e8a4cfb191f485dd95ed8dabbff3fffdbabbceb5bbe09def8cc1a1a0809db6e3c6f6f2eca698d4e9c4cff1f1e3d2ecaaa58aa6d5dccbf1dfaefdbdfdecc4f38bbf97e9b5908daa89aae6ebab9ed9db919c8efba5ffb9bcb0f893dce2e7b390f0cd9c99f3d796d78dbd9cb8eb939385d9dfa0eda3b5d5adc4b58fe78fc891dea0c3c9a9f0d5d3c5feffdfdad78ee5ab91f4958d96f883dc8f8bb4a5d693f9bf8cc4fedbd99dfcf8a6afc8b9d2dbd19ca6edb5a8cd85e2c7cfde8d95fba6dd81a2d8a3e8a9a5939fc6cd9bc6f5f296eafb8dc5c1d2bfdfb8f3a582c0b5f6ceb899d4cbf6b7b48098d8bedff1a1e3c39df5aecad3a48ba5a5a1d9e9a9a7b8c094a4c8a7a3d7f2c7ebc9a7a789a587dd8abf948da4b4efd4028c98ab96ff9e97cca988bddbf4f8deafa798a091eb8d8df49afdb6fee5d486f881e4c5e8eee6bea5c7b783bbd9968080eaa1a8ab96cbb38480b1f786cd928297cc80bea9b992ab83e99c8295c79a8ca4e7dd84d5b1a3c9faf092dfacc9ddf1d9f7b4e1abe59accaab3cae5ecfcc8938e93f78993c4a0eb8af2a6b38ffabebfb0a5c2cee4b38bc8fee0e2d09d83f0b7e2d0c2d892e5e1b59fdbaaa8b6e587b493a6d6eba6aba9fdd3c0b9f1cad9fcd69ebe9ca9cdeed58bcfd8d5cfa4a0e2f9a697d4fee3edace0b4abe8c193ec94978ead8eace2d2b4b1cd84d5fa82c480929ea0b299b19dffb7feabcca8e29dc991dfa6ef8ea1eeb588e4dcbdaede82c0c7ca9583e6839be9d299cfe8cba2cd8ce29cc1dd81c0bac1d2fcabdaade8e8cec7c5d394d4c305a3c9bea9f3caf49495b2bd9fc7b9a0a5dce3d4bac09bbabb9bc3dc81dcba8493ffcfd299b8f5d0febe9af585dca3f6ed8c84b1fdecc3d5dee59faaf58190dbdd8dab8aab84d0cd87c3af9191e9eeb2b0939bbbc2f7dcdaf7aca8e1888ab88bf8a8a9ba9cb1f9db8fa6e3f1d3fed3d899cfa2f39cccf3e6c3a4fcade5fababbc1a0d883c2fad893a6d989fbd7b2d4b0c2f4f682c48989d4b3ad98ceb2b2b287b591efdf84f4c8f1b9a7dda2b1f195b1b8d8ecbef1fdf3c3c989d2f2b4aad8c28afcc581dc8a9e86e49ab2d8d9fad3f5b39db0fd8cf3efddfb94f4eabfd4ed9889dde2b9ceb7cdcbaeebb683d5fee99c8693ab82c59f8396c7eeb98cbedadd84aac7a5abefa8d197f6b0a0aeaf9f8fbcf1e8d5befaf786c69eb0bfed9fe5ff85e5818cdfb208dbf3ccb68cefa0def4f987edf5c5aeb6bc39")
const INVALID_CHEST_KEY_1 = new Chest_key("8cf2b7b69bd4e18dc7a39c989ee3e8a4cfb191f485dd95ed8dabbff3fffdbabbceb5bbe09def8cc1a1a0809db6e3c6f6f2eca698d4e9c4cff1f1e3d2ecaaa58aa6d5dccbf1dfaefdbdfdecc4f38bbf97e9b5908daa89aae6ebab9ed9db919c8efba5ffb9bcb0f893dce2e7b390f0cd9c99f3d796d78dbd9cb8eb939385d9dfa0eda3b5d5adc4b58fe78fc891dea0c3c9a9f0d5d3c5feffdfdad78ee5ab91f4958d96f883dc8f8bb4a5d693f9bf8cc4fedbd99dfcf8a6afc8b9d2dbd19ca6edb5a8cd85e2c7cfde8d95fba6dd81a2d8a3e8a9a5939fc6cd9bc6f5f296eafb8dc5c1d2bfdfb8f3a582c0b5f6ceb899d4cbf6b7b48098d8bedff1a1e3c39df5aecad3a48ba5a5a1d9e9a9a7b8c094a4c8a7a3d7f2c7ebc9a7a789a587dd8abf948da4b4efd4028c98ab96ff9e97cca988bddbf4f8deafa798a091eb8d8df49afdb6fee5d486f881e4c5e8eee6bea5c7b783bbd9968080eaa1a8ab96cbb38480b1f786cd928297cc80bea9b992ab83e99c8295c79a8ca4e7dd84d5b1a3c9faf092dfacc9ddf1d9f7b4e1abe59accaab3cae5ecfcc8938e93f78993c4a0eb8af2a6b38ffabebfb0a5c2cee4b38bc8fee0e2d09d83f0b7e2d0c2d892e5e1b59fdbaaa8b6e587b493a6d6eba6aba9fdd3c0b9f1cad9fcd69ebe9ca9cdeed58bcfd8d5cfa4a0e2f9a697d4fee3edace0b4abe8c193ec94978ead8eace2d2b4b1cd84d5fa82c480929ea0b299b19dffb7feabcca8e29dc991dfa6ef8ea1eeb588e4dcbdaede82c0c7ca9583e6839be9d299cfe8cba2cd8ce29cc1dd81c0bac1d2fcabdaade8e8cec7c5d394d4c305a3c9bea9f3caf49495b2bd9fc7b9a0a5dce3d4bac09bbabb9bc3dc81dcba8493ffcfd299b8f5d0febe9af585dca3f6ed8c84b1fdecc3d5dee59faaf58190dbdd8dab8aab84d0cd87c3af9191e9eeb2b0939bbbc2f7dcdaf7aca8e1888ab88bf8a8a9ba9cb1f9db8fa6e3f1d3fed3d899cfa2f39cccf3e6c3a4fcade5fababbc1a0d883c2fad893a6d989fbd7b2d4b0c2f4f682c48989d4b3ad98ceb2b2b287b591efdf84f4c8f1b9a7dda2b1f195b1b8d8ecbef1fdf3c3c989d2f2b4aad8c28afcc581dc8a9e86e49ab2d8d9fad3f5b39db0fd8cf3efddfb94f4eabfd4ed9889dde2b9ceb7cdcbaeebb683d5fee99c8693ab82c59f8396c7eeb98cbedadd84aac7a5abefa8d197f6b0a0aeaf9f8fbcf1e8d5befaf786c69eb0bfed9fe5ff85e5818cdfb208dbf3ccb68cefa0def4f987edf5c5aeb6bc39")

// /* Partial raffle key 1 234567 --------------------------------------------- */
const LOCKED_RAFFLE_KEY_2 = new Chest("a0aaa3d89aa2d59cf7ea8fc4bbf1a4b1af9893d8cde69eaebadff1a487e5a2beadbd9f8dcc84cfc799e3a2fff7bae497adc8c2dfd8d192e1baa9d3a0868ceffcbaa5a8bbebbafbe4b2fee7dae7d68bdfcee3eafcd09eb0f6c4dee3c5f685a0e1d4a4cf8cc2ebdcc3c38f95eeebbbfbf4edc78380db82bc94f0ef92bdc2feb9a8aedf8ab5abed91cdb7d6c6dce788dadcb9b8baa0fbb0cbeacaa5d1ef87bed38480b6b5f3fbc7b6b4ffd5c7d9ac8ec09298ebcbccf999c2bcd3a5b3e3a28485d999a3adca8c9eeef6dea88fdb96b7d0e49085edc792d7feb8c6b0d3aac387d9a0ca8589858de5d7cdb894f2c79df1f682bdc2ce87c796d0decababbc4fac4a6c1fef6b5cea3fcaed3e09dcdb68193f4f5ee8ca996ad8bcff6d28788d0caf5eaeecbb5c8be0a28cc21e50b92bcac704f7bd79554edcdd0332f919f450c8d0000001894d6ced168d44f9211ebc071e741a9fee651bdcbd6b2308d")
const CHEST_KEY_2 = new Chest_key("8cf2b7b69bd4e18dc7a39c989ee3e8a4cfb191f485dd95ed8dabbff3fffdbabbceb5bbe09def8cc1a1a0809db6e3c6f6f2eca698d4e9c4cff1f1e3d2ecaaa58aa6d5dccbf1dfaefdbdfdecc4f38bbf97e9b5908daa89aae6ebab9ed9db919c8efba5ffb9bcb0f893dce2e7b390f0cd9c99f3d796d78dbd9cb8eb939385d9dfa0eda3b5d5adc4b58fe78fc891dea0c3c9a9f0d5d3c5feffdfdad78ee5ab91f4958d96f883dc8f8bb4a5d693f9bf8cc4fedbd99dfcf8a6afc8b9d2dbd19ca6edb5a8cd85e2c7cfde8d95fba6dd81a2d8a3e8a9a5939fc6cd9bc6f5f296eafb8dc5c1d2bfdfb8f3a582c0b5f6ceb899d4cbf6b7b48098d8bedff1a1e3c39df5aecad3a48ba5a5a1d9e9a9a7b8c094a4c8a7a3d7f2c7ebc9a7a789a587dd8abf948da4b4efd4028c98ab96ff9e97cca988bddbf4f8deafa798a091eb8d8df49afdb6fee5d486f881e4c5e8eee6bea5c7b783bbd9968080eaa1a8ab96cbb38480b1f786cd928297cc80bea9b992ab83e99c8295c79a8ca4e7dd84d5b1a3c9faf092dfacc9ddf1d9f7b4e1abe59accaab3cae5ecfcc8938e93f78993c4a0eb8af2a6b38ffabebfb0a5c2cee4b38bc8fee0e2d09d83f0b7e2d0c2d892e5e1b59fdbaaa8b6e587b493a6d6eba6aba9fdd3c0b9f1cad9fcd69ebe9ca9cdeed58bcfd8d5cfa4a0e2f9a697d4fee3edace0b4abe8c193ec94978ead8eace2d2b4b1cd84d5fa82c480929ea0b299b19dffb7feabcca8e29dc991dfa6ef8ea1eeb588e4dcbdaede82c0c7ca9583e6839be9d299cfe8cba2cd8ce29cc1dd81c0bac1d2fcabdaade8e8cec7c5d394d4c305a3c9bea9f3caf49495b2bd9fc7b9a0a5dce3d4bac09bbabb9bc3dc81dcba8493ffcfd299b8f5d0febe9af585dca3f6ed8c84b1fdecc3d5dee59faaf58190dbdd8dab8aab84d0cd87c3af9191e9eeb2b0939bbbc2f7dcdaf7aca8e1888ab88bf8a8a9ba9cb1f9db8fa6e3f1d3fed3d899cfa2f39cccf3e6c3a4fcade5fababbc1a0d883c2fad893a6d989fbd7b2d4b0c2f4f682c48989d4b3ad98ceb2b2b287b591efdf84f4c8f1b9a7dda2b1f195b1b8d8ecbef1fdf3c3c989d2f2b4aad8c28afcc581dc8a9e86e49ab2d8d9fad3f5b39db0fd8cf3efddfb94f4eabfd4ed9889dde2b9ceb7cdcbaeebb683d5fee99c8693ab82c59f8396c7eeb98cbedadd84aac7a5abefa8d197f6b0a0aeaf9f8fbcf1e8d5befaf786c69eb0bfed9fe5ff85e5818cdfb208dbf3ccb68cefa0def4f987edf5c5aeb6bc39")

// /**
//  * @description Partial raffle key 3 is 345678; This chest has been generated with the wrong time value
//  * @command tezos-client hash data '345678' of type nat
//  * @command timelock-utils --lock --data 05008e992a --time 10000001
//  */
const LOCKED_RAFFLE_KEY_3 = new Chest("a0aaa3d89aa2d59cf7ea8fc4bbf1a4b1af9893d8cde69eaebadff1a487e5a2beadbd9f8dcc84cfc799e3a2fff7bae497adc8c2dfd8d192e1baa9d3a0868ceffcbaa5a8bbebbafbe4b2fee7dae7d68bdfcee3eafcd09eb0f6c4dee3c5f685a0e1d4a4cf8cc2ebdcc3c38f95eeebbbfbf4edc78380db82bc94f0ef92bdc2feb9a8aedf8ab5abed91cdb7d6c6dce788dadcb9b8baa0fbb0cbeacaa5d1ef87bed38480b6b5f3fbc7b6b4ffd5c7d9ac8ec09298ebcbccf999c2bcd3a5b3e3a28485d999a3adca8c9eeef6dea88fdb96b7d0e49085edc792d7feb8c6b0d3aac387d9a0ca8589858de5d7cdb894f2c79df1f682bdc2ce87c796d0decababbc4fac4a6c1fef6b5cea3fcaed3e09dcdb68193f4f5ee8ca996ad8bcff6d28788d0caf5eaeecbb5c8be0a28cc21e50b92bcac704f7bd79554edcdd0332f919f450c8d0000001894d6ced168d44f9211ebc071e741a9fee651bdcbd6b2308d")
// /**
//  * @description Key is obtained with the correct chest time; it generates a 'bogus cypher' error
//  * @command timelock-utils --create-chest-key --chest ${LOCKED_RAFFLE_KEY_3} --time 10000000
//  */
const CHEST_KEY_3 = new Chest_key("8cf2b7b69bd4e18dc7a39c989ee3e8a4cfb191f485dd95ed8dabbff3fffdbabbceb5bbe09def8cc1a1a0809db6e3c6f6f2eca698d4e9c4cff1f1e3d2ecaaa58aa6d5dccbf1dfaefdbdfdecc4f38bbf97e9b5908daa89aae6ebab9ed9db919c8efba5ffb9bcb0f893dce2e7b390f0cd9c99f3d796d78dbd9cb8eb939385d9dfa0eda3b5d5adc4b58fe78fc891dea0c3c9a9f0d5d3c5feffdfdad78ee5ab91f4958d96f883dc8f8bb4a5d693f9bf8cc4fedbd99dfcf8a6afc8b9d2dbd19ca6edb5a8cd85e2c7cfde8d95fba6dd81a2d8a3e8a9a5939fc6cd9bc6f5f296eafb8dc5c1d2bfdfb8f3a582c0b5f6ceb899d4cbf6b7b48098d8bedff1a1e3c39df5aecad3a48ba5a5a1d9e9a9a7b8c094a4c8a7a3d7f2c7ebc9a7a789a587dd8abf948da4b4efd4028c98ab96ff9e97cca988bddbf4f8deafa798a091eb8d8df49afdb6fee5d486f881e4c5e8eee6bea5c7b783bbd9968080eaa1a8ab96cbb38480b1f786cd928297cc80bea9b992ab83e99c8295c79a8ca4e7dd84d5b1a3c9faf092dfacc9ddf1d9f7b4e1abe59accaab3cae5ecfcc8938e93f78993c4a0eb8af2a6b38ffabebfb0a5c2cee4b38bc8fee0e2d09d83f0b7e2d0c2d892e5e1b59fdbaaa8b6e587b493a6d6eba6aba9fdd3c0b9f1cad9fcd69ebe9ca9cdeed58bcfd8d5cfa4a0e2f9a697d4fee3edace0b4abe8c193ec94978ead8eace2d2b4b1cd84d5fa82c480929ea0b299b19dffb7feabcca8e29dc991dfa6ef8ea1eeb588e4dcbdaede82c0c7ca9583e6839be9d299cfe8cba2cd8ce29cc1dd81c0bac1d2fcabdaade8e8cec7c5d394d4c305a3c9bea9f3caf49495b2bd9fc7b9a0a5dce3d4bac09bbabb9bc3dc81dcba8493ffcfd299b8f5d0febe9af585dca3f6ed8c84b1fdecc3d5dee59faaf58190dbdd8dab8aab84d0cd87c3af9191e9eeb2b0939bbbc2f7dcdaf7aca8e1888ab88bf8a8a9ba9cb1f9db8fa6e3f1d3fed3d899cfa2f39cccf3e6c3a4fcade5fababbc1a0d883c2fad893a6d989fbd7b2d4b0c2f4f682c48989d4b3ad98ceb2b2b287b591efdf84f4c8f1b9a7dda2b1f195b1b8d8ecbef1fdf3c3c989d2f2b4aad8c28afcc581dc8a9e86e49ab2d8d9fad3f5b39db0fd8cf3efddfb94f4eabfd4ed9889dde2b9ceb7cdcbaeebb683d5fee99c8693ab82c59f8396c7eeb98cbedadd84aac7a5abefa8d197f6b0a0aeaf9f8fbcf1e8d5befaf786c69eb0bfed9fe5ff85e5818cdfb208dbf3ccb68cefa0def4f987edf5c5aeb6bc39")



/* Accounts ---------------------------------------------------------------- */

const owner = get_account('bootstrap1');
const alice = get_account('alice');
const jack = get_account('bootstrap2');
const bob = get_account('bootstrap3');


/* Initialisation ---------------------------------------------------------- */

describe('Initialisation', () => {
  it('Configure experiment', async () => {
    await configure_experiment({
      account: 'alice',
      endpoint: 'mockup',
      quiet: true,
    });
  });
  it('set_mockup', () => {
    set_mockup()
    // await mockup_init()
  });
  it('set_mockup_now', () => {
    set_mockup_now(new Date(Date.now()))
  });
})

/* Scenario ---------------------------------------------------------------- */

describe('[RAFFLE] Contract deployment', () => {
  it('Deploy raffle', async () => {
    await raffle.deploy(owner.get_address(), JACKPOT, TICKET_PRICE, { as: owner })
  });
})

describe("[RAFFLE] Open Raffle", () => {
  it("The unauthorized user Alice unsuccessfully calls 'initialise' entrypoint.", async () => {
    await expect_to_fail(async () => {
      await raffle.initialise(OPEN_BUY, CLOSE_BUY, CHEST_TIME, REVEAL_FEE, {as : alice})
    }, raffle.errors.INVALID_CALLER)
  });
  it("Owner unsuccessfully calls 'initialise' entrypoint with wrong 'close_buy'.", async () => {
    await expect_to_fail(async () => {
      await raffle.initialise(OPEN_BUY, OPEN_BUY, CHEST_TIME, REVEAL_FEE, {as : owner})
    }, raffle.errors.r0)
  });
  it("Owner unsuccessfully calls 'initialise' entrypoint with wrong 'reveal_fee'.", async () => {
    await expect_to_fail(async () => {
      await raffle.initialise(OPEN_BUY, CLOSE_BUY, CHEST_TIME, new Rational(20, 10), {as : owner})
    }, raffle.errors.r1)
  });
  it("Owner unsuccessfully calls 'initialise' entrypoint by sending not enough tez to the contract.", async () => {
    await expect_to_fail(async () => {
      await raffle.initialise(OPEN_BUY, CLOSE_BUY, CHEST_TIME, REVEAL_FEE, {as : owner})
    }, raffle.errors.r2)
  });
  it("Owner successfully calls 'initialise' entrypoint.", async () => {
    await raffle.initialise(OPEN_BUY, CLOSE_BUY, CHEST_TIME, REVEAL_FEE, { amount: JACKPOT, as: owner })
  });
  it("Owner unsuccessfully calls 'initialise' entrypoint because a raffle is already initialised.", async () => {
    await expect_to_fail(async () => {
      await raffle.initialise(OPEN_BUY, CLOSE_BUY, CHEST_TIME, REVEAL_FEE, {amount : JACKPOT, as : owner})
    }, raffle.errors.INVALID_STATE)
  });
})

describe("[RAFFLE] Test 'buy' entrypoint (at this point a raffle is open)", () => {
  it("Alice unsuccessfully calls 'buy' by sending a wrong amount of tez.", async () => {
    set_mockup_now(new Date(OPEN_BUY.getTime() + 10 * ONE_SECOND))
    await expect_to_fail(async () => {
      await raffle.buy(LOCKED_RAFFLE_KEY_1, {as : alice})
    }, raffle.errors.r3)
  });
  it("Alice unsuccessfully calls 'buy' entrypoint because raffle is closed.", async () => {
    set_mockup_now(new Date(CLOSE_BUY.getTime() + 10 * ONE_SECOND))
    await expect_to_fail(async () => {
      await raffle.buy(LOCKED_RAFFLE_KEY_1, {amount : TICKET_PRICE, as : alice})
    }, raffle.errors.r4)
    set_mockup_now(new Date(OPEN_BUY.getTime() + 10 * ONE_SECOND))
  });
  it("Alice successfully calls 'buy' entrypoint.", async () => {
    await raffle.buy(LOCKED_RAFFLE_KEY_1, { amount: TICKET_PRICE, as: alice })
  });
  it("Alice unsuccessfully calls 'buy' entrypoint because she has already bought one.", async () => {
    await expect_to_fail(async () => {
      await raffle.buy(LOCKED_RAFFLE_KEY_1, {amount : TICKET_PRICE, as : alice})
    }, {prim: "Pair", args: [{string: "KEY_EXISTS"}, {string: "player"}]})
  });
  it("Jack successfully calls 'buy' entrypoint.", async () => {
    await raffle.buy(LOCKED_RAFFLE_KEY_2, { amount: TICKET_PRICE, as: jack })
  });
  it("Bob successfully calls 'buy' entrypoint.", async () => {
    await raffle.buy(LOCKED_RAFFLE_KEY_3, { amount: TICKET_PRICE, as: bob })
  });
})

describe("[RAFFLE] Players reveal their raffle key (at this point a raffle is open and two players participated)", () => {
  it("Alice unsuccessfully calls 'reveal' entrypoint because it is before the 'close_date'.", async () => {
    await expect_to_fail(async () => {
      await raffle.reveal(alice.get_address(), CHEST_KEY_1, { as: alice })
    }, raffle.errors.r5)
  });
  it("set mockup time after close buy date", () => {
    set_mockup_now(new Date(CLOSE_BUY.getTime() + 10 * ONE_SECOND));
  })
  it("Alice unsuccessfully calls 'reveal' entrypoint because of an invalid chest key.", async () => {
    await expect_to_fail(async () => {
      await raffle.reveal(alice.get_address(), INVALID_CHEST_KEY_1, {as : alice})
    }, raffle.errors.INVALID_CHEST_KEY)
  });
  it("Alice successfully calls 'reveal' entrypoint and gets the reveal fee.", async () => {
    const owner_balance_before = await owner.get_balance()
    const alice_balance_before = await alice.get_balance()
    const jack_balance_before = await jack.get_balance()
    const bob_balance_before = await bob.get_balance()

    await raffle.reveal(alice.get_address(), CHEST_KEY_1, { as: alice })

    const owner_balance_after = await owner.get_balance()
    const alice_balance_after = await alice.get_balance()
    const jack_balance_after = await jack.get_balance()
    const bob_balance_after = await bob.get_balance()

    assert(owner_balance_before.equals(owner_balance_after))
    assert(alice_balance_before.plus(TICKET_PRICE).equals(alice_balance_after))
    assert(jack_balance_before.equals(jack_balance_after))
    assert(bob_balance_before.equals(bob_balance_after))
  });
  it("Alice unsuccessfully calls 'reveal' entrypoint because her raffle key is already revealed.", async () => {
    await expect_to_fail(async () => {
      await raffle.reveal(alice.get_address(), CHEST_KEY_1, { as: alice })
    }, raffle.errors.r6)
  });
  it("Jack successfully calls 'reveal' entrypoint and gets the reveal fee.", async () => {
    const owner_balance_before = await owner.get_balance()
    const alice_balance_before = await alice.get_balance()
    const jack_balance_before = await jack.get_balance()
    const bob_balance_before = await bob.get_balance()

    await raffle.reveal(jack.get_address(), CHEST_KEY_2, { as: jack })

    const owner_balance_after = await owner.get_balance()
    const alice_balance_after = await alice.get_balance()
    const jack_balance_after = await jack.get_balance()
    const bob_balance_after = await bob.get_balance()

    assert(owner_balance_before.equals(owner_balance_after))
    assert(alice_balance_before.equals(alice_balance_after))
    assert(jack_balance_before.plus(TICKET_PRICE).equals(jack_balance_after))
    assert(bob_balance_before.equals(bob_balance_after))
  });
})

describe("[RAFFLE] Test 'transfer' entrypoint", () => {
  it("Owner unsucessfully calls 'transfer' entrypoint because Bob is not revealed.", async () => {
    await expect_to_fail(async () => {
      await raffle.transfer({ as: owner })
    }, raffle.errors.r7)
  });
  it("Owner sucessfully calls 'reveal' entrypoint to remove Bob's chest, and gets the unlock reward.", async () => {
    const owner_balance_before = await owner.get_balance()
    const alice_balance_before = await alice.get_balance()
    const jack_balance_before = await jack.get_balance()
    const bob_balance_before = await bob.get_balance()

    await raffle.reveal(bob.get_address(), CHEST_KEY_3, { as: owner })

    const owner_balance_after = await owner.get_balance()
    const alice_balance_after = await alice.get_balance()
    const jack_balance_after = await jack.get_balance()
    const bob_balance_after = await bob.get_balance()

    assert(owner_balance_before.plus(TICKET_PRICE).equals(owner_balance_after))
    assert(alice_balance_before.equals(alice_balance_after))
    assert(jack_balance_before.equals(jack_balance_after))
    assert(bob_balance_before.equals(bob_balance_after))

    // check that bob is removed from player
    const player_after = await raffle.get_player();
    assert(player_after.length == 2)
  });
  it("Owner sucessfully calls 'transfer' entrypoint to send the jackpot to Jack.", async () => {
    const alice_balance_before = await alice.get_balance()
    const jack_balance_before = await jack.get_balance()
    const bob_balance_before = await bob.get_balance()

    await raffle.transfer( { as: owner })

    const alice_balance_after = await alice.get_balance()
    const jack_balance_after = await jack.get_balance()
    const bob_balance_after = await bob.get_balance()

    assert(alice_balance_before.equals(alice_balance_after))
    assert(jack_balance_before.plus(JACKPOT).equals(jack_balance_after))
    assert(bob_balance_before.equals(bob_balance_after))
  })
})
