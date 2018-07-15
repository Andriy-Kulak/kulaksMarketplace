pragma solidity ^0.4.17;

contract KulaksMarketplace {
  struct Product {
    uint id;
    string name;
    string description;
    uint price;
    
  }
  struct Store {
    uint id;
    string name;
    string storeType;
    string description;
    address owner;
    // Product[] products;
  }
  
  constructor () public payable {
      storeCount = 1;
  }
  uint storedData;
  uint storeCount;
  mapping(address => bool) public admins;
  mapping(address => bool) public shopOwners;
  mapping(uint => Store) public stores;
  mapping(address => uint[]) public storeIds;
  address[] private storeOwners;
  
  modifier shopOwnerOnly() {
    require(shopOwners[msg.sender] == true);
    _;
  }
  
  modifier adminOnly() {
    require(shopOwners[msg.sender] == true);
    _;
  }
  
  
  function createStore(string _name, string _storeType, string _description) public shopOwnerOnly {
     uint id = storeCount;
     Store memory newStore = Store({
       id: id,
       name: _name,
       description: _description,
       storeType: _storeType,
       owner: msg.sender
       // products: new Product[](0)
    });

      // need to add a
     stores[id] = newStore;
     
     storeIds[msg.sender].push(id);
     // increment counter by 1 since you are using it for id's for stores as well
    storeCount++;
    // stores.push(newStore);
  }
  
  function doesUserHaveStores () public view returns(bool, uint) {
      if(storeIds[msg.sender].length > 0) {
          return(true,  storeIds[msg.sender].length);
      } else {
          return(false, 0);
      }
  }
  
  function getStoreIdByOrder (uint id) public view returns(bool, uint) {
      if(storeIds[msg.sender][id] > 0) {
          return(true, storeIds[msg.sender][id]);
      } else {
          return(false, 0);
      }
  }
  
  function getStoreInfo (uint id) public view returns(string, string, string, address) {
      return(
        stores[id].name,
        stores[id].description,
        stores[id].storeType,
        stores[id].owner
      );
  }
  
  // function getStoreByOwner() public view returns(string, string, string, address) {
  function getStoreByOwner(uint id) public view returns(string, string, string, address) {
     return (
        stores[id].name,
        stores[id].description,
        stores[id].storeType,
        stores[id].owner
     );
  }
  
  function sendValueTest(address userAddress) public payable {
      userAddress.transfer(1 ether);
  }
  
  function testSender () public view returns (address) {
      return msg.sender;
  }
  
  
  function testBalance () public view returns (uint) {
      return this.balance;
  }

  function becomeAdmin(address adminAddress) public returns (bool) {
      admins[adminAddress] = true;
  }
  
  function becomeShopOwner(address ownerAddress) public returns (bool) {
      shopOwners[ownerAddress] = true;
  }
  
  
  function checkIfUserAdmin (address checkAddress) public view returns (bool) {
      if(admins[checkAddress] == true) {
          return true;
      } else {
          return false;
      }
  }
  
  function checkIfUserShopOwner (address checkAddress) public view returns (bool) {
      if(shopOwners[checkAddress] == true) {
          return true;
      } else {
          return false;
      }
  }
  
  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
