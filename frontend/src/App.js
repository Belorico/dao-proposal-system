import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DAOProposalSystem from './artifacts/contracts/DAOProposalSystem.sol/DAOProposalSystem.json';

const daoProposalSystemAddress = 'DEPLOYED_CONTRACT_ADDRESS';

function App() {
  const [proposals, setProposals] = useState([]);
  const [description, setDescription] = useState('');
  const [proposalId, setProposalId] = useState('');
  const [support, setSupport] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchProposals() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(daoProposalSystemAddress, DAOProposalSystem.abi, provider);
      // Implement logic to fetch proposals
    }
  }

  async function createProposal() {
    if (!description) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(daoProposalSystemAddress, DAOProposalSystem.abi, signer);
      const transaction = await contract.createProposal(description);
      await transaction.wait();
      fetchProposals();
    }
  }

  async function voteOnProposal() {
    if (!proposalId) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(daoProposalSystemAddress, DAOProposalSystem.abi, signer);
      const transaction = await contract.vote(proposalId, support);
      await transaction.wait();
      fetchProposals();
    }
  }

  return (
    <div>
      <h1>DAO Proposal System</h1>
      <div>
        <h2>Create a new proposal</h2>
        <input onChange={e => setDescription(e.target.value)} placeholder="Proposal Description" />
        <button onClick={createProposal}>Create Proposal</button>
      </div>
      <div>
        <h2>Vote on a proposal</h2>
        <input onChange={e => setProposalId(e.target.value)} placeholder="Proposal ID" />
        <label>
          <input type="radio" checked={support} onChange={() => setSupport(true)} /> Support
        </label>
        <label>
          <input type="radio" checked={!support} onChange={() => setSupport(false)} /> Oppose
        </label>
        <button onClick={voteOnProposal}>Vote</button>
      </div>
      <div>
        <h2>Proposals</h2>
        {/* Implement display of proposals */}
      </div>
    </div>
  );
}

export default App;
