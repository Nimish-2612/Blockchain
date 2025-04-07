import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { properties } from "../mockProperties"; // Updated with image URLs
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "");
  const [message, setMessage] = useState("");

  const contractABI = [
    "function buyTokens(uint256 propertyId, uint256 numberOfTokens) public payable returns (bool)",
  ];

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
        toast.success("Wallet connected!");
      }
    } catch (error) {
      toast.error("Wallet connection failed.");
    }
  }

  async function buyPropertyTokens(propertyId, numberOfTokens) {
    if (!contract) {
      toast.error("Connect your wallet first.");
      return;
    }
    try {
      toast.loading(`Purchasing ${numberOfTokens} tokens for Property #${propertyId}...`, {
        id: "txn-toast",
      });
      const transaction = await contract.buyTokens(propertyId, numberOfTokens);
      await transaction.wait();
      toast.success(`Successfully bought ${numberOfTokens} tokens for Property #${propertyId}.`, {
        id: "txn-toast",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Transaction failed.", {
        id: "txn-toast",
      });
    }
  }

  function renderProperties() {
    return properties.map((property) => (
      <div key={property.id} style={styles.card}>
        <div style={styles.imageWrapper}>
          <Image
            src={property.image}
            alt={property.name}
            layout="fill"
            objectFit="cover"
            style={{ borderRadius: "12px" }}
          />
        </div>
        <h3 style={styles.title}>{property.name}</h3>
        <p style={styles.description}>{property.description}</p>
        <button style={styles.button} onClick={() => buyPropertyTokens(property.id, 10)}>
          Buy 10 Tokens
        </button>
      </div>
    ));
  }

  return (
    <div style={styles.body}>
      <Toaster position="top-right" />
      <h1 style={styles.header}>Real Estate Tokenization DApp</h1>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        {account ? (
          <p style={styles.account}>Connected: {account}</p>
        ) : (
          <button style={styles.button} onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>

      <div style={styles.grid}>{renderProperties()}</div>
    </div>
  );
}

const styles = {
  body: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #101820)",
    color: "#ffffff",
    padding: "2rem",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    textAlign: "center",
    fontSize: "2.5rem",
    background: "linear-gradient(to right, #00e0ff, #ff00d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    justifyContent: "center",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "1rem",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "180px",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  description: {
    fontSize: "0.9rem",
    color: "#ccc",
    textAlign: "center",
    marginBottom: "1rem",
  },
  button: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#00e0ff",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
  account: {
    fontSize: "1rem",
    color: "#9efeff",
  },
  message: {
    marginTop: "2rem",
    textAlign: "center",
    color: "#00e0ff",
  },
};
