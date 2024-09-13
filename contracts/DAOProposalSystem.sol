// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DAOProposalSystem {
    struct Proposal {
        uint256 id;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 endTime;
        bool executed;
        address proposer;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    modifier onlyActiveProposal(uint256 _proposalId) {
        require(block.timestamp < proposals[_proposalId].endTime, "Proposal has ended");
        _;
    }

    modifier proposalExists(uint256 _proposalId) {
        require(proposals[_proposalId].id != 0, "Proposal does not exist");
        _;
    }

    modifier proposalNotExecuted(uint256 _proposalId) {
        require(!proposals[_proposalId].executed, "Proposal already executed");
        _;
    }

    event ProposalCreated(uint256 id, string description, address proposer);
    event VoteCast(address voter, uint256 proposalId, bool support);
    event ProposalExecuted(uint256 proposalId, bool passed);

    // Create a new proposal
    function createProposal(string memory _description) external {
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            endTime: block.timestamp + 5 minutes,
            executed: false,
            proposer: msg.sender
        });

        emit ProposalCreated(proposalCount, _description, msg.sender);
    }

    // Vote on a proposal
    function vote(uint256 _proposalId, bool _support) 
        external 
        proposalExists(_proposalId) 
        onlyActiveProposal(_proposalId) 
    {
        require(!hasVoted[_proposalId][msg.sender], "You already voted");
        hasVoted[_proposalId][msg.sender] = true;

        if (_support) {
            proposals[_proposalId].votesFor++;
        } else {
            proposals[_proposalId].votesAgainst++;
        }

        emit VoteCast(msg.sender, _proposalId, _support);
    }

    // Execute the proposal once the voting period is over
    function executeProposal(uint256 _proposalId) 
        external 
        proposalExists(_proposalId) 
        proposalNotExecuted(_proposalId) 
    {
        require(block.timestamp >= proposals[_proposalId].endTime, "Voting period is not over");

        Proposal storage proposal = proposals[_proposalId];
        proposal.executed = true;

        bool passed = proposal.votesFor > proposal.votesAgainst;
        emit ProposalExecuted(_proposalId, passed);
    }

    // Get details of a proposal
    function getProposal(uint256 _proposalId) 
        external 
        view 
        returns (string memory description, uint256 votesFor, uint256 votesAgainst, uint256 endTime, bool executed)
    {
        Proposal memory proposal = proposals[_proposalId];
        return (proposal.description, proposal.votesFor, proposal.votesAgainst, proposal.endTime, proposal.executed);
    }
}
