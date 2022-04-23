pragma solidity 0.8.4;

library Types{
    struct VestingPeriod {
        uint256 id;
        uint256 start;
        uint256 duration;
        // if there are several vesting periods we could always pass total allocation and multiply it with @allocationPercentage in order to get exact amount for particular period.
        uint256 allocationPercentage;
    }
}