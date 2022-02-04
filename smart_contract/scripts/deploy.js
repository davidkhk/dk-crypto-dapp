const main = async () => {
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  // Transactions is like a function factory, or a class, that will generate instances of that specific contract. 
  const transactions = await Transactions.deploy();
  // This is one specific instance of the contract.

  await transactions.deployed();

  console.log("Transactions deployed to: ", transactions.address);
}
// When we run the script our transactions will be deployed so we get the address of our smart contract deployed on the blockchain network.
// For our contract to be deployed we need to have ETH on our wallet already for what we call gas fees.
// Gas fees are small fractions of ETH used to make something happen.

const runMain = async () => {
  //async/await funtions is another way to write .then/.catch methods. 
  try {
    await main();
    //This above will execute and deploy our smart contract.
    process.exit(0);
    // This means that the process went succesfully.
  } catch (error) {
    console.error(error);
    process.exit(1);
    // This means that there was an error.
  }
}

runMain();
// When executing this Deploy.js file, this line 24 will be executed first, which will call the runMain function.
// Then it'll call the main function which is responsible for deploying the contract.