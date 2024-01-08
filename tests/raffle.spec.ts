
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

const LOCKED_RAFFLE_KEY_1 = new Chest("e9bedb93c4b1d1d1f3afe2e59ab4a0cd93efc4a993d9faa48da3dfffa5bf91cfef8fbcf5f2bca8a0e69cd2f586d1b5f5dc83a6bba18f95a5d9d8ecf6eb88f6f1a8aab8ae87a2a2b3fbafb2dda5bcb3a6b18ad0f5ebe8a9f2dfc388cee1d5a5d7e58f868ac1c2bfa098dbf8ced1bffbd09ed0a4fab4a4a8fdf5fdf2dca8f6f3e6d5e99ea790f6ef97e4d2a7f2a1d8a2bbef9df4c198e0e08281f0d4dfa29cd593f8bbe699a28cf19bd8feb4a68bc8a0f1af8dcff0fea6b889a7bfe7bc949ba08ebff692a686d3d1c787ccc3fbbaadd588e0eaf9f2e4ec9bdfeccbaf88e1cfdce5d6e5ad82c7b2b194c89dab8cf2aea98d8ea8de85f1b0afafd3ae9fe0e0f8dfc58486ce93dfda92a4deb9a49585f3a6c6d0fd92e9b4f2ed99e4e7fcc49abcd0ecff9d92a0073900b556c243e49ccb2e4def5e0205b4707904e3952788d9000000154a8ca74d00794ef01ea522e7e6bb71d96e5a6cfce1")
const CHEST_KEY_1 = new Chest_key("a1e9f1eca1b983e3aaa1ee84c584ed8dbae2b6bab1dbb4bed299caccabd8c987e6affecf88c3d5d8efb6e181b1a2d591acc5e1b4ef87be9bf9fde3c4d0d98ef391b2ae8c86d6d582dbd3d0809cc4c0e2e8d7d4ecefc3e2e5dbf782eaf48cbf83b1f787c7e2faf3a7edfde290ad85dbd698f2e3fedac3dfd5c3f7fcbba4adcbb4ae948cf7bdc9ee8ee5ffa9bbd7fac19cbae7ab82c5a2ddca9280a9cbc2c8b7f7e5c6dbc390e8ced4a997f5b885cdacf789bed3d9a489a1f5de9ad1e2e4f6f6a3b18c96d1b3fd99bfc0f482fb89e08698ec8f89eca1ba96babfa3ecb1eba1bdfed5eae999b5b0a2e0c5aba8dae980fff3ccefdcb9ec99a7f9d4eac6dceefbc6feb596bd9ad7d69f91d1bcc48797fbabd3d0ece091a0b9cac1abc8afbfd38bc7ea80a2d2b006f2d3f6d5fcaaf9f1bcf8bec5e59d9de1a1defcc9cba289f9c9f8c3e9ceb0cfe790a0e7a0b9be8b91c3fdead280c4e5c7fbf8b8cb889feeeed18386c7cf9799cb8d8e96e3979683c9adc28bf3b4c1c2d8ff9089c2b395f6a387cf9fcae2fc8c95ecc4cafba885cd8e8e8deebca9ddc9c7ce95b3d1bd84d891c4bff9e1aeebf5e0dcccdaa9d7faadc282a1cd94829aa5c9b9eed0f1eeefd6d5def3b1d4fec9befca4a59cc79088ef8dfddebadced879ea4fc888edfe7e899c5d2dfe7acc1f6bbcaf0d699ad8ac4d1babcecdee7828282af9bf5fa99b884b4f3a5a58ef7db9ca5fb86b0cde083de8ed1cae6cda497d2f7e1afd296f2b5f495d2fbaacecfcaccd6affe94a09ec0e19088d88cf9beb695e1e489a9e9affeccb2d8a5c288ceeeb7abfee59eb58d0592d4a7d69daaa3f6c7dfb5e4e088e4a9fd8cd591e6ccd2eda5cac081cccbbad083a5b8c5dd82d1d4e397b1cc959ba192c0dbda80d2f0f0f3d0f295f0f6a0a9eabacce1c8cecfba8792ebdbc6f3aff591f4c6d4e9e7cade94c8b4d0aaf3928cf7aebb85f8e8bcdcef92d2cd989acb9595f6b2b6a7b0f9eae5aea2fea6f0f3e2fe8ac19cb7f1fac48abba197ad85f2aba581a8c2a3cfdaf0d8fcd1e1adafe79bcec4919e87c6caa9879ccdc7b9bcebe99bc3c0cffde3c6b994f6e9bfb6f197948083b1fca58fcca8e1facff9b8a394c380e8a6d7d480aceff1c9dffed0ed88d3fbeed196c7d3bffeddc5f4f7bfd5b6faf1d1bdf09b9cc8c7f7faaca9918b88c1f1aeb1c9b9f2f1e5ca85a8e299e4d480dde2838ceccb908889d1c9c5d8dcf2cfbfe8edcd9b0aec979e90a680c9b991b39d9cc7b0e7dcc2ce03")
const INVALID_CHEST_KEY_1 = new Chest_key("8cf2b7b69bd4e18dc7a39c989ee3e8a4cfb191f485dd95ed8dabbff3fffdbabbceb5bbe09def8cc1a1a0809db6e3c6f6f2eca698d4e9c4cff1f1e3d2ecaaa58aa6d5dccbf1dfaefdbdfdecc4f38bbf97e9b5908daa89aae6ebab9ed9db919c8efba5ffb9bcb0f893dce2e7b390f0cd9c99f3d796d78dbd9cb8eb939385d9dfa0eda3b5d5adc4b58fe78fc891dea0c3c9a9f0d5d3c5feffdfdad78ee5ab91f4958d96f883dc8f8bb4a5d693f9bf8cc4fedbd99dfcf8a6afc8b9d2dbd19ca6edb5a8cd85e2c7cfde8d95fba6dd81a2d8a3e8a9a5939fc6cd9bc6f5f296eafb8dc5c1d2bfdfb8f3a582c0b5f6ceb899d4cbf6b7b48098d8bedff1a1e3c39df5aecad3a48ba5a5a1d9e9a9a7b8c094a4c8a7a3d7f2c7ebc9a7a789a587dd8abf948da4b4efd4028c98ab96ff9e97cca988bddbf4f8deafa798a091eb8d8df49afdb6fee5d486f881e4c5e8eee6bea5c7b783bbd9968080eaa1a8ab96cbb38480b1f786cd928297cc80bea9b992ab83e99c8295c79a8ca4e7dd84d5b1a3c9faf092dfacc9ddf1d9f7b4e1abe59accaab3cae5ecfcc8938e93f78993c4a0eb8af2a6b38ffabebfb0a5c2cee4b38bc8fee0e2d09d83f0b7e2d0c2d892e5e1b59fdbaaa8b6e587b493a6d6eba6aba9fdd3c0b9f1cad9fcd69ebe9ca9cdeed58bcfd8d5cfa4a0e2f9a697d4fee3edace0b4abe8c193ec94978ead8eace2d2b4b1cd84d5fa82c480929ea0b299b19dffb7feabcca8e29dc991dfa6ef8ea1eeb588e4dcbdaede82c0c7ca9583e6839be9d299cfe8cba2cd8ce29cc1dd81c0bac1d2fcabdaade8e8cec7c5d394d4c305a3c9bea9f3caf49495b2bd9fc7b9a0a5dce3d4bac09bbabb9bc3dc81dcba8493ffcfd299b8f5d0febe9af585dca3f6ed8c84b1fdecc3d5dee59faaf58190dbdd8dab8aab84d0cd87c3af9191e9eeb2b0939bbbc2f7dcdaf7aca8e1888ab88bf8a8a9ba9cb1f9db8fa6e3f1d3fed3d899cfa2f39cccf3e6c3a4fcade5fababbc1a0d883c2fad893a6d989fbd7b2d4b0c2f4f682c48989d4b3ad98ceb2b2b287b591efdf84f4c8f1b9a7dda2b1f195b1b8d8ecbef1fdf3c3c989d2f2b4aad8c28afcc581dc8a9e86e49ab2d8d9fad3f5b39db0fd8cf3efddfb94f4eabfd4ed9889dde2b9ceb7cdcbaeebb683d5fee99c8693ab82c59f8396c7eeb98cbedadd84aac7a5abefa8d197f6b0a0aeaf9f8fbcf1e8d5befaf786c69eb0bfed9fe5ff85e5818cdfb208dbf3ccb68cefa0def4f987edf5c5aeb6bc39")

/* Partial raffle key 2 234567 --------------------------------------------- */
/**
 * Raw packed data: 0x050087d11c
 * ...
 */
const LOCKED_RAFFLE_KEY_2 = new Chest("f8858393f6f0b0b1fccdf989f8c8a0b084b8b68cb9bfc3c68597d8d9c5ca94f5b3fdb4b2e2e9eba7abfe92b1a6e0d09aadc8d8f38aa1a29afbde88a2ae81bbfacba7ce84fba6e8a5a1d3e19197b0988baad48796c2b8b1f29096898fe1fcdd8b87ecb0b1a8b692a9e3dfb4bea7d3b088a5add3f6d3c1c59cf9c6defb86b2c4d183ccbfbd9be6e482d1fcf1fdfed1fe9eaf89d4fa9fb5d9ab8db594cde5e0bfeca7b4bfe9f4e6ce8c9ac6d8bbb390acc1cc86dd98f6cee5979ea4f78bc7dea7ed8a92ffa9d5a294c6abb89debe3fc85f48efba5fab8989093f8d1fec7aca593f3af9ba6f6eac8ea96b3f6bbf7bfc883dd81b69bc5e5ea97c180d5f6e78ebbacd4b397f6ce8f8dafccd680b0bcc6daf1c18bb7f9fdf4efdfd5a7b8aca2b1e69df6c1d8ac890a3ca16883fbb1f64d65b7f8bc36a979a1dc3bfd3c455a8d4200000015ed09af48c72a7e30eda762461ba1540e81aadeede3")
const CHEST_KEY_2 = new Chest_key("cd8df7f7cd88949df1c8e5f0afa2acb682ddb9dfdeeb89f2ffa8cdea95c2ef99a9d8efa8dfb9ea9cdfec9ea48dfcd485e5fbc683fdabc8dae79d9998b785de848b81f0a4eaaba0deeed9a8f4adbeac99b596e1dfb5b682b6898ec5d794a1d0b7c1a980f1edd0cbe9bd8e8fa9f8d0a6ace3a6b180ffdef1d2ead887e6ace0a79ec5affbe6acd2b5e6c3b9f99d8bd0c8d4e78ae09adb8cdee6dec6bfd8a8dcacebd2fbca94a3ef90b6e9c0f9ef97a2ef82d89cbbbb92d9abf09692e989b3af97dac8f6e391d3f69ac3bca59e81abe49fab9bbf84b0a4de8dc380fcccf8e9e8dec99784fbd6aec0aadcaf8696c880dfaece9fd4e7d5c58bf1fee0d1d7b1d7c5f7d5f2b5bbfe84d5a3e8e2acb0f0c8c88ba8a6e383ceeedcdfdcedfe97ffd2eb8ba2b6c2e7960ae88ccb93e1a696fcfcc0f78381f2b586d99bb3b5beb2a7d2b2afb5f992f783dc85ea9ae69997869fafedaeb4e8fad4d7bafef7ec8db29cc1e5bca4bec2b28dacaaeea38fb8dba6aac8d1f592c6a48cdaa3fc86e881c1b9e28e8be6c9dcc2eec996c585b893c58cdb8be9d6a7dc9ac1d8e4c0b3cdd1ede8a194f0e2d9bbb8eedeeaba80e4d1e9ee9cd793d0dfe4fbc190a89ee3f2a5a3b2afda93a7cf9389e98c82bcf99e8ebf8790ceb8b5a1a5fd81f8e483fbcbc8cbf382a8a4d8d1d0a4a5a2efe4c3c2cbebb5d0aa9bb3ccbfd69ad7bfa0f6a483e8c1f3fccb93918c9cf4cada86b6a2eed9c197e3f9c3b4d4ac8bf4b5c782cb8ec9aae09c8891d8e6a5c6d1c383f8e79193d99cbaafcbc3e1a0e6c997a3939586b0c084b6cddc9a9aa5eab8c9dc98e108f0ce94a0a5e7ecfaaffa92d787dce7a5d0e5d9ecb884d5d3edf5fc998ad6b4e0dbaee5ec9da1e0f6cea6b1f4f6be9de195dbd3d3d2b2abc1fbade3e4e9e0b3a4d6a4bcf6898f99a8da9dd1c3cf9abca6e5fbe2a682d9d8bff4aac0eae0dcd6cbba9ef8c3b3cc8ff59a8e9485d4fbbecbabc5909df8f1f3f6a5efead79193869b949ff782fbc09b9ea48baab9a5f3dadd9895a6f6b9c0e18febe6dbefcde28999bb97e1dca1aac084d0dac6e0cd9f90cfaacddde8f186bca2d2f0b9f7d884de899b8db6e380bfddad80a0cea196eeac94dcfdc783f38399c2e8f8bcddcfb693db8ca9eb90aacca5de95f688abe58db8ddcd91cbcfa8f6cefbd5f9aed0deaecde6f3d7a3c8d1c7cbc6c3e5f8a78ba0a7cda994eea8dcaaa8b0aba0fa848fcaecbadf80a69d0592829cc1b58fb1d489cdf5baa6aaf2f7a8d402")

// /**
//  * @description Partial raffle key 3 is 345678; This chest has been generated with the wrong time value
//  * @command tezos-client hash data '345678' of type nat
//  * @command timelock-utils --lock --data 05008e992a --time 10000001
//  */
/**
 * Raw packed data: 0x05008e992a
 * ...
 * $ mockup-client timelock create for 10000000 with 0x05008e992a in data/chest_bob
 * ...
 */
const LOCKED_RAFFLE_KEY_3 = new Chest("dbdff8bde8e7c1a0e994bba0bbc4d5cacbafc4a7a1e3f8e9e384a0c386bdd3ece3e8dfaec39fcfc5a2a2f1b3b4f088e5d9e9aeb6a7e5cdb6c696a4f6c4d8e8c3c3cda79bfeb8adfea69697ff8fa9c4e785f8a48de9f7f8b7ffd299f0bdbdd8a0c2cf8198dea1ecf0f994b5fcad9aacf0f48bb2ffc3b8bcfca0ead68dd392ee8ea2e7e0d0a5b6c2a0c99599fa889ee8b4cdd8bcddec848fce90d8aeb2848ca4bd8afde4f9a9c1fbc1abd0dad8edbdebb0b0c8d386daadd995eec8bdd4e2e393f3d09da1bbffeac4deecd1a282e590cbb3cdcdb0d1adbcfd9dea8890b2d1bad49a8ebc88eec5a9b3aaa6dfb48990c2cc89ee9e8fcff595dbf7cbaeb7f9f88898c0b58dccb2f7dbf69bc2a187bbae85ca84b2b28af29c82f6a290fc95b9a082aec6cf8e82880b30599b5c6f0953760d26047caedd7494e394f9c7ff9c7c96000000150ee2351042ea1c490c8ef130fabbc40e6fb53eaf9b")
const CHEST_KEY_3 = new Chest_key("e5f6eecff5e689c7ffb99591b5ed86c98b91e2d5a0c787d2bc85eabded9581b182919febeaf6ec8d9ed3f7aab2959cd3a6f0c5c0c991dac29987b482a9bcefdb95b8c0ea9a94c68baad0f5c9af9b89ffb581d0feb591bcca9b9992baeceb9af4ee94ff9c96b8f9b8e9b2bba8dbe6e5c689d0b891f7c0bdef80c6b0a7b5e2dfc18baac7a49ba6a1e49fb997d1fece8a9fd3d6d8dee6f885f1d384e8faaaaa99bccfce968bdb9efb91b8a19ced91b491dbf88ff9d1a7d2e0b0fec4e4cce5e1f5c7fbcdc1f6b7afbbb498b3e2f883a7e59f94b29ec4938be1c8aaf4d9f9f7f1e2e5f18fbf849d89b69cf1d6a6abec9ed5dcabf1e397dbbee5aadee7a7a9be88c8a5bca7f5c4d5a9b8cb96aafbf8bce3b6b8c4d685aadabd8ae0dacaf39adde0e4d08af1d4c9019fd1d7dcdc929d9fbf94fd90e4a7cee3daf48e9b8b86c5a6e1d9e9ba8ba4c080affc98ed80c7e0ef9ffda2cbca9effbce7a0a3e4efbef4b2cad7bdffc6a8d9de97e7aab086c18ed4a88fed83aeebb3b9bdefe58ffd95c094e8f6eead88f2cd9dbdefd7d39bc6b2bfd2ebfda788f6d3a9b5e8e79f8de5f9e0e1a682d9d4f9ecc599c98aa88cf4a7f5a1f2c7e6e6a6c38db7ac98bcd6add5ccc0adc4fb88d7d4d8bbfea69fb693b6bceab4d2eb87df98cee9a194889e94e9c28fff8ecceafae4e483d0d2f39a80cab0fac5cce3e8d19ec09c8d86fdcff1dad3dda4d7c2edb493e9bacfa2a7a4e0a6c1a0d0f9bebab3a4dc9aed8afdc3beb39dcdadf594a7938dbc8887cbd6ded3aba5f89afda897b5c6d4898eb2cc94c08896e3f0c4e59ba2d4b2d09f89dc01bd8fd69893edb894c3b98be7dcc9fee3bdeca8eed7e7dd8fdda9a1f5f1d5e0baf3878adcdbe3b5d4beb9a4c3e88de2b8a3b5bfca92b3c8c7d78eeffa89b6a9d3ef9bd6caf8929f9ea6dbb2cbf4a6bbe5d2b2a29897a0bd99f9cab3cdecd0f5cae5b596d7a8f7dbc19ab2f5ace4f1ca9ba18afad2cddcdfbba1e4a1ac949e8cdbe6cc8dd6a0f1b9f5a4c8d898d8f7e2fdb0b3dcd8e599ecc1e2a8a6cec1b7bed3caf499c1aac8958188b1b5c3c0e6abb7aec1f88ab1d8ff80c5f2bdf7f4c8f1ef8feb9dcddea2be95d399ede0d7dde483ecd1f1d7c18da196e4fafb9984b8e4bd9ab286a6a9d0fbb49e84c8befed9aaffd2f3e184c4c0cdc6fad08dcfccdef787aad9c8b0a7d6a8effafdf0a6e9eaa895869aa5efc6c7bbc1b6e8fbd4d8bdf4cca699aec3039edff1b780e6bee99fe0fdc6cf84abf7ec8f02")



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
  });
  it("Owner sucessfully calls 'transfer' entrypoint to send the jackpot to Jack.", async () => {
    const alice_balance_before = await alice.get_balance()
    const jack_balance_before = await jack.get_balance()
    const bob_balance_before = await bob.get_balance()

    await raffle.transfer( { as: owner })

    const alice_balance_after = await alice.get_balance()
    const jack_balance_after = await jack.get_balance()
    const bob_balance_after = await bob.get_balance()

    assert(alice_balance_before.plus(new Tez(62)).equals(alice_balance_after))
    assert(jack_balance_before.equals(jack_balance_after))
    assert(bob_balance_before.equals(bob_balance_after))
  })
})
