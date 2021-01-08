const router = require("express").Router();
const ops = require("./ops");

router.get("/account/generate", async (req, res) => {
 try {
  const account = await ops.generateAddress();
  // console.log(JSON.stringify(account));
  return res.status(201).json({ ...account });
 } catch (error) {
  return res.status(500).send(error.message);
 }
});

router.get("/account/balance", async (req, res) => {
 try {
  const obj = await ops.getAddressDetails(req.query.address);
  return res.status(200).json({ ...obj });
 } catch (error) {
  // console.log(error);
  return res.status(500).send(error.message);
 }
});

router.post("/tx", async (req, res) => {
 try {
  const tx = await ops.sendToken(req.query.pk, req.query.to, req.body.value);
  return res.status(200).json({ ...tx });
 } catch (error) {
  return res.status(500).send(error.message);
 }
});

router.get("/txs", async (req, res) => {
 try {
  const txs = await ops.getTxs(req.query.address);
  return res.status(200).json({ ...txs });
 } catch (error) {
  return res.status(500).send(error.message);
 }
});

module.exports = router;
