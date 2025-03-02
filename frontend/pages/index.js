import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { properties } from "../mockProperties"; // or inline data

export default function Home() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);

  // If you're using environment variables, otherwise hardcode your address
  const [contractAddress, setContractAddress] = useState(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""
  );
  const [message, setMessage] = useState("");

  // Minimal ABI example: add buyTokens if your contract has it
  const contractABI = [
    "function buyTokens(uint256 propertyId, uint256 numberOfTokens) public payable returns (bool)",
    // or "function mintProperty(address to, string memory tokenURI) public returns (uint256)"
    // depending on your actual contract
  ];

  // Connect wallet using Web3Modal
  async function connectWallet() {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      if (contractAddress) {
        const realEstateContract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(realEstateContract);
      } else {
        console.error("Contract address is empty or undefined.");
      }
    } catch (error) {
      if (error.message.includes("User Rejected")) {
        alert("Connection request was rejected. Please try again.");
      } else {
        console.error("Error connecting wallet:", error);
        alert("An error occurred while connecting your wallet.");
      }
    }
  }

  // Buy tokens for a property
  async function buyPropertyTokens(propertyId, numberOfTokens) {
    if (!contract) {
      alert("Contract is not set. Please connect your wallet first.");
      return;
    }
    try {
      setMessage(`Purchasing ${numberOfTokens} tokens for Property ID ${propertyId}...`);
      
      // If your contract requires payment, you'll need to pass value in the transaction:
      // For example, if 1 token = 0.01 ETH, then 10 tokens = 0.1 ETH
      // const pricePerToken = ethers.utils.parseEther("0.01");
      // const totalPrice = pricePerToken.mul(numberOfTokens);

      const transaction = await contract.buyTokens(propertyId, numberOfTokens /*, {
        value: totalPrice
      }*/);

      await transaction.wait();
      setMessage(`Successfully purchased ${numberOfTokens} tokens for Property #${propertyId}.`);
    } catch (error) {
      console.error("Error buying tokens:", error);
      setMessage("Error buying tokens. Check console for details.");
    }
  }

  // Render each property in a grid
  function renderProperties() {
    return properties.map((property) => (
      <div key={property.id} style={styles.card}>
        <img src={property.image} alt={property.name} style={styles.image} />
        <h3>{property.name}</h3>
        <p>{property.description}</p>
        {/* For demo, we hardcode numberOfTokens = 10 */}
        <button onClick={() => buyPropertyTokens(property.id, 10)}>Buy 10 Tokens</button>
      </div>
    ));
  }

  return (
    <div style={styles.container}>
      <h1>Real Estate Tokenization dApp</h1>
      {account ? (
        <p>Connected as: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}

      <div style={styles.grid}>
        {renderProperties()}
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}

// Basic inline styles for demo
const styles = {
  container: {
    padding: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
    marginTop: "2rem",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1rem",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "auto",
    marginBottom: "1rem",
  },
};
