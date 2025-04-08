// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RealEstateToken
 * @dev A simple ERC721 contract for real estate property tokenization
 */
contract RealEstateToken is ERC721URIStorage, Ownable {
    uint256 private _tokenCounter;

    
    mapping(uint256 => string) private _propertyURIs;

    event PropertyMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("RealEstateToken", "RET") {
        _tokenCounter = 0;
    }

    /**
     * @notice Mints a new property NFT with a metadata URI
     * @param to The recipient address
     * @param tokenURI Metadata URI (IPFS or centralized server link)
     * @return tokenId The ID of the newly minted token
     */
    function mintProperty(address to, string memory tokenURI) external onlyOwner returns (uint256 tokenId) {
        tokenId = _tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        _propertyURIs[tokenId] = tokenURI;
        emit PropertyMinted(to, tokenId, tokenURI);

        _tokenCounter++;
    }

    /**
     * @notice Returns the total number of tokens minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenCounter;
    }

    /**
     * @notice Returns the token URI for a given tokenId
     */
    function getPropertyURI(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _propertyURIs[tokenId];
    }
}
