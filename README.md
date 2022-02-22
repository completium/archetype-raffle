# Archetype Raffle Contract

Repository of the [Archetype](https://archetype-lang.org/) version of the [Raffle contrat](https://opentezos.com/archetype/raffle-example/raffle-contract) presented on [Open Tezos](https://opentezos.com/).

## Install

Run the following command to install the dependencies (Mocha and Completium):

```bash
npm i
npm i -g @completium/completium-cli
completium-cli init
```

### Mockup mode

Completium uses the tezos mockup mode provided by the tezos client to execute contract locally.

Tell Completium where to find the tezos client with the following command:
```bash
completium-cli set bin tezos-client <PATH_TO_TEZOS_CLIENT>
```

> Follow these [instructions](https://assets.tqtezos.com/docs/setup/1-tezos-client/) to install the Tezos client

Initialize the mockup mode with:
```bash
completium-cli mockup init
```

## Run test

Execute command below to run test:

```bash
npm test
```

Below is the output of the above command:

```bash
$ npm test

> archetype-raffle@1.0.0 test
> mocha --timeout 0 --slow 99999999999999999 ./tests/*.js



  Deploy
    ✔ Raffle

  Open Raffle
    ✔ The unauthorized user Alice unsuccessfully calls 'initialise' entrypoint.
    ✔ Owner unsuccessfully calls 'initialise' entrypoint with wrong 'close_buy'.
    ✔ Owner unsuccessfully calls 'initialise' entrypoint with wrong 'reveal_fee'.
    ✔ Owner unsuccessfully calls 'initialise' entrypoint by sending not enough tez to the contract.
    ✔ Owner successfully calls 'initialise' entrypoint.
    ✔ Owner unsuccessfully calls 'initialise' entrypoint because a raffle is already initialised.

  Test 'buy' entrypoint (at this point a raffle is open)
    ✔ Alice unsuccessfully calls 'buy' by sending a wrong amount of tez.
    ✔ Alice unsuccessfully calls 'buy' entrypoint because raffle is closed.
    ✔ Alice successfully calls 'buy' entrypoint.
    ✔ Alice unsuccessfully calls 'buy' entrypoint because she has already bought one.
    ✔ Jack successfully calls 'buy' entrypoint.
    ✔ Bob successfully calls 'buy' entrypoint.

  Players reveal their raffle key (at this point a raffle is open and two players participated)
    ✔ Alice unsuccessfully calls 'reveal' entrypoint because it is before the 'close_date'.
    ✔ Alice unsuccessfully calls 'reveal' entrypoint because of an invalid chest key.
    ✔ Alice successfully calls 'reveal' entrypoint and gets the reveal fee.
    ✔ Alice unsuccessfully calls 'reveal' entrypoint because her raffle key is already revealed.
    ✔ Jack successfully calls 'reveal' entrypoint and gets the reveal fee.

  Test 'transfer' entrypoint
    ✔ Owner unsucessfully calls 'transfer' entrypoint because Bob is not revealed.
    ✔ Owner sucessfully calls 'reveal' entrypoint to remove Bob's chest, and gets the unlock reward.
    ✔ Owner sucessfully calls 'transfer' entrypoint to send the jackpot to Jack.


  21 passing (48s)
```