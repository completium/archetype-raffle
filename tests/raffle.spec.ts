
import { configure_experiment, expect_to_fail, get_account, set_mockup, set_mockup_now } from "@completium/experiment-ts";

import { raffle } from './binding/raffle'

import assert from 'assert'
import { Chest, Chest_key, Nat, Rational, Tez } from "@completium/archetype-ts-types";

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
/**
 * $ mockup-client hash data 123456 of type nat
 * ...
 * Raw packed data: 0x050080890f
 * ...
 *
 * $ mockup-client timelock create for 10000000 with 0x050080890f in data/chest_alice
 * Timelock chest and chest_key computed.
 *
 * $ xxd -p data/chest_alice/time_chest_190195d94a3629e6ce3422bca11c281d943c5682034b05ccc40c6d73609ab7bd | tr -d '\n'; echo ""
 * a6e2f8acf3b3c088bcaf9fdbb7dcaf8fe1a39ddd9fd0fbf3ecbba9fdb19f96fcafe9d0d49df8b0bed3b7afdbb1b2dbcb9ca0c1a5e49ddd8be9d7e8cec5eac7f8f9bb9da1b9eaf3d1eef193eef3f891b1b0cdb5bccf95c3f18dc5f3f5b6838ba2fac9e09ae7cdf696df8d9eb8b8f0d6fb94a4dad0838ed0e8cffecd92f1d7f7efe2fce08986c6e788bceac5c4b1f8b48581aaf9b4c2f3e681fad392cdf1f6f1eaa684ccb5b2a5faaf98bb80d0d4ba9fc0b087c7cd828582c499e6a4e4f799dab6baf2bbd7add7b1aa8be7e49b87f1f6d2bc89a2fcb887e7df938ea9f4c2a488c4a4fef4869c8bd78aeddea0e3acc1a0c6918bf5b8e7da9ea6d0e2acd3efcfc29bd0abd19b98a1d292c9d3f9f3f2a4c9f7abc5b2b982c8cbbbe4b292bca7d2a4aaff88a4f8044a4e75bc6fa0e81e707239f2bd801698304851827819aa690000001caed068c4037b2eca5ba0d745d39d2a67e95764c6b2f1370365b06a25
 *
 * $ xxd -p data/chest_alice/time_key_create_190195d94a3629e6ce3422bca11c281d943c5682034b05ccc40c6d73609ab7bd | tr -d '\n'; echo ""
 * 8cbac2f2db93acd68dda82ae83c3badbe784a19ea58cfb8ba9a5daa0faf4cbaabfdcdbbedea9abccf38f83f682e3ecbfdb91aa93dcacb8b19ebcdd9bb8a3d3f5f7f0a888ccd4bcaa80e98494ffa1a2a7f8bead8990c681b5fbefeca1fa9fb3edc885d9bd92a485d4ae9e8ca5acc8b8f9b8d0d5918bcbc0d1c7a599ddef88acb9bcc39d96baf483a9b4b2f5b4a3afb4b1f6d0cabca7c4a4bbd6c0a6d985dfdffea293878de2e1fbe9ecd5c6b4cbbadd95d89cf3a7f0ac91d9d4b19ca3aad0be958a86eb97c78d92d4b8f7d8998697c0d4b3ea918096d7bba783fdcacdecfa8b8dec95eff184cfc0c8fab6cac5f1cdecf1d2a788bc92a5b987e9c0b8db8cc3d2db9696ad93b3e5bedfbeced6eaed8ec6c49ad0b5c9a5afc8fc9a81c8a0f6c4bf9fd5c9b2d304cf8fbd939d82aca2f6b1e5f2dbf7dec0cbd8b69acbb493d7bff99cf8918fad84a4ae93e6bdbcba9185ddd8bad7c5b1a9ebf093b2dea1e682eff2f8c2f5cfb3d5ada5e6aaa39fc6a48dbd97d9aae6a5e4beb89bf69be493f5bbc7b2a7affcc6c6f4cc9cbcae8abba8a4b494fedda7bad489e2c9a8d080e0f384cef1df8094de93c39a9aa487bd90d4eed19599a1a0e380a0f6aee786ddc0acfcd9ec93e6f3f1aed6b6da88c9e7dfed9ea5cdd9fcbef3f6b799f7aee7aca6a8ceade0ba82a5c6daf0c7a6eac7d7d5b2cc909eecc9c796a5b8cbd8f1b0beb5e8b6d2a4f98299a2b296b8ab9de9dea2ade8f4fce4b2d392b5d1b0a1cdc4d0a1f5c498d8bcf2aacbdecbacc8f6cbcfdffb8dcef1de88b3ffddf4a684f5e6cbdff3d8ce96e9e0a79cfcdca08eae0b93a0eee8c78fb1f59be9e9d8aaa3bde695c9d199e5c692d594ecadf4c8e597eed4b8b4b5faab99eeb7ff96cabe8aa398be85eae1e9f3a081909aadd6d481e685cf94cec2b2bcfbd9f995ff8fdac2aa8e87c29fecf880ab8ba3f8bebe9e8fd6d194e19ee3f9eea7aecdafab88c4da9ecea1ecffced790bd8cb38dedf6fbfae882d8fad6cefccdd5e0d4ea84feb6e3a2b499ad98a7f5a2ced4f8eabaffd6f5c18ce5b8d2a1b194eed4d39690eeb6d3d7aeb580d3d189a0d2f68abebdc2ef8a929cb6b1e6bbb98ec9ada584c3c3d58783eb8ce9b6ebf8fa9cefa0a9a8828bdae9d5e2faf8ffd8a483ec8d94c5ddc0f4eab6e2b781b6a0cac48bafdee2bfebaa8dc5b08399a783e98cebf1f0dcf68687d3d0c4b6e2e6e0b2cdd3eb84b3f4e28ae4f48cd4e76f868b82e5f286aa908d83c4b7f3c687cb94f701
 */

const LOCKED_RAFFLE_KEY_1 = new Chest("a6e2f8acf3b3c088bcaf9fdbb7dcaf8fe1a39ddd9fd0fbf3ecbba9fdb19f96fcafe9d0d49df8b0bed3b7afdbb1b2dbcb9ca0c1a5e49ddd8be9d7e8cec5eac7f8f9bb9da1b9eaf3d1eef193eef3f891b1b0cdb5bccf95c3f18dc5f3f5b6838ba2fac9e09ae7cdf696df8d9eb8b8f0d6fb94a4dad0838ed0e8cffecd92f1d7f7efe2fce08986c6e788bceac5c4b1f8b48581aaf9b4c2f3e681fad392cdf1f6f1eaa684ccb5b2a5faaf98bb80d0d4ba9fc0b087c7cd828582c499e6a4e4f799dab6baf2bbd7add7b1aa8be7e49b87f1f6d2bc89a2fcb887e7df938ea9f4c2a488c4a4fef4869c8bd78aeddea0e3acc1a0c6918bf5b8e7da9ea6d0e2acd3efcfc29bd0abd19b98a1d292c9d3f9f3f2a4c9f7abc5b2b982c8cbbbe4b292bca7d2a4aaff88a4f8044a4e75bc6fa0e81e707239f2bd801698304851827819aa690000001caed068c4037b2eca5ba0d745d39d2a67e95764c6b2f1370365b06a25")
const CHEST_KEY_1 = new Chest_key("8cbac2f2db93acd68dda82ae83c3badbe784a19ea58cfb8ba9a5daa0faf4cbaabfdcdbbedea9abccf38f83f682e3ecbfdb91aa93dcacb8b19ebcdd9bb8a3d3f5f7f0a888ccd4bcaa80e98494ffa1a2a7f8bead8990c681b5fbefeca1fa9fb3edc885d9bd92a485d4ae9e8ca5acc8b8f9b8d0d5918bcbc0d1c7a599ddef88acb9bcc39d96baf483a9b4b2f5b4a3afb4b1f6d0cabca7c4a4bbd6c0a6d985dfdffea293878de2e1fbe9ecd5c6b4cbbadd95d89cf3a7f0ac91d9d4b19ca3aad0be958a86eb97c78d92d4b8f7d8998697c0d4b3ea918096d7bba783fdcacdecfa8b8dec95eff184cfc0c8fab6cac5f1cdecf1d2a788bc92a5b987e9c0b8db8cc3d2db9696ad93b3e5bedfbeced6eaed8ec6c49ad0b5c9a5afc8fc9a81c8a0f6c4bf9fd5c9b2d304cf8fbd939d82aca2f6b1e5f2dbf7dec0cbd8b69acbb493d7bff99cf8918fad84a4ae93e6bdbcba9185ddd8bad7c5b1a9ebf093b2dea1e682eff2f8c2f5cfb3d5ada5e6aaa39fc6a48dbd97d9aae6a5e4beb89bf69be493f5bbc7b2a7affcc6c6f4cc9cbcae8abba8a4b494fedda7bad489e2c9a8d080e0f384cef1df8094de93c39a9aa487bd90d4eed19599a1a0e380a0f6aee786ddc0acfcd9ec93e6f3f1aed6b6da88c9e7dfed9ea5cdd9fcbef3f6b799f7aee7aca6a8ceade0ba82a5c6daf0c7a6eac7d7d5b2cc909eecc9c796a5b8cbd8f1b0beb5e8b6d2a4f98299a2b296b8ab9de9dea2ade8f4fce4b2d392b5d1b0a1cdc4d0a1f5c498d8bcf2aacbdecbacc8f6cbcfdffb8dcef1de88b3ffddf4a684f5e6cbdff3d8ce96e9e0a79cfcdca08eae0b93a0eee8c78fb1f59be9e9d8aaa3bde695c9d199e5c692d594ecadf4c8e597eed4b8b4b5faab99eeb7ff96cabe8aa398be85eae1e9f3a081909aadd6d481e685cf94cec2b2bcfbd9f995ff8fdac2aa8e87c29fecf880ab8ba3f8bebe9e8fd6d194e19ee3f9eea7aecdafab88c4da9ecea1ecffced790bd8cb38dedf6fbfae882d8fad6cefccdd5e0d4ea84feb6e3a2b499ad98a7f5a2ced4f8eabaffd6f5c18ce5b8d2a1b194eed4d39690eeb6d3d7aeb580d3d189a0d2f68abebdc2ef8a929cb6b1e6bbb98ec9ada584c3c3d58783eb8ce9b6ebf8fa9cefa0a9a8828bdae9d5e2faf8ffd8a483ec8d94c5ddc0f4eab6e2b781b6a0cac48bafdee2bfebaa8dc5b08399a783e98cebf1f0dcf68687d3d0c4b6e2e6e0b2cdd3eb84b3f4e28ae4f48cd4e76f868b82e5f286aa908d83c4b7f3c687cb94f701")
const INVALID_CHEST_KEY_1 = new Chest_key("8cf2b7b69bd4e18dc7a39c989ee3e8a4cfb191f485dd95ed8dabbff3fffdbabbceb5bbe09def8cc1a1a0809db6e3c6f6f2eca698d4e9c4cff1f1e3d2ecaaa58aa6d5dccbf1dfaefdbdfdecc4f38bbf97e9b5908daa89aae6ebab9ed9db919c8efba5ffb9bcb0f893dce2e7b390f0cd9c99f3d796d78dbd9cb8eb939385d9dfa0eda3b5d5adc4b58fe78fc891dea0c3c9a9f0d5d3c5feffdfdad78ee5ab91f4958d96f883dc8f8bb4a5d693f9bf8cc4fedbd99dfcf8a6afc8b9d2dbd19ca6edb5a8cd85e2c7cfde8d95fba6dd81a2d8a3e8a9a5939fc6cd9bc6f5f296eafb8dc5c1d2bfdfb8f3a582c0b5f6ceb899d4cbf6b7b48098d8bedff1a1e3c39df5aecad3a48ba5a5a1d9e9a9a7b8c094a4c8a7a3d7f2c7ebc9a7a789a587dd8abf948da4b4efd4028c98ab96ff9e97cca988bddbf4f8deafa798a091eb8d8df49afdb6fee5d486f881e4c5e8eee6bea5c7b783bbd9968080eaa1a8ab96cbb38480b1f786cd928297cc80bea9b992ab83e99c8295c79a8ca4e7dd84d5b1a3c9faf092dfacc9ddf1d9f7b4e1abe59accaab3cae5ecfcc8938e93f78993c4a0eb8af2a6b38ffabebfb0a5c2cee4b38bc8fee0e2d09d83f0b7e2d0c2d892e5e1b59fdbaaa8b6e587b493a6d6eba6aba9fdd3c0b9f1cad9fcd69ebe9ca9cdeed58bcfd8d5cfa4a0e2f9a697d4fee3edace0b4abe8c193ec94978ead8eace2d2b4b1cd84d5fa82c480929ea0b299b19dffb7feabcca8e29dc991dfa6ef8ea1eeb588e4dcbdaede82c0c7ca9583e6839be9d299cfe8cba2cd8ce29cc1dd81c0bac1d2fcabdaade8e8cec7c5d394d4c305a3c9bea9f3caf49495b2bd9fc7b9a0a5dce3d4bac09bbabb9bc3dc81dcba8493ffcfd299b8f5d0febe9af585dca3f6ed8c84b1fdecc3d5dee59faaf58190dbdd8dab8aab84d0cd87c3af9191e9eeb2b0939bbbc2f7dcdaf7aca8e1888ab88bf8a8a9ba9cb1f9db8fa6e3f1d3fed3d899cfa2f39cccf3e6c3a4fcade5fababbc1a0d883c2fad893a6d989fbd7b2d4b0c2f4f682c48989d4b3ad98ceb2b2b287b591efdf84f4c8f1b9a7dda2b1f195b1b8d8ecbef1fdf3c3c989d2f2b4aad8c28afcc581dc8a9e86e49ab2d8d9fad3f5b39db0fd8cf3efddfb94f4eabfd4ed9889dde2b9ceb7cdcbaeebb683d5fee99c8693ab82c59f8396c7eeb98cbedadd84aac7a5abefa8d197f6b0a0aeaf9f8fbcf1e8d5befaf786c69eb0bfed9fe5ff85e5818cdfb208dbf3ccb68cefa0def4f987edf5c5aeb6bc39")

/* Partial raffle key 2 234567 --------------------------------------------- */
/**
 * Raw packed data: 0x050087d11c
 * ...
 */
const LOCKED_RAFFLE_KEY_2 = new Chest("f7ed9d9da2c6b5f1a9eee7edffc4d2de92a6bed3cce5c0ebb3e6b395dafdecfbd5f7d0d7cf8ab4ceb99cdc86c4f5f9b1e7fb8f81def2f9d6da89e1a0f4a2a0b7cecebcc7fa96d0cb87aef399e3cef2e19cd9b3bec5f4d1ffdcecf0cc84d8a0d9c3bbf6beb6c7a78cec8efa91aff9c1f4b0a7fcd2cba4f5c9efba92f1e4b6aaf0a889e7bbe6b2cfe991c3aaf39cc0abc1daaa88d7f2c8de9ae1c0efc3b3e0add2d486a388b7a4bfedb1c7e194aaf3edfc8fd3dab98bf5edb5ae88fcbaab84cb8beeaf91c5b881fd9d9bcabfedaac89df98db682cdebe28497fca99487e7c2b5fce0e7c4ceeaa3bacbbec787dae5f6ff9adbfbf2b48ab8b8cda092a4ff9efd94c7da99f280cbd8bee5f682f5edb9eb94c8dde0d194b7a2f2c2c1cda2cbf597adf1b7e4a5a502ea60bf8d52dcadfb10e8942d525e3696794aa5c9ad0557730000001c98acbab6179813d623460adbf73fefc849ba02826019461c53689129")
const CHEST_KEY_2 = new Chest_key("a7c9b89efbc9a1e6c4a8f39ad2c1b18ca5fcade48ad7c9878087f9feeeb6fa89c4edbdd4cdf58ab2ddcbf4d6b1c8d2f3f1a9c78dc9cbf488b2e3aa94aefa95c5f7c6dcc4e5c38997aee4c9eed8b9f6a682eff4939bcf86e5c5b2929ad68be4bfcaf4f288a2c59dfbb0a4a195d180929c93819b9fcda1fdd0b8bfa98282be81b390efffdeebdba6afbfe78fe7cb93b2f0c8e8b0e590bca8f5f5fddadcc8c8b9a08f81fdfc8f96cff6a2bff4a0cf8784898bf2d0a2b4cfe19f9eeff6a088bb90e3bdaffd85e6a9c090c4d68380cce58bebcfafdd93b5818bc1d8e091d38ae6edbfb9e28d83c4e3c69bd6c5d09ddcc691d7ef98a19d9d8fddbcecdcf9d598d5e7cb98dedaa5b5b3d8d8f3d4cbb4c1c2c5a0cfc6f5aefd8bc0cf84b78ca9eb94979d8cc28bae0ba8dbffebb39bb2c3c5ca9abeb2e68481f78cedb6eadfd69ec7ed9cedd48691aba5f5d8e88dabb3938eaffeb49da3d9f5c9e48e80a8e8f4ae8bb9aaa691ada0bacdb4f498d9d49bead2ceb782fcda9efbe892f4a9cabad088eed29be4d4e39fc996b1b095e992f5cda9adc2b6839de8fd98afd1e7cbd9e48582d0c0d29ac2c4e5eca0b7cbd0ece6a1e0a88791c2f5968aeaebdbccbac7dc92cdfaaca0c0a7b0e694e0d9eee1dce18694cea09edee0b9d2dec0e590adeec4d09d82cecfa6c394daae9b99f18babe0a5f7a3b1f8a2d1f9c5a1a5b4fb91a4add5efd4ec9d96d99fbc93acd3abd7fca798bfd4e7c99691e9dc8296d7efee9e98a298c0baa494a4a0979b89eaccb4a2bc80bae9b9ae8f939e9cebddfbebeeaef4fdfedc8ce4e5febd82f8ec8ed609a2d7a5e9a5dbcf8ec5a6839d96d89cebbdbdaa93bea5b5aee691e6e4e9f1a6b584def0bafbd480e1d498b8adc4ecda97f58381e8a787f287c4d69ff9ba92c0e299f1eca891adbafeef94dbba9a90bb8dcd8df7e4f4a1cadfa4b6c1edd793a7e3c8e2e78eda95f4c1c0a2c2f6f7bd85b6868fcbbaac87edc8d8cb9df6f187c2b0e1a8e893d5e1e0d2a5b1eac1dc86eadbd6dbd4d08da8c8a1a18a81dea5ec88adddabb7e6aee0dcccecd6d799a7ffdfebb0dd90b7aecce8ddb4a7e3a8c1a9d0a4e197c1a48ee4b98296c9fa9b96c6aec4b6afe4cab9beb4b49599b296ebd0fccafabe819496aed3a3af88ade0d9dfa0a9a6c7c087dac2e98499bbe3febed2b9f5a6c2a59cbd9e9fa1f9d1e7b3e4f698d396c98e80e784bd948892ba8499abbfd4a4f8ea9402dd809dfe83c6bdf8b281f0a9eac4c2e2dbf701")

// /**
//  * @description Partial raffle key 3 is 345678; This chest has been generated with the wrong time value
//  * @command tezos-client hash data '345678' of type nat
//  * @command timelock-utils --lock --data 05008e992a --time 10000001
//  */
/**
 * Raw packed data: 0x05008e992a
 * ...
 * $ mockup-client timelock create for 10000001 with 0x05008e992a in data/chest_bob
 * ...
 */
const LOCKED_RAFFLE_KEY_3 = new Chest("baf5dfffb4f0f8c1b7c8abcbbeb98897c7fd819ccbe2e4f899e5a2f4bba184f4818da4e494cdcaacb6ff85b4fd9c8bf1f5bdd2f4c5bcd89dd1a8f8cea0c5bc81eff4d1d1f8b4cdffd2fcded2fca4819ed3c7ba84c3a4cfe0f8d5ced8ed8695b5f2f2b9bbbff9aacbbaddbef1a2f1d388a5f0d7f3df93f9b2a1cd9ff18d8c92fad381c4f89fd097bdefbdda8fe492c7c5adeecb9e98dac5b0a3d6d7caed9e9aafc5bfbcc195fcc79ff9f5a189c5bda69f88d6a7e6aaeea9ae989ea7bfe7d8a4a1d3d6fce1d1eed7d0d5c4e9bedaaac898ebeee6d9c3feb8a6d2d0dfbbf9c3e9ed95d5ba919bc7ffdd96f4ead3fe80f7e3b7e7cdd4dde0aef3c1bbd4d386c0929097b68cce8694beebab89ecf5c7ade384fedbb6e992eb9c8b90cee2b5dcd4a0a1abe3d9aa08fe6d0107c4a54b83fc0e9f1cbc98d1b922e3b903174eab5a0000001cad5176d1d5ee91826ebba8086288d67e68253a1c44301fb3f4d49554")
const CHEST_KEY_3 = new Chest_key("be92fcad91f8bfd78cf2a099ba809ad49f9ba9edc3cc80b2adc6cad8ffb7828782bdfeebbf8fce8a99b9abfcafc7a3f398e494a7bb928ed4e4ecb496deb89ab4e2b6c1ddc182c9f697e4bba0fb8beff8b386d9eae28ebe80e4eabf96c6aad296c6c8e6d8d1e3c799a3b0a4f6e887b6ebb4eee888e4e4bad185b8cc8abec3cc92e082cbd8fca389bf9aeae5b0daaa91d4f7a4bdf4ea88bc9196d0ff8bbcedfa9ef9fd8fdec1adcaeb9fc9fff5dfaadbf9daa5cda2a5b7c5a5838ed1ba8783e6e1a09df2ddb781f084919b94a085b3f4e494da89efa4ffd38fa8b9aab1e9a6aff9c7bacda9f8b0ff8af8e0d9b4e3b4979288ab91dc98fff1858486a4cae0dad6859bf5adf1d0e8cecfffb380b09692f5bd88efed85a5b996d393e49ea88fd589c8f0e7fdb90cd9b3e2b9a9b3e5cd81b1edf2c2caf2c8de83eb9bcf9287c6c8a7c4d89287a4c4e382b1d3ced49ecda5ddedbbf3eeb68dfbb7f7ea9de0c2a496d8f7c1c3a2a8a1fccecda3dfa4e69eaaa5b2919b97f5b790e8e1c1facabcbee6a0c0eafac583d5d6eaa2badd859b94a38cc58091aee7d896d881f1989bc0f8a6bea6beacd9d08dfb9fadbe8897d292ceb7fbadc2aca0eca7fdd495cde2ba9986d094efe4e3cdb48bc6b198e9cec7b2b2c7c2deffe384aafc85f9a19d80c583a1f8f9bdd5ccc689eaf5ef89f1c78cdef0f2b7f0cea195f286f89abff6d098e4eca0f5b6889d84b9d0eae2f3b29cd398de8c8be6c5c0ec8384acf7cac589bc9ffefb99b689a7afbbbabe85b8dfbc9fd5d2e7a5ccf1ce87b0bff2b99888a8e1c9c3fd9eff9483ed82c4cff1870a95dafda3bae7fad8e7d78189a2d7f6a798e08481dedbb3efb4ccdc95de8be8b7f9b7cc82d4f3eee7e7e290f6e4d88bc498f3949bb4a9c294b09bf29cb49fc1c1eaf9e2949bc69cdfc582eedffabfb6b48fe1bf98c4bfefd5cddea2ab83feb5e8cec7b0b996e4eeb9ef8fa2d5c8fe96a4d1e0abc0b99afc9b9298f8c8df8ca6aacbdfddd8d08cca8c94adffce97afe68198cc91e5e2d1d3d8e2abc5c1acffeecd879d838dbdbb9ed3edace7d2979b82fefacfaf91d8958ab3fae1dd83a3bb9fc0e8e48ea5a0aaecd8eed1bcedc2b4bdb5c2c695c38ca1eceec8e59d80c0e0d287e2aa89cea7ae8fecf4a2b5ebdf91a4f9b6e2c7c685e4d4b7d7d2e3c0b883c38baf97eb81c6e8d2c68dd095ef9390d8c4ddfb8c8d97bf93938786bea9fde385d98ecda8da01eff581faf19ad88cedd1b1ffb28ed4bdcebb01")



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

    assert(owner_balance_after.equals(owner_balance_before))
    assert(alice_balance_after.to_big_number().isGreaterThan(alice_balance_before.plus(new Tez(0.99)).to_big_number()))
    assert(jack_balance_after.equals(jack_balance_before))
    assert(bob_balance_after.equals(bob_balance_before))
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

    assert(owner_balance_after.equals(owner_balance_before))
    assert(alice_balance_after.equals(alice_balance_before))
    assert(jack_balance_after.to_big_number().isGreaterThan(jack_balance_before.plus(new Tez(0.99)).to_big_number()))
    assert(bob_balance_after.equals(bob_balance_before))
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

    assert(owner_balance_after.to_big_number().isGreaterThan(owner_balance_before.plus(new Tez(0.99)).to_big_number()))
    assert(alice_balance_after.equals(alice_balance_before))
    assert(jack_balance_after.equals(jack_balance_before))
    assert(bob_balance_after.equals(bob_balance_before))

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
