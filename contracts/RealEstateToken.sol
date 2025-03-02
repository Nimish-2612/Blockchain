// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateToken is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("RealEstateToken", "RET") {
        tokenCounter = 0;
    }

    /**
     * @notice Mints a new property token with a given tokenURI (metadata)
     * @param to Address that will receive the token
     * @param tokenURI URI with token metadata (e.g., IPFS link)
     */
    function mintProperty(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter++;
        return newTokenId;
    }
}
