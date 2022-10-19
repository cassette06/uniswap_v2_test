// imports
const { ethers, run, network, hre } = require("hardhat");

const { getNamedAccounts } = require("hardhat-deploy");
const { isReturnStatement } = require("typescript");
require("dotenv").config();
const { BigNumber } = require("ethers");
const deployfun = require("./deploy");
const abifile = require("./contractabi");
// require("@nomiclabs/hardhat-ethers");

// const provider = new ethers.providers.JsonRpcProvider(
//   process.env.GOERLI_RPC_URL
// );
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
//setup part

async function main() {
  const wallet = await setup();
  const provider = new ethers.providers.JsonRpcProvider(
    "https://goerli.infura.io/v3/554b1ce24e674c4caf976b65eb2cc52c"
  );
  /*
  //deploy tokencat
  const tokencat_contract = await deployfun.token_cat_deploy(wallet);
  //tokenCat合约地址:0xF282eE8EC1565bA6410356a370802aCf060b461E

  //deploy tokendog
  const tokendog_contract = await deployfun.token_dog_deploy(wallet);
  //tokenDog合约地址:0xdC0eE72fE978E0Db8e5361De8125b83C30249e0d
  //deploy factory_part
  const factory_contract = await deployfun.factory_deploy(wallet);
  //工厂合约地址：0x713bf2f97E99AB5DC44ee45697Ac4e7Ef40c0847

  //deploy router_part
  const router_contract = await deployfun.router_deploy(wallet);
  //router合约地址：0x456a897f0e03Fe180920Aa76DADb2a24BD226aC9
*/
  //获取router合约
  const router_contract = await getRouterContract(wallet);
  console.log(await router_contract.factory());
  //往cat-dog pool里添加流动性
  const factory_address = "0x713bf2f97E99AB5DC44ee45697Ac4e7Ef40c0847";
  const token_cat_address = "0xF282eE8EC1565bA6410356a370802aCf060b461E";
  const token_dog_address = "0xdC0eE72fE978E0Db8e5361De8125b83C30249e0d";

  const add_liquidity_tx_request = {
    gasLimit: 9999999,
    // value: BigNumber.from(10).pow(17),
    gasPrice: (await provider.getGasPrice()).mul(6),
  };

  let amountCatDesired = BigNumber.from(10).pow(18);
  let amountDogDesired = BigNumber.from(2).mul(10).pow(18);
  let amountCatMin = 0;
  let amountDogMin = 0;
  let to = await wallet.getAddress();
  const deadline = 1667140456; // "2022-10-30 22:34:16"
  console.log("++++");
  // const add_liquidity_tx_receipt = await add_liquidity(
  //   router_contract,
  //   token_cat_address,
  //   token_dog_address,
  //   amountCatDesired,

  //   amountDogDesired,
  //   amountCatMin,
  //   amountDogMin,
  //   to,
  //   deadline,
  //   add_liquidity_tx_request
  // );
  // console.log(add_liquidity_tx_receipt);

  //部署exampleonoraclesimple合约
  //deploy oracle
  // const oracle_contract = await deployfun.example_oracle_deploy(
  //   wallet,
  //   factory_address,
  //   token_cat_address,
  //   token_dog_address
  // );
  //oracle合约地址：0x4f2D189303AC4D2D153247eBBCcd42cDA68446e2
  //获取oracle合约
  const oracle_contract = await getOracleContract(wallet);
  const oracleUpdateResponse = await oracle_contract.update();
  await oracleUpdateResponse.wait(6);
  const amountOutConsult = await oracle_contract.consult(
    token_dog_address,
    20000
  );
  console.log(amountOutConsult);
  //部署slide oracle合约
  // let window_size = 1800; //30分钟
  // let granularity = 3; //每十分钟一次更新
  // const slide_contract = await deployfun.slide_oracle_deploy(
  //   wallet,
  //   factory_address,
  //   window_size,
  //   granularity
  // );
  //获取slide oracle合约
  const slide_contract = await getSlideOracleContract(wallet);
  // const oracleUpdateResponse = await slide_contract.update(
  //   token_cat_address,
  //   token_dog_address
  // );
  // await oracleUpdateResponse.wait(6);
  // const amountOutConsult = await slide_contract.consult(
  //   token_dog_address,
  //   20000,
  //   token_cat_address
  // );
  // console.log(amountOutConsult);
  //部署swaptoprice合约
  // let router_address = "0x456a897f0e03Fe180920Aa76DADb2a24BD226aC9";
  // const swaptoprice_contract = await deployfun.swaptoprice_deploy(
  //   wallet,
  //   factory_address,
  //   router_address
  // );
  //swaptoprice合约地址：0x6d5E036365584c63E0Cb29e26221A6C38832c235
  //获取swaptoprice合约
  const swaptoprice_contract = await getSwaptopriceContract(wallet);

  // const swaptoprice_response = await swaptoprice_contract.swapToPrice(
  //   token_cat_address,
  //   token_dog_address,
  //   1,
  //   4,
  //   BigNumber.from(2).mul(10).pow(18),
  //   BigNumber.from(2).mul(10).pow(18),
  //   wallet.address,
  //   deadline
  // );
  // await swaptoprice_response.wait(2);
}

//添加流动性
async function add_liquidity(
  router_contract,
  token_A_address,
  token_B_address,
  amountADesired,
  amountBDesired,
  amountAMin,
  amountBMin,
  to,
  deadline,
  tx_request
) {
  const tx = await router_contract.addLiquidity(
    token_A_address,
    token_B_address,
    amountADesired,
    amountBDesired,
    amountAMin,
    amountBMin,
    to,
    deadline,
    tx_request
  );
  const receipt = await tx.wait(1);
  // console.log(receipt)

  // console.log(receipt.events)

  return receipt;
}

//获取Router合约
async function getRouterContract(wallet) {
  let contract_address = "0x456a897f0e03Fe180920Aa76DADb2a24BD226aC9";
  let router_contract = new ethers.Contract(
    contract_address,
    abifile.routerabi,
    wallet //signer
  );
  // router_contract.connect(wallet)
  return router_contract;
}
//获取oracle合约
async function getOracleContract(wallet) {
  let contract_address = "0x4f2D189303AC4D2D153247eBBCcd42cDA68446e2";
  let oracle_contract = new ethers.Contract(
    contract_address,
    abifile.oracleabi,
    wallet //signer
  );
  // router_contract.connect(wallet)
  return oracle_contract;
}
//获取slide oracle合约
async function getSlideOracleContract(wallet) {
  let contract_address = "0xF74C852600893899a9959673c6d7fb208104eb7a";
  let slide_contract = new ethers.Contract(
    contract_address,
    abifile.slideabi,
    wallet //signer
  );
  // router_contract.connect(wallet)
  return slide_contract;
}
//获取 swaptoprice合约
async function getSwaptopriceContract(wallet) {
  let contract_address = "0x6d5E036365584c63E0Cb29e26221A6C38832c235";
  let swaptoprice_contract = new ethers.Contract(
    contract_address,
    abifile.swaptopriceabi,
    wallet //signer
  );
  // router_contract.connect(wallet)
  return swaptoprice_contract;
}

//   let contract_address = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
//   let contract_abi = UniswapV2Router02_abi
//   let router_contract = new ethers.Contract(
//       contract_address,
//       contract_abi,
//       wallet //signer
//   )
//   // router_contract.connect(wallet)
//   return router_contract

async function setup() {
  //goerli测试网，走这个
  if (network.config.chainId === 5) {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://goerli.infura.io/v3/554b1ce24e674c4caf976b65eb2cc52c"
    );
    // console.log(provider);
    const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    return deployer;
  } else {
    //set up，本地测试网
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];
    const anotherUser = accounts[1];
    return deployer;
  }
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//logs bloom是由topic生成
//data是64位16进制
//地址是20个字节，topic是32个字节，topic也是64位的16进制
//topic0 是event_name
//A bloom-filter, which includes all the addresses and topics included in any log in this transaction.
//logsbloom含有2048个字节from a block
