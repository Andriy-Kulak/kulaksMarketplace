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
      creator = msg.sender;
  }
  address public creator; // the address that instantiated the contract
  uint productCount; // used to create id's for products
  uint storedData; // AK_REMOE
  uint shopCount; // used to create id's for shops
  uint shippingAndHandling = 20; // s&h charge (in wei)
  mapping(uint => uint) public shopBalances; // used to keep track of all balances
  // mapping(address => bool) public admins; // enter an address to confirm if it's an admin
  // mapping(address => bool) public shopOwners; // enter an address to confirm if it's an shopOwner
  mapping(uint => Shop) public shops; // enter shopId to get info about the store
  mapping(address => uint[]) public shopIds; // enter an address to get an array of creates shops for the particular shopOwner
  mapping(uint => uint[]) public productIds; // enter a productId to get an array of created products for the particular shop
  mapping(uint => Product) public products; // used to keep track of all products
  address[] public usersList; // list of users used to display on admin page
  uint[] public shopsList; // list of shops used to display on shopper's home page
  mapping(address => string) public users; // used to keep track of all users
  
  // for shop owner users only
  modifier shopOwnerOnly() {
    require(bytes(users[msg.sender]).length > 0);
    require(keccak256(abi.encodePacked(users[msg.sender])) == keccak256(abi.encodePacked("owner")));
    _;
  }
  
  // for admin users only
  modifier adminOnly() {
    require(bytes(users[msg.sender]).length > 0);
    require(keccak256(abi.encodePacked(users[msg.sender])) == keccak256(abi.encodePacked("admin")));
    _;
  }
  
  // only owner of the specific shop can execute this call
  modifier ownerOfSpecificShopOnly(uint _shopId) {
       // making sure shopId exists within shops
    require((shops[_shopId].id) > 0);
     // making sure the person that is trying to change something within shop is the owner
    require((shops[_shopId].owner) == msg.sender);
    // making sure msg.sender exists within users mapping
    require(bytes(users[msg.sender]).length > 0);
    require(keccak256(abi.encodePacked(users[msg.sender])) == keccak256(abi.encodePacked("owner")));
    
    
    _;
  }
  
  // check if user already exists within users mapping
  function checkUserListExist (address _addr) private view returns(bool) {
      if(
          keccak256(abi.encodePacked(users[_addr])) == keccak256(abi.encodePacked("admin")) ||
          keccak256(abi.encodePacked(users[_addr])) == keccak256(abi.encodePacked("owner")) ||
          keccak256(abi.encodePacked(users[_addr])) == keccak256(abi.encodePacked("user"))
      ) {
          return true;
      }
      
      return false;
  }

  // to be removed - AK_REMOVE
  function test123(uint _shopId) public view returns(uint256) {
      return (shops[_shopId].id);
  }
  
  // used by admin to create a regular an owner of a shop
  function makeShopOwner(address _addr) adminOnly public {
    if(checkUserListExist(_addr) == false) {
         usersList.push(_addr);
    }
    users[_addr] = "owner";
     
  }
  
  // used by admin to create another admin
  function makeAdmin(address _addr) adminOnly public {
    if(checkUserListExist(_addr) == false) {
        usersList.push(_addr);
    }
    users[_addr] = "admin";
     
  }
  
  // used by admin to create a regular user/shopper
  function makeShopper(address _addr) adminOnly public {
    if(checkUserListExist(_addr) == false) {
        usersList.push(_addr);
    }
    users[_addr] = "shopper";
     
  }
  
  // get length of userList so we can itterate over it and get all users visible by admin
  function getUsersListLength() public view returns(uint) {
     return usersList.length;
  }
  
  // get length of shopsList so we can itterate over it and get all shops visible to user
  function getShopsListLength() public view returns(uint) {
     return shopsList.length;
  }
  
  // creating a shop (by shop owner only)
  function createShop(string _name, string _shopType, string _description) shopOwnerOnly public {
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
  
  // creating a product (by shop owner only)
  function createProduct(uint _shopId, string _name, string _description, uint _price) ownerOfSpecificShopOnly(_shopId) public {
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
  
  // moving shop eth balance to the shop owner account (by shop owner only)
  function moveShopBalanceToOwner (uint _shopId) public ownerOfSpecificShopOnly(_shopId) payable {
      shops[_shopId].owner.transfer(shopBalances[_shopId]);
      shopBalances[_shopId] = 0; // after the money has been transfered over, make balance 0 again
  }

  // check if shop owner has shops
  function doesOwnerHaveShops () public view shopOwnerOnly returns(bool, uint) {
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
  
  // to be removed - AK_REMOVE
  function testBalance () public view returns (uint) {
      return this.balance;
  }

  // for testing purposes only. any user can make themselves admin
  // so that they can test all the functionality
  function becomeAdmin() public returns (bool) {
      users[msg.sender] = "admin";
  }
  
  // for testing purposes only. any user can make themselves a shopper
  // so that they can test all the functionality
  function becomeRegularUser() public returns (bool) {
      users[msg.sender] = "shopper";
  }
  
  // for testing purposes only. any user can make themselves shop owner
  // so that they can test all the functionality
  function becomeShopOwner() public returns (bool) {
      users[msg.sender] = "owner";
  }
  
  // to be removed - AK_REMOVE
  function set(uint x) public {
    storedData = x;
  }

  // to be removed - AK_REMOVE
  function get() public view returns (uint) {
    return storedData;
  }
}
