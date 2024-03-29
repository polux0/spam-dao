// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/interfaces/IERC721Enumerable.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";

import "./interfaces/ILensHub.sol";
import "./interfaces/IFollowNFT.sol";

contract SpamDAO is Governor, GovernorSettings, GovernorCountingSimple, IERC721Receiver {
    ILensHub public lensHub;

    constructor(ILensHub _lensHub)
        Governor("SpamDAO")
        GovernorSettings(
            1, /* 1 block */
            23, /* 5 minutes */
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

    // Get Quorum from Lens
    function quorum(uint256 blockNumber)
        public
        view
        override
        returns (uint256)
    {
        uint256 profileId = _getProfileId();

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
        uint256 profileId = _getProfileId();

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

    function _getProfileId() internal view returns (uint256) {
        uint256 profileId = lensHub.defaultProfile(address(this));

        if (profileId != 0) {
            return profileId;
        }

        IERC721Enumerable lensProfileToken = IERC721Enumerable(
            address(lensHub)
        );

        uint256 profileTokenId = lensProfileToken.tokenOfOwnerByIndex(
            address(this),
            0
        );

        if (profileTokenId != 0) {
            return profileTokenId;
        }

        revert("No profile set");
    }
function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
function withdraw (address recipient, uint256 amount) public {
    address payable recipient = payable(recipient);
    require(amount > address(this).balance, 'Insufficient balance');
    require(amount > 0, 'Invalid amount');
    (bool succeed, bytes memory data) = recipient.call{value: amount}("");
    require(succeed, "Failed to withdraw Ether");
}
}
