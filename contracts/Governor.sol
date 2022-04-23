// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "./interfaces/ILensHub.sol";
import "./interfaces/IFollowNFT.sol";

contract MyGovernor is Governor, GovernorSettings, GovernorCountingSimple {
    ILensHub public lensHub;

    constructor(ILensHub _lensHub)
        Governor("MyGovernor")
        GovernorSettings(
            1, /* 1 block */
            273, /* 1 hour */
            0
        )
    {
        lensHub = _lensHub;
    }

    // The following functions are overrides required by Solidity.

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override
        returns (uint256)
    {
        uint256 profileId = lensHub.defaultProfile(address(this));
        require(profileId != 0, "No default profile set");

        address followNFTAddress = lensHub.getFollowNFT(profileId);
        require(followNFTAddress != address(0), "No followers yet");

        IFollowNFT followNFT = IFollowNFT(followNFTAddress);

        return
            (followNFT.getDelegatedSupplyByBlockNumber(blockNumber) * 4) / 100;
    }

    // Get Voting Power from Lens
    function getVotes(address account, uint256 blockNumber)
        public
        view
        override
        returns (uint256)
    {
        uint256 profileId = lensHub.defaultProfile(address(this));
        require(profileId != 0, "No default profile set");

        address followNFTAddress = lensHub.getFollowNFT(profileId);
        require(followNFTAddress != address(0), "No followers yet");

        IFollowNFT followNFT = IFollowNFT(followNFTAddress);

        return followNFT.getPowerByBlockNumber(account, blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
}
