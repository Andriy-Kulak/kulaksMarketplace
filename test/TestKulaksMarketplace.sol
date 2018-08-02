pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import { KulaksMarketplace } from  "../contracts/KulaksMarketplace.sol";

contract TestKulaksMarketplace {

    function testItStoresAValue() public {
        KulaksMarketplace kulaksMarketplace = KulaksMarketplace(DeployedAddresses.KulaksMarketplace());

        kulaksMarketplace.set(89);

        // uint expected = 89;

        Assert.equal(kulaksMarketplace.get(), 89, "It should store the value 89.");
    }
}
