pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./libraries/helpers/Errors.sol";

contract ERC721Minter is ERC721URIStorage, ERC721Enumerable, Ownable{

    using Counters for Counters.Counter;
    // uint256 constant public priceTier1 = 0.01 ether;
    uint256 constant public priceTier1 = 750 ether;
    uint256 constant public erc20PriceTier1 = 1 ether;
    uint256 constant public capTier1 = 200;
    string baseURI;
    string baseExtension = ".json";
    // string currentMetadata = "https://ipfs.io/ipfs/QmehUeWdGzgn3vdb5fdCye2C1jtNsxhe7gHW94PKrJBGkP";
    string revealedURI;
    bool isRevealed = false;
    uint256 public start;
    Counters.Counter private _tokenIds;
    // tier should be 0x1 & 0x2 ( optimisation )
    mapping (address => Counters.Counter) addressPurchases;
    event MetadataUpdated(uint256 index, string previous, string current);
    // should add name & symbol here
    constructor(uint256 _start, string memory _baseUri, string memory name, string memory symbol) public ERC721(name, symbol){
        start = _start;
        setBaseURI(_baseUri);
    }
    // tier should be 0x1 & 0x2 ( optimisation )
    function mint(address recipient, uint256 amount) payable public{
        require(block.timestamp > start, Errors.MINTING_MINTING_HAS_NOT_STARTED_YET);
        require(msg.value >= priceTier1 * amount, Errors.MINTING_INSUFFICIENT_FUNDS_PROVIDED);
        require(addressPurchases[recipient].current() < 5, Errors.MINTING_TOKENS_PER_ADDRESS_CAP_REACHED);
        for(uint256 i = 0; i < amount; i++){
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            require(newItemId <= capTier1, Errors.MINTING_ALL_TOKENS_MINTED);
            _mint(recipient, newItemId);
            _setTokenURI(newItemId, string(abi.encodePacked(_baseURI(), Strings.toString(newItemId), baseExtension)));
            addressPurchases[recipient].increment();
        }
    }
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
    function reveal() public onlyOwner {
        isRevealed = true;
    }
    function setRevealedURI(string memory _newRevealedURI) public onlyOwner {
        revealedURI = _newRevealedURI;
    }
    function _revealedURI() internal view returns (string memory){
        return revealedURI;
    }
    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override (ERC721, ERC721Enumerable){
        super._beforeTokenTransfer(from, to, tokenId);
    }
    function supportsInterface(bytes4 interfaceId) public view override (ERC721, ERC721Enumerable) returns (bool){
        return super.supportsInterface(interfaceId);
    }
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    function tokenURI(uint256 tokenId) public view virtual override (ERC721, ERC721URIStorage) returns (string memory){
        require(_exists(tokenId), Errors.MINTING_URI_QUERY_FOR_NON_EXISTENT_TOKEN);
            string memory currentBaseURI = _baseURI();
            return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, Strings.toString(tokenId), baseExtension))
            : "";
    }
    function calculateERC20Value(address owner) public returns (uint256){
        uint256 limit = balanceOf(owner);
        uint256 value = limit * erc20PriceTier1;
        return value;
    }
    function withdraw() public {
    address payable recipient = payable(0x0b84E291D41F66Bc96563456fB471C5e9A3d12F1);
    (bool succeed, bytes memory data) = recipient.call{value: address(this).balance}("");
    require(succeed, "Failed to withdraw Ether");
}
}