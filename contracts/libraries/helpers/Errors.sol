pragma solidity 0.8.4;

library Errors{
    // minting
    string public constant MINTING_MINTING_HAS_NOT_STARTED_YET = "MINTING_HAS_NOT_STARTED_YET";
    string public constant MINTING_INSUFFICIENT_FUNDS_PROVIDED = "INSUFFICIENT_FUNDS_PROVIDED";
    string public constant MINTING_TOKENS_PER_ADDRESS_CAP_REACHED = "MAXIMUM_5_NFTS_PER_ADDRESS";
    string public constant MINTING_ALL_TOKENS_MINTED = "ALL_NFTS_ARE_MINTED";
    string public constant MINTING_URI_QUERY_FOR_NON_EXISTENT_TOKEN = "ERC721_METADATA: URI_QUERY_FOR_NON_EXISTENT_TOKEN";
    // vesting
    string public constant VESTING_RECIPIENT_HAS_NOTHING_TO_CLAIM = "RECIPIENT_HAS_NOTHING_TO_CLAIM";
    string public constant VESTING_VESTING_HAS_NOT_STARTED_YET = "VESTING_HAS_NOT_STARTED_YET";
    string public constant VESTING_CANNOT_SET_0_ADDRESS_FOR_VESTING_TOKEN = "CANNOT_SET_0_ADDRESS_FOR_VESTING_TOKEN";
    // ownership
    string public constant OWNER_ONLY = "Ownable: caller is not the owner";
}