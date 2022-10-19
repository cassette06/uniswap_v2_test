// imports
const { ethers, run, network, hre } = require("hardhat");
const { getNamedAccounts } = require("hardhat-deploy");
const { ModuleResolutionKind } = require("typescript");
require("dotenv").config();
//工厂合约部署
async function factory_deploy(singner) {
  const UniswapV2FactoryFactory = await ethers.getContractFactory(
    "UniswapV2Factory",
    singner
  );
  console.log("Deploying contract...");
  const feetoSetter = "0x57e9a63bDC406E47c37451cF52Abb5038e4dE665"; //平台收取的手续费流向
  const syn_contract = await UniswapV2FactoryFactory.deploy(feetoSetter);
  await syn_contract.deployed();
  console.log(`Deployed contract to: ${syn_contract.address}`);
  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await syn_contract.deployTransaction.wait(6);
    // await verify(syn_contract.address, [feetoSetter]);
    //之所以注释掉是由于一直timeout所以放弃了，采用的方法可以是npx hardhat flatten contracts/UniswapV2Factory.sol > source.txt
  }
  return syn_contract;
}
//路由合约部署
async function router_deploy(singner) {
  const UniswapV2RouterFactory = await ethers.getContractFactory(
    "UniswapV2Router02",
    singner
  );
  console.log("Deploying contract...");
  const factoryAddress = "0x713bf2f97E99AB5DC44ee45697Ac4e7Ef40c0847"; //工厂合约地址
  const wethAddress = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"; //WETH合约地址
  const syn_contract = await UniswapV2RouterFactory.deploy(
    factoryAddress,
    wethAddress
  );
  await syn_contract.deployed();
  console.log(`Deployed router contract to: ${syn_contract.address}`);
  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await syn_contract.deployTransaction.wait(6);
  }
  return syn_contract;
}
//caterc20部署
async function token_cat_deploy(singner) {
  const TokenCatFactory = await ethers.getContractFactory("TokenCat", singner);
  console.log("Deploying contract...");

  const syn_contract = await TokenCatFactory.deploy();
  await syn_contract.deployed();
  console.log(`Deployed token cat contract to: ${syn_contract.address}`);
  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await syn_contract.deployTransaction.wait(6);
  }
  return syn_contract;
}
//dogerc20部署
async function token_dog_deploy(singner) {
  const TokenDogFactory = await ethers.getContractFactory("TokenDog", singner);
  console.log("Deploying contract...");

  const syn_contract = await TokenDogFactory.deploy();
  await syn_contract.deployed();
  console.log(`Deployed token dog contract to: ${syn_contract.address}`);
  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await syn_contract.deployTransaction.wait(6);
  }
  return syn_contract;
}
//exampleOracle部署

async function example_oracle_deploy(
  singner,
  factory_address,
  token_a_address,
  token_b_address
) {
  const OracleFactory = await ethers.getContractFactory(
    "ExampleOracleSimple",
    singner
  );
  console.log("Deploying contract...");

  const syn_contract = await OracleFactory.deploy(
    factory_address,
    token_a_address,
    token_b_address
  );
  await syn_contract.deployed();
  console.log(`Deployed oracle contract to: ${syn_contract.address}`);
  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await syn_contract.deployTransaction.wait(6);
  }
  return syn_contract;
}
//slideOracle部署

async function slide_oracle_deploy(
  singner,
  factory_address,
  window_size,
  granularity
) {
  const SlideFactory = await ethers.getContractFactory(
    "ExampleSlidingWindowOracle",
    singner
  );
  console.log("Deploying contract...");

  const syn_contract = await SlideFactory.deploy(
    factory_address,
    window_size,
    granularity
  );
  await syn_contract.deployed();
  console.log(`Deployed slide oracle contract to: ${syn_contract.address}`);
  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await syn_contract.deployTransaction.wait(6);
  }
  return syn_contract;
}
//swaptoprice部署

async function swaptoprice_deploy(singner, factory_address, router_address) {
  const swaptopriceFactory = await ethers.getContractFactory(
    "ExampleSwapToPrice",
    singner
  );
  console.log("Deploying contract...");

  const syn_contract = await swaptopriceFactory.deploy(
    factory_address,
    router_address
  );
  await syn_contract.deployed();
  console.log(`Deployed swaptoprice contract to: ${syn_contract.address}`);
  // what happens when we deploy to our hardhat network?
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await syn_contract.deployTransaction.wait(6);
  }
  return syn_contract;
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
};

module.exports = {
  factory_deploy,
  router_deploy,
  token_cat_deploy,
  token_dog_deploy,
  example_oracle_deploy,
  slide_oracle_deploy,
  swaptoprice_deploy,
};
