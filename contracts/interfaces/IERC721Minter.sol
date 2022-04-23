pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IERC721Minter is IERC721{

    function getTierPrice(uint256 tier) external returns (uint256);
    function getTierERC20Price(uint256 tier) external returns (uint256);
    function calculateERC20Value(address owner) external returns (uint256);
    function mint(address recipient, uint256 tier, string memory metadata) payable external returns (uint256);
}