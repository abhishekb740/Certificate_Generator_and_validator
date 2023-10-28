//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract XRC721 is ERC721URIStorage {
    address payable creator;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Organization {
        string companyName;
        string location;
        uint256 registrationNo;
        uint256 pinCode;
        bool verified;
    }

    event OrganizationRegistered(
        string companyName,
        string location,
        uint256 registrationNo,
        uint256 pinCode
    );

    mapping(address => Organization) validOrganizations;

    constructor() ERC721("Certificates", "CER") {}

    struct ListedToken {
        uint256 tokenId;
        address payable creator;
        address payable user;
        bool ableToSell;
    }
    mapping(uint256 => ListedToken) idToListedToken;

    function registerOrganization(
        string memory _companyName,
        string memory _location,
        uint256 _registrationNo,
        uint256 _pinCode
    ) public {
        require(
            !validOrganizations[msg.sender].verified,
            "organization is Already Registered"
        );
        validOrganizations[msg.sender] = Organization({
            companyName: _companyName,
            location: _location,
            registrationNo: _registrationNo,
            pinCode: _pinCode,
            verified: true
        });
        emit OrganizationRegistered(
            _companyName,
            _location,
            _registrationNo,
            _pinCode
        );
    }

    function isOrganizationVerified() public view returns (bool) {
        return validOrganizations[msg.sender].verified;
    }

    //for organisation side
    //get information about certificate by entering tokenId
    function getListedForTokenId(
        uint256 tokenId
    ) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    // return current token id
    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    //this function create the NFT when organisation click on button
    function createToken(
        string memory tokenURI,
        address receiver
    ) public payable returns (uint256) {
        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();
        _safeMint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, tokenURI);

        createListedToken(currentTokenId, receiver);

        return currentTokenId;
    }

    // set the information about certificate and transfer certificate to user
    function createListedToken(uint256 tokenId, address receiver) private {
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(msg.sender),
            payable(receiver),
            false
        );

        _transfer(msg.sender, receiver, tokenId);
    }

    // return array of all the certificate created by organisation
    function getOrganisationCertificates(
        address org
    ) public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (org == idToListedToken[i + 1].creator) itemCount++;
        }

        ListedToken[] memory items = new ListedToken[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (org == idToListedToken[i + 1].creator) {
                uint currentId = i + 1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    //For user side
    //Return array of all the certificates owned by User
    function getUserCertificates(
        address user
    ) public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (user == idToListedToken[i + 1].user) itemCount++;
        }

        ListedToken[] memory items = new ListedToken[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (user == idToListedToken[i + 1].user) {
                uint currentId = i + 1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }
}
