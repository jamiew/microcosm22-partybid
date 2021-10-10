# Important configuration

IPFS URLs:
- NFT Metadata: `QmUAhBXfEo7LD5RHXzshqeVeqPGf9De2womrswDgDEJtmi`
- NFT Image: `QmcFQ72MeWAcVZgcd73NcbyJKNx3i8a321uZQtf8bwJwRS`


## Running/development

Install dependencies:

```
yarn install
```

Then run the development server:

```shell
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing locally

Run a local chain

```shell
yarn chain
```

Then in another terminal, deploy the contract:

```shell
yarn deploy
```

To deploy the contract to mainnet, adjust the config vars (e.g. IPFS URL and your local wallet private key) and then run:

```shell
NETWORK=mainnet yarn deploy
```
