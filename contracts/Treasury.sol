// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (finance/VestingWallet.sol)
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IERC721Minter.sol";
import "./libraries/data/Types.sol";
import "./libraries/helpers/Errors.sol";

/**
 * @title Treasury
 * @dev This contract handles the vesting of ERC20 tokens for a group of beneficiaries. Custody of multiple tokens
 * can be given to this contract, which will release the token to the beneficiary following a given vesting schedule.
 * The vesting schedule is customizable through the {vestedAmount} function.
 *
 * Any token transferred to this contract will follow the vesting schedule as if they were locked from the beginning.
 * Consequently, if the vesting has already started, any amount of tokens sent to this contract will (at least partly)
 * be immediately releasable.
 */
contract Treasury is Ownable {
    event Releasable(uint256 number);
    event ERC20Released(address indexed token, uint256 amount);
    mapping(address => uint256) public _recipientErc20Released; 

    Types.VestingPeriod[] public vestingPeriods;
    address public vestedTokenAddress;
    address erc721MinterAddress;

    /**
     * @dev Set the beneficiary, start timestamp and vesting duration of the vesting wallet.
     */
    constructor(uint256 firstVestingPeriodStart, uint256 firstVestingPeriodDuration, uint256 firstVestingPeriodAllocationPercentage, uint256 secondVestingPeriodStart, uint256 secondVestingPeriodDuration, uint256 secondVestingPeriodAllocationPercentage, address _erc721MinterAddress) {
        vestingPeriods.push(Types.VestingPeriod({
                id: 0,
                start: firstVestingPeriodStart,
                duration: firstVestingPeriodDuration,
                allocationPercentage: firstVestingPeriodAllocationPercentage
        }));
        vestingPeriods.push(Types.VestingPeriod({
                id: 1,
                start: secondVestingPeriodStart,
                duration: secondVestingPeriodDuration,
                allocationPercentage: secondVestingPeriodAllocationPercentage
        }));
        erc721MinterAddress = _erc721MinterAddress;
    }
    /**
     * @dev The contract should be able to receive Eth.
     */
    receive() external payable {}
    /**
     * @dev Set the address of token that is being vested .
     */
    function setVestedTokenAddress(address _vestedTokenAddress) public onlyOwner{
        require(_vestedTokenAddress != address(0), Errors.VESTING_CANNOT_SET_0_ADDRESS_FOR_VESTING_TOKEN);
        vestedTokenAddress = _vestedTokenAddress;
    }
    /**
     * @dev Getter for the currenly active vesting period start timestamp.
     */
    function start() public view returns (uint256) {
        return vestingPeriods[0].start;
    }
    /**
     * @dev Getter for the currently active vesting period duration.
     */
    function duration() public view returns (uint256) {
        return vestingPeriods[vestingPeriods.length-1].duration;
    }
    /**
     * @dev Currently active vesting period
     */
    function currentlyActivePeriod() public view returns (uint256 periodId){
        for(uint256 i = 0; i < vestingPeriods.length; i++){
            if (block.timestamp >= vestingPeriods[i].start && block.timestamp <= vestingPeriods[i].start + vestingPeriods[i].duration){
                return vestingPeriods[i].id;
            }
        }
    }
    /**
     * @dev Amount of recipient's tokens already released
     */
    function released(address recipient) public view virtual returns (uint256) {
        return _recipientErc20Released[recipient];
    }
    /**
     * @dev Release the tokens that have already vested.
     *
     * Emits a {TokensReleased} event.
     */
    function release() public{
        address recipient = msg.sender;
        IERC721Minter erc721Minter = IERC721Minter(erc721MinterAddress);
        uint256 totalAllocation = erc721Minter.calculateERC20Value(recipient);
        require(totalAllocation > 0, Errors.VESTING_RECIPIENT_HAS_NOTHING_TO_CLAIM);
        uint256 releasable = vestedAmount(uint64(block.timestamp), totalAllocation) - released(recipient);
        require(releasable > 0, Errors.VESTING_VESTING_HAS_NOT_STARTED_YET);
        _recipientErc20Released[recipient]+=releasable;
        SafeERC20.safeTransfer(IERC20(vestedTokenAddress), recipient, releasable);
        emit ERC20Released(vestedTokenAddress, releasable);
    }
    /**
     * @dev Calculates the amount of tokens that has already vested. Default implementation is a linear vesting curve.
     */
    function vestedAmount(uint64 timestamp, uint256 totalAllocation) public view returns (uint256) {
        return _vestingSchedule(timestamp, totalAllocation);
    }
    /**
     * @dev Virtual implementation of the vesting formula. This returns the amout vested, as a function of time, for
     * an asset given its total historical allocation.
     */
    function _vestingSchedule(uint256 timestamp, uint256 totalAllocation) public view returns (uint256) {
        if (timestamp < start()) {
            return 0;
        } else if (timestamp > vestingPeriods[vestingPeriods.length-1].start + duration()) {
            return totalAllocation;
        } else {
            uint256 totalAllocationSummation = 0;
            Types.VestingPeriod memory current = vestingPeriods[currentlyActivePeriod()];
            for(uint256 i = 0; i < current.id; i++){
                totalAllocationSummation += ( totalAllocation * vestingPeriods[i].allocationPercentage / 10000 );
            }
            uint256 percentageOfAllocation = ( totalAllocation * current.allocationPercentage ) / 10000;
            totalAllocationSummation += percentageOfAllocation * (timestamp - current.start) / current.duration;
            return totalAllocationSummation;
        }
    }
}