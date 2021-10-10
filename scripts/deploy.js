const hre = require("hardhat");

const tokenUri = "ipfs://asdfasdfasdf"
const partybidContractAddress = "0x5dCc03D9A613E59db4751D1071dBAF3cAEDFFd30"
const fractionalContractAddress = "0xdd75fed2b89fc0ed5a955f6856a44dcc9e453ae3"

async function main() {
  const Contract = await hre.ethers.getContractFactory("PartyBidMicrocosm22");
  const contract = await Contract.deploy(tokenUri, partybidContractAddress);
  await contract.deployed();
  console.log("Deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
