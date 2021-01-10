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
const node = nodes[environment];
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
 return Promise.resolve({ balance: account.account.balance / 10 ** 6 });
};

module.exports.sendToken = async function (pk, to, value) {
 const endpoint = nem.model.objects.create("endpoint")(node, port);
 const networkId = nem.model.network.data[network].id;
 const common = nem.model.objects.create("common")("", pk);
 const tx = nem.model.objects.create("transferTransaction")(
  to,
  value * 10 ** 6,
  "Txn from Leadwallet: " + Date.now()
 );
 const preparedTx = nem.model.transactions.prepare("transferTransaction")(
  common,
  tx,
  networkId
 );
 const sentTx = await nem.model.transactions.send(common, preparedTx, endpoint);
 return Promise.resolve({
  hash: sentTx.transactionHash.data
 });
};

module.exports.getTxs = async function (address) {
 const endpoint = nem.model.objects.create("endpoint")(node, port);
 const allTxMetadataPair = await nem.com.requests.account.transactions.all(
  endpoint,
  address
 );
 console.log(allTxMetadataPair);
 const unconfirmedTxMetadatapair = await nem.com.requests.account.transactions.unconfirmed(
  endpoint,
  address
 );
 console.log(unconfirmedTxMetadataPair);
 const allTxMapped = allTxMetadataPair.map((tx) => ({
  hash: tx.meta.hash.data,
  date: new Date(tx.transaction.timeStamp),
  amount:
   address.toLowerCase() === tx.transaction.recipient.toLowerCase()
    ? "+" + tx.transaction.amount / 10 ** 6
    : "-" + tx.transaction.amount / 10 ** 6,
  to: tx.transaction.recipient,
  from: address,
  fee: tx.transaction.fee / 10 ** 6,
  status: "Confirmed"
 }));
 const unconfirmedMapped = unconfirmedTxMetadatapair.map((tx) => ({
  hash: tx.meta.data,
  date: new Date(tx.transaction.timeStamp),
  amount:
   address.toLowerCase() === tx.transaction.recipient.toLowerCase()
    ? "+" + tx.transaction.amount / 10 ** 6
    : "-" + tx.transaction.amount / 10 ** 6,
  to: tx.transaction.recipient,
  from: address,
  fee: tx.transaction.fee / 10 ** 6,
  status: "Pending"
 }));
 const concatenated = [...allTxMapped].concat(unconfirmedMapped);
 return Promise.resolve({
  txns: concatenated
 });
};
