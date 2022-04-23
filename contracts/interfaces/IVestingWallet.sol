// pragma solidity 0.8.4;

// import "../utils/VestingPeriod.sol";

// interface IVestingWallet{
//     function setVestedTokenAddress(address _token) external;
//     // was before
//     // reason same as ^
//     // function start() external view returns (uint256);
//     function start() external returns (uint256);
//     function duration() external view returns (uint256);
//     // was before
//     // function currentlyActivePeriod() external view returns (VestingPeriod memory);
//     // is now because I added event for debugging;
//     function currentlyActivePeriod() external returns (VestingPeriod memory);
//     // was before
//     // reason same as ^
//     // function released(address recipient) external view returns (uint256);
//     function released(address recipient) external returns (uint256);

//     function getRecipientReleasedForCurrentPeriod(address recipient, uint256 periodId) external returns (uint256);
//     function release(address recipient, uint256 totalAllocation) external;
//     // was before
//     // reason same as ^
//     // function vestedAmount(uint64 timestamp, address recipient,uint256 totalAllocation) external view returns (uint256);
//     function vestedAmount(uint64 timestamp, address recipient,uint256 totalAllocation) external returns (uint256);
//     // was before
//     // reason same as ^
//     // function _vestingSchedule(uint256 totalAllocation, uint64 timestamp) external view returns (uint256);
//     function _vestingSchedule(uint256 totalAllocation, uint64 timestamp) external returns (uint256);

// }