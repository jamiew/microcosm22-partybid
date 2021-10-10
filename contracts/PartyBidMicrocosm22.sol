// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IPartyBid.sol";

contract PartyBidMicrocosm22 is ERC721URIStorage, Ownable {
  uint256 public tokenCounter;
  string public internalTokenURI;

  IPartyBid public deadToken;

  mapping(address => bool) public minted;

  constructor(string memory _tokenURI, address _deadAddress)
    ERC721("PartyBid Microcosm #22", "PBMC#22")
  {
    tokenCounter = 0;
    internalTokenURI = _tokenURI;
    deadToken = IPartyBid(_deadAddress);
  }

  function mintCollectible() public {
    require(deadToken.totalContributed(msg.sender) > 0, "Owner didn't contribute to the PartyBid");
    require(minted[msg.sender] == false, "NFT already minted");
    minted[msg.sender] = true;

    uint256 newTokenId = tokenCounter;
    tokenCounter = tokenCounter + 1;
    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, internalTokenURI);
  }

  function hasBalance() public view returns (bool) {
    return deadToken.totalContributed(msg.sender) > 0;
  }
}
