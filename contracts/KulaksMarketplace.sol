pragma solidity ^0.4.17;

contract KulaksMarketplace {
  struct Product {
    uint id;
    string name;
    string description;
    uint price;
    uint storeId;
    
  }
  struct PurchaseTransaction {
      address purchasedBy;
      uint[] products;
      uint subtotal;
      uint shippingAndHandling;
      uint totalCost;
  }
  struct Store {
    uint id;
    string name;
    string storeType;
    string description;
    address owner;
  }
  
  constructor () public payable {
      storeCount = 1;
      productCount = 1;
      transactionCount = 1;
      user = msg.sender;
  }
  address public user; // the address that instantiated the contract
  uint productCount;
  uint storedData;
  uint storeCount;
  uint transactionCount;
  mapping(address => bool) public admins; // enter an address to confirm if it's an admin
  mapping(address => bool) public shopOwners; // enter an address to confirm if it's an shopOwner
  mapping(uint => Store) public stores; // enter storeId to get info about the store
  mapping(address => uint[]) public storeIds; // enter an address to get an array of creates stores for the particular shopOwner
  mapping(uint => uint[]) public productIds; // enter a storeId to get an array of created products for the particular store
  address[] private storeOwners;
  mapping(uint => Product) public products;
  
  modifier shopOwnerOnly() {
    require(shopOwners[msg.sender] == true);
    _;
  }
  
  modifier adminOnly() {
    require(shopOwners[msg.sender] == true);
    _;
  }
  
  
  function createStore(string _name, string _storeType, string _description) public {
     uint id = storeCount;
     
     Store memory newStore = Store({
       id: id,
       name: _name,
       description: _description,
       storeType: _storeType,
       owner: msg.sender
     });

      // need to add a
     stores[id] = newStore;
     
     // push the storeId to a storeIds mapping for reference
     storeIds[msg.sender].push(id);
     // increment counter by 1 since you are using it for id's for stores as well
    storeCount++;
  }
  
  
  function createProduct(uint _storeId, string _name, string _description, uint _price) public {
     uint id = productCount;
     
     Product memory newProduct = Product({
       id: id,
       storeId: _storeId,
       name: _name,
       description: _description,
       price: _price
     });
     
     products[id] = newProduct; // adding a product to storeProducts mapping
     productIds[_storeId].push(id); // pushing the product id to be refernced in the store struct
     productCount ++;
    
  }
  
  function doesOwnerHaveShops () public view returns(bool, uint) {
      if(storeIds[msg.sender].length > 0) {
          return(true,  storeIds[msg.sender].length);
      } else {
          return(false, 0);
      }
  }
  
  function doesStoreHaveProducts (uint storeId) public view returns(bool, uint) {
      if(productIds[storeId].length > 0) {
          return(true,  productIds[storeId].length);
      } else {
          return(false, 0);
      }
  }
  
  function getShopIdByOrder (uint order) public view returns(bool, uint) {
      if(storeIds[msg.sender][order] > 0) {
          return(true, storeIds[msg.sender][order]);
     } else {
        return(false, 0);
     }
  }
  
  function getProductIdByOrder (uint _storeId, uint _order) public view returns(bool, uint) {
      if(productIds[_storeId][_order] > 0) {
          return(true, productIds[_storeId][_order]);
     } else {
        return(false, 0);
     }
  }

  function sendValueTest(address userAddress) public payable {
      userAddress.transfer(1 ether);
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
