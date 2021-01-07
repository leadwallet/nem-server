const { default: nem } = require("nem-sdk");

const environment = process.env.NODE_ENV || "development";

const networks = {
 development: "mainnet",
 production: "mainnet"
};

const nodes = {
 development: nem.model.nodes.defaultMainnet,
 production: nem.model.nodes.defaultMainnet
};

// const ports = {
//  development: 7778,
//  production: 7778
// };

const network = networks[environment] || "testnet";
const node = nodes[environment]
const port = 7890;

module.exports.generateAddress = function () {
 const randomBytes = nem.crypto.nacl.randomBytes(32);
 const randomHex = nem.utils.convert.ua2hex(randomBytes);
 const keyPair = nem.crypto.keyPair.create(randomHex);
 const networkId = nem.model.network.data[network].id;
 const address = nem.model.address.toAddress(
  keyPair.publicKey.toString(),
  networkId
 );
 return Promise.resolve({
  address,
  privateKey: randomHex
 });
};

module.exports.getAddressDetails = async function (address) {
 const endpoint = nem.model.objects.create("endpoint")(node, port);
 const account = await nem.com.requests.account.data(endpoint, address);
 return { balance: account.account.balance / 10 ** 6 };
};
