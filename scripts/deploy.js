async function main() {
  const DAOProposalSystem = await ethers.getContractFactory("DAOProposalSystem");
  const daoProposalSystem = await DAOProposalSystem.deploy();

  await daoProposalSystem.deployed();
  console.log("DAO Proposal System deployed to:", daoProposalSystem.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
