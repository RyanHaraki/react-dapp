import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";

// Contract address logged from CLI
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const tokenAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

function App() {
  // Store greeting in state
  const [greeting, setGreetingValue] = useState("");
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();

  // Request access to MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // Call smart contract and get current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      // Log the current greeting value to the console
      try {
        const data = await contract.greet();
        console.log("Data: ", data);
      } catch (error) {
        console.error("error: ", error);
      }
    }
  }

  // Call smart contract and send update
  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    }
  }

  // SEND TOKEN CONTRACTS

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log(`Balance: ${balance.toString()}`);
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} tokens succesfully sent to ${userAccount}`);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
        />
        <br />

        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coin</button>
        <input
          onChange={(e) => setUserAccount(e.target.value)}
          placeholder="User Account"
        />
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
      </header>
    </div>
  );
}

export default App;
