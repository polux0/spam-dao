// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts@4.5.0/governance/Governor.sol";
import "@openzeppelin/contracts@4.5.0/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts@4.5.0/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts@4.5.0/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts@4.5.0/governance/extensions/GovernorVotesQuorumFraction.sol";

contract MyGovernor is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotesQuorumFraction {
    constructor(IVotes _token)
        Governor("MyGovernor")
        GovernorSettings(1 /* 1 block */, 273 /* 1 hour */, 0)
        GovernorVotesQuorumFraction(4)
    {}

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
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotes)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
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