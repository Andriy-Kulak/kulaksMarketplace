var KulaksMarketplace = artifacts.require("./KulaksMarketplace.sol");

module.exports = function(deployer) {
  deployer.deploy(KulaksMarketplace);
};
