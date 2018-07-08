pragma solidity ^0.4.17;

contract KulaksMarketplace {
  struct Product {
    uint id;
    string name;
    string description;
    uint price;
    
  }
  struct Store {
    string name;
    string storeType;
    string description;
    address owner;
    // Product[] products;
  }
  uint storedData;
  mapping(address => bool) public admins;
  mapping(address => bool) public shopOwners;
  mapping(address => Store) public stores;
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
     Store memory newStore = Store({
       name: _name,
       description: _description,
       storeType: _storeType,
       owner: msg.sender
       // products: new Product[](0)
    });
      // need to add a
     stores[msg.sender] = newStore;
    // stores.push(newStore);
  }
  
  function getStoreByOwner() public view returns(string, string, string, address) {
     return (
        stores[msg.sender].name,
        stores[msg.sender].description,
        stores[msg.sender].storeType,
        stores[msg.sender].owner
     );
  }

  function becomeAdmin() public returns (bool) {
      admins[msg.sender] = true;
  }
  
  function becomeShopOwner() public returns (bool) {
      shopOwners[msg.sender] = true;
  }
  
  
  function checkIfSenderAdmin () public view returns (bool) {
      if(admins[msg.sender] == true) {
          return true;
      } else {
          return false;
      }
  }
  
  function checkIfSenderShopOwners () public view returns (bool) {
      if(shopOwners[msg.sender] == true) {
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
