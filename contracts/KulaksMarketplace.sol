pragma solidity ^0.4.17;

contract KulaksMarketplace {
  struct Product {
    uint id;
    string name;
    string description;
    uint price;
    uint shopId;
    
  }
  struct Shop {
    uint id;
    string name;
    string shopType;
    string description;
    address owner;
  }
  
  constructor () public payable {
      shopCount = 1;
      productCount = 1;
      transactionCount = 1;
      creator = msg.sender;
  }
  address public creator; // the address that instantiated the contract
  uint productCount;
  uint storedData;
  uint shopCount;
  uint transactionCount;
  uint shippingAndHandling = 20;
  mapping(uint => uint) public shopBalances;
  // mapping(address => bool) public admins; // enter an address to confirm if it's an admin
  // mapping(address => bool) public shopOwners; // enter an address to confirm if it's an shopOwner
  mapping(uint => Shop) public shops; // enter shopId to get info about the store
  mapping(address => uint[]) public shopIds; // enter an address to get an array of creates shops for the particular shopOwner
  mapping(uint => uint[]) public productIds; // enter a productId to get an array of created products for the particular shop
  mapping(uint => Product) public products;
  address[] public usersList;
  uint[] public shopsList;
  mapping(address => string) public users;
  
  modifier shopOwnerOnly() {
    require(keccak256(abi.encodePacked(users[msg.sender])) == keccak256(abi.encodePacked("owner")));
    _;
  }
  
  modifier adminOnly() {
    require(keccak256(abi.encodePacked(users[msg.sender])) == keccak256(abi.encodePacked("admin")));
    _;
  }
  
  // check if user already exists within users mapping
  function checkUserListExist (address _addr) public view returns(bool) {
      if(
          keccak256(abi.encodePacked(users[_addr])) == keccak256(abi.encodePacked("admin")) ||
          keccak256(abi.encodePacked(users[_addr])) == keccak256(abi.encodePacked("owner")) ||
          keccak256(abi.encodePacked(users[_addr])) == keccak256(abi.encodePacked("user"))
      ) {
          return true;
      }
      
      return false;
  }
  
  function makeShopOwner(address _addr) public {
    if(checkUserListExist(_addr) == false) {
         usersList.push(_addr);
    }
    users[_addr] = "owner";
     
  }
  
  function makeAdmin(address _addr) public {
    if(checkUserListExist(_addr) == false) {
        usersList.push(_addr);
    }
    users[_addr] = "admin";
     
  }
  
  function makeUser(address _addr) public {
    if(checkUserListExist(_addr) == false) {
        usersList.push(_addr);
    }
    users[_addr] = "user";
     
  }
  
  // get length of userList so we can itterate over it and get all users visible by admin
  function getUsersListLength() public view returns(uint) {
     return usersList.length;
  }
  
  // get length of shopsList so we can itterate over it and get all shops visible to user
  function getShopsListLength() public view returns(uint) {
     return shopsList.length;
  }
  
  function createShop(string _name, string _shopType, string _description) public {
     uint id = shopCount;
     
     Shop memory newShop = Shop({
       id: id,
       name: _name,
       description: _description,
       shopType: _shopType,
       owner: msg.sender
     });

      // add a shop to shops mapping and reference by id
     shops[id] = newShop;
     
     // push the shopId to a shopIds mapping for reference
     shopIds[msg.sender].push(id);
     // increment counter by 1 since you are using it for id's for shops as well
     
     shopsList.push(id); // push shopId to shopList so we can display all shops to user
    shopCount++;
  }
  
  
  function createProduct(uint _shopId, string _name, string _description, uint _price) public {
     uint id = productCount;
     
     Product memory newProduct = Product({
       id: id,
       shopId: _shopId,
       name: _name,
       description: _description,
       price: _price
     });
     
     products[id] = newProduct; // adding a product to shopProducts mapping
     productIds[_shopId].push(id); // pushing the product id to be refernced in the store struct
     productCount ++;
    
  }
  
  function purchaseProduct(uint _productId, uint quantity) public payable  {
      // require for value of transaction to be of the right amount
     require(msg.value == products[_productId].price * quantity + shippingAndHandling);
      // keeping track of balance of a shop. shop owner can then send that value to their account
     shopBalances[products[_productId].shopId] += msg.value;
     // return products[_productId].price * quantity + shippingAndHandling;
  }
  
  function moveShopBalanceToOwner (uint _shopId) public payable {
      shops[_shopId].owner.transfer(shopBalances[_shopId]);
      shopBalances[_shopId] = 0; // after the money has been transfered over, make balance 0 again
  }

  function doesOwnerHaveShops () public view returns(bool, uint) {
      if(shopIds[msg.sender].length > 0) {
          return(true,  shopIds[msg.sender].length);
      } else {
          return(false, 0);
      }
  }
  
  function doesShopHaveProducts (uint shopId) public view returns(bool, uint) {
      if(productIds[shopId].length > 0) {
          return(true,  productIds[shopId].length);
      } else {
          return(false, 0);
      }
  }
  
  function testBalance () public view returns (uint) {
      return this.balance;
  }

  function becomeAdmin() public returns (bool) {
      users[msg.sender] = "admin";
  }
  
  function becomeRegularUser() public returns (bool) {
      users[msg.sender] = "shopper";
  }
  
  function becomeShopOwner() public returns (bool) {
      users[msg.sender] = "owner";
  }
  
  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
