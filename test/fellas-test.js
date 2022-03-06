const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FellasToken", function () {

  it("Should mint if balance is enough and transfer an NFT to someone", async function () {
    const FellasToken = await ethers.getContractFactory("FellasToken");
    const fellasToken = await FellasToken.deploy();
    await fellasToken.deployed();

    const recipient = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    let metadataURI = 'cid/test.png';

    // Verify recipient owns 0 tokens
    let balance = await fellasToken.balanceOf(recipient);
    expect(balance).to.equal(0);

    // Mint 1st token to the recipient
    let newlyMintedToken = await fellasToken.mintaUnPo(recipient, metadataURI, { value: ethers.utils.parseEther('0.0005') });
    await newlyMintedToken.wait();

    // Verify there is 1 token minted
    expect(await fellasToken.count()).to.equal(1);

    // Veirify recipient owns 1 token
    balance = await fellasToken.balanceOf(recipient);
    expect(balance).to.equal(1);

    // Verify token URI was correctly assigned
    expect(await fellasToken.tokenURI(1)).to.equal(metadataURI);

    // Mint 2nd token to the recipient
    metadataURI = 'cid/test2.png';
    newlyMintedToken = await fellasToken.mintaUnPo(recipient, metadataURI, { value: ethers.utils.parseEther('0.0005') });
    await newlyMintedToken.wait();

    // Verify there are 2 tokens minted
    expect(await fellasToken.count()).to.equal(2);

    // Veirify recipient owns 2 tokens
    balance = await fellasToken.balanceOf(recipient);
    expect(balance).to.equal(2);

    // Verify token URI was correctly assigned
    expect(await fellasToken.tokenURI(2)).to.equal(metadataURI);
  });

  it("Should whitelist mint if balance is enough and transfer an NFT to recipient", async function () {
    const FellasToken = await ethers.getContractFactory("FellasToken");
    const fellasToken = await FellasToken.deploy();
    await fellasToken.deployed();

    const recipient = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    let metadataURI = 'cid/test.png';

    // Verify recipient owns 0 tokens
    let balance = await fellasToken.balanceOf(recipient);
    expect(balance).to.equal(0);

    // Mint 1st token to the recipient
    let newlyMintedToken = await fellasToken.whitelistMint(recipient, metadataURI, { value: ethers.utils.parseEther('0.0001') });
    await newlyMintedToken.wait();

    // Verify there is 1 token minted
    expect(await fellasToken.count()).to.equal(1);

    // Veirify recipient owns 1 token
    balance = await fellasToken.balanceOf(recipient);
    expect(balance).to.equal(1);

    // Verify token URI was correctly assigned
    expect(await fellasToken.tokenURI(1)).to.equal(metadataURI);
  });

  it("Should free mint if recipient is VIP and transfer an NFT to recipient", async function () {
    const FellasToken = await ethers.getContractFactory("FellasToken");
    const fellasToken = await FellasToken.deploy();
    await fellasToken.deployed();

    const recipientVIP = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    let metadataURI = 'cid/test.png';

    // Verify recipient owns 0 tokens
    let balance = await fellasToken.balanceOf(recipientVIP);
    expect(balance).to.equal(0);

    // Mint 1st token to the recipient
    let newlyMintedToken = await fellasToken.freeMint(recipientVIP, metadataURI);
    await newlyMintedToken.wait();

    // Verify there is 1 token minted
    expect(await fellasToken.count()).to.equal(1);

    // Veirify recipient owns 1 token
    balance = await fellasToken.balanceOf(recipientVIP);
    expect(balance).to.equal(1);

    // Verify token URI was correctly assigned
    expect(await fellasToken.tokenURI(1)).to.equal(metadataURI);
  });
});