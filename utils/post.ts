import { Bytes } from "ethers";

export const Post {
    profileId: Number,
    contentURI: String,
    collectModule: Address,
    collectModuleInitData: Bytes,
    referenceModule: Address,
    referenceModuleInitData: Bytes,
}

  //   let postData =  PostData {
//     uint256 profileId;
//     string contentURI;
//     address collectModule;
//     bytes collectModuleInitData;
//     address referenceModule;
//     bytes referenceModuleInitData;
// }