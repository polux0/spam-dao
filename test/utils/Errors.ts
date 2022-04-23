export enum Erc20Errors {
    ApproveOwnerZeroAddress = "Erc20__ApproveOwnerZeroAddress",
    ApproveSpenderZeroAddress = "Erc20__ApproveSpenderZeroAddress",
    BurnZeroAddress = "Erc20__BurnZeroAddress",
    InsufficientAllowance = "Erc20__InsufficientAllowance",
    InsufficientBalance = "Erc20__InsufficientBalance",
    MintZeroAddress = "Erc20__MintZeroAddress",
    TransferRecipientZeroAddress = "Erc20__TransferRecipientZeroAddress",
    TransferSenderZeroAddress = "Erc20__TransferSenderZeroAddress",
  }
  export enum Erc20PermitErrors {
    InvalidSignature = "InvalidSignature",
    OwnerZeroAddress = "OwnerZeroAddress",
    PermitExpired = "PermitExpired",
    RecoveredOwnerZeroAddress = "RecoveredOwnerZeroAddress",
    SpenderZeroAddress = "SpenderZeroAddress",
  }
  
  export enum Erc20RecoverErrors {
    NonRecoverableToken = "NonRecoverableToken",
    RecoverZero = "RecoverZero",
  }
  
  export enum Erc721MintingErrors {
    MintingHasNotStartedYet = "MINTING_HAS_NOT_STARTED_YET",
    InsufficientFundsProvided = "INSUFFICIENT_FUNDS_PROVIDED",
    TokensPerAddressCapReached = "MAXIMUM_5_NFTS_PER_ADDRESS",
    AllTokensMinted = "ALL_NFTS_ARE_MINTED",
    UriQueryForNonExistentToken = "ERC721_METADATA: URI_QUERY_FOR_NON_EXISTENT_TOKEN"
  }
  export enum VestingErrors {
    RecipientHasNothingToClaim = "RECIPIENT_HAS_NOTHING_TO_CLAIM",
    VestingHasNotStartedYet = "VESTING_HAS_NOT_STARTED_YET",
    VestedTokenIsZeroAddress = "CANNOT_SET_0_ADDRESS_FOR_VESTING_TOKEN"
  }
  
  export enum OwnableErrors {
    NotOwner = "Ownable: caller is not the owner",
  }
  
  export enum PanicCodes {
    ArithmeticOverflowOrUnderflow = "0x11",
  }