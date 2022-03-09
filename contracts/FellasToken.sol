// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FellasToken is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    uint256 public constant totalSupply = 8000;

    Counters.Counter private _tokenIdCounter;

    mapping(string => uint8) existingURIs;
    mapping (uint256 => string) private _tokenURIs;

    constructor() ERC721("FellasToken", "FTK") {
        // Token counter starting from 1
        _tokenIdCounter.increment();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual override {
        require(_exists(tokenId), 'ERC721Metadata: URI set of nonexistent token');  // Checks if the tokenId exists

        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view override (ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId), 'ERC721Metadata: URI set of nonexistent token');  // Checks if the tokenId exists

        return _tokenURIs[tokenId];
    }

    function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    function mintMultiFellas(address recipient, string[] memory URIs, uint256 num) public payable returns (uint256[] memory) {
        require( num < 11, 'You can mint a maximum of 10' );
        require( count() + num < totalSupply, 'Exceeds maximum supply' );
        require( msg.value >= 0.0005 ether * num, 'Not enough ETH sent, check price' );

        uint256[] memory itemIds = new uint256[](num);
        for(uint256 i; i < num; i++){
            itemIds[i] = mintSingleFellas(recipient, URIs[i]);
        }

        return itemIds;
    }

    function mintSingleFellas(
        address recipient,
        string memory metadataURI
    ) public payable returns (uint256) {
        require(existingURIs[metadataURI] != 1, 'NFT already minted!');
        require (msg.value >= 0.0005 ether, 'Not enough ETH sent: check price.');
        require(count() >= 0 && count() < totalSupply, "Exceeds token supply");

        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, metadataURI);
        existingURIs[metadataURI] = 1;

        return newItemId;
    }

    function whitelistMint(
        address recipient,
        string memory metadataURI
    ) public payable returns (uint256) {
        require(existingURIs[metadataURI] != 1, 'NFT already minted!');
        require (msg.value >= 0.0001 ether, 'Not enough ETH sent: check price.');
        require (_tokenIdCounter.current() < 10, 'Whitelist mint is over!');

        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        existingURIs[metadataURI] = 1;

        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }

    function freeMint(
        address recipient,
        string memory metadataURI
    ) public returns (uint256) {
        require(existingURIs[metadataURI] != 1, 'NFT already minted!');
        require(count() >= 0 && count() <= totalSupply, "Exceeds token supply");

        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        existingURIs[metadataURI] = 1;

        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current() - 1;
    }

    function getBalance() public view returns (uint256) {
        return (address(this).balance);
    }

    function withdraw() public payable onlyOwner {
         payable(this.owner()).transfer(address(this).balance);
     }

    // function withdrawTo(address payable _to) public payable onlyOwner {
    //     _to.transfer(address(this).balance);
    // }
}
