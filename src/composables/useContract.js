import { ref } from 'vue'
import { ethers } from 'ethers'
import { useWallet } from './useWallet'

const CONTRACT_CONFIGS = {
  84532: {
    address: '0x580766a5F69DcdAc5422c3dDAC977D11b3e65c49',
    abi: [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "auditor",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "name": "AuditorStatusChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "contractAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "riskScore",
            "type": "uint256"
          }
        ],
        "name": "ReportSubmitted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "contractAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "name": "ReportVerified",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_auditor",
            "type": "address"
          }
        ],
        "name": "addAuditor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "auditors",
        "outputs": [
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "reportsSubmitted",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reputation",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "contractReports",
        "outputs": [
          {
            "internalType": "address",
            "name": "contractAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "riskScore",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "auditor",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isVerified",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_auditor",
            "type": "address"
          }
        ],
        "name": "getAuditorDetails",
        "outputs": [
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "reportsSubmitted",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "reputation",
                "type": "uint256"
              }
            ],
            "internalType": "struct BugHuntr.Auditor",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          }
        ],
        "name": "getReports",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "contractAddress",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "ipfsHash",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "riskScore",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "auditor",
                "type": "address"
              },
              {
                "internalType": "bool",
                "name": "isVerified",
                "type": "bool"
              }
            ],
            "internalType": "struct BugHuntr.Report[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "minReputationThreshold",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_auditor",
            "type": "address"
          }
        ],
        "name": "removeAuditor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "reportCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "reportHashes",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_ipfsHash",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_riskScore",
            "type": "uint256"
          }
        ],
        "name": "submitReport",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_auditor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_newReputation",
            "type": "uint256"
          }
        ],
        "name": "updateAuditorReputation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_newThreshold",
            "type": "uint256"
          }
        ],
        "name": "updateMinReputationThreshold",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_reportIndex",
            "type": "uint256"
          }
        ],
        "name": "verifyReport",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  },
  97: {
    address: '0xe4B0D5ee6C298B202e2B74CFc5275358A379A5C1',
    abi: [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "auditor",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "name": "AuditorStatusChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "contractAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "riskScore",
            "type": "uint256"
          }
        ],
        "name": "ReportSubmitted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "contractAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "name": "ReportVerified",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_auditor",
            "type": "address"
          }
        ],
        "name": "addAuditor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "auditors",
        "outputs": [
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "reportsSubmitted",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reputation",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "contractReports",
        "outputs": [
          {
            "internalType": "address",
            "name": "contractAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "riskScore",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "auditor",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isVerified",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_auditor",
            "type": "address"
          }
        ],
        "name": "getAuditorDetails",
        "outputs": [
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "reportsSubmitted",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "reputation",
                "type": "uint256"
              }
            ],
            "internalType": "struct BugHuntr.Auditor",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          }
        ],
        "name": "getReports",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "contractAddress",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "ipfsHash",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "riskScore",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "auditor",
                "type": "address"
              },
              {
                "internalType": "bool",
                "name": "isVerified",
                "type": "bool"
              }
            ],
            "internalType": "struct BugHuntr.Report[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "minReputationThreshold",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_auditor",
            "type": "address"
          }
        ],
        "name": "removeAuditor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "reportCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "reportHashes",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_ipfsHash",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_riskScore",
            "type": "uint256"
          }
        ],
        "name": "submitReport",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_auditor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_newReputation",
            "type": "uint256"
          }
        ],
        "name": "updateAuditorReputation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_newThreshold",
            "type": "uint256"
          }
        ],
        "name": "updateMinReputationThreshold",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_reportIndex",
            "type": "uint256"
          }
        ],
        "name": "verifyReport",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  },
  1287: {
    address: '0x4174C72de549c9482170aDFea4c655738323DA74', // Moonbase
    abi: [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "auditor",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "name": "AuditorStatusChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "contractAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "riskScore",
            "type": "uint256"
          }
        ],
        "name": "ReportSubmitted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "contractAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "name": "ReportVerified",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_auditor",
            "type": "address"
          }
        ],
        "name": "addAuditor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "auditors",
        "outputs": [
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "reportsSubmitted",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reputation",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "contractReports",
        "outputs": [
          {
            "internalType": "address",
            "name": "contractAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "riskScore",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "auditor",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isVerified",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_auditor",
            "type": "address"
          }
        ],
        "name": "getAuditorDetails",
        "outputs": [
          {
            "components": [
              {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "reportsSubmitted",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "reputation",
                "type": "uint256"
              }
            ],
            "internalType": "struct BugHuntr.Auditor",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          }
        ],
        "name": "getReports",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "contractAddress",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "ipfsHash",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "riskScore",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "auditor",
                "type": "address"
              },
              {
                "internalType": "bool",
                "name": "isVerified",
                "type": "bool"
              }
            ],
            "internalType": "struct BugHuntr.Report[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "minReputationThreshold",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_auditor",
            "type": "address"
          }
        ],
        "name": "removeAuditor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "reportCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "reportHashes",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_ipfsHash",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_riskScore",
            "type": "uint256"
          }
        ],
        "name": "submitReport",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_auditor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_newReputation",
            "type": "uint256"
          }
        ],
        "name": "updateAuditorReputation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_newThreshold",
            "type": "uint256"
          }
        ],
        "name": "updateMinReputationThreshold",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_reportIndex",
            "type": "uint256"
          }
        ],
        "name": "verifyReport",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  },
}

export function useContract() {
  const { provider, address, isConnected, isCorrectChain } = useWallet()
  const contract = ref(null)
  const isLoading = ref(false)
  const error = ref('')
  const txHash = ref('')

  async function getContract() {
    if (!window.ethereum) {
      throw new Error('No wallet detected')
    }

    if (!isConnected.value) {
      throw new Error('Wallet not connected')
    }

    const supportedChains = [84532, 97, 1287]
    if (!supportedChains.includes(chainId.value)) {
      throw new Error('Please switch to Base Sepolia or BSC Testnet or Moonbase Alpha')
    }

    const currentConfig = CONTRACT_CONFIGS[chainId.value]
    if (!currentConfig) {
      throw new Error('Unsupported network')
    }

    try {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum)
      const signer = await ethersProvider.getSigner()
      contract.value = new ethers.Contract(
        currentConfig.address, 
        currentConfig.abi,  
        signer
      )
      return contract.value
    } catch (err) {
      console.error('Error initializing contract:', err)
      throw new Error('Failed to initialize contract')
    }
  }

  async function submitReport({ contractAddress, riskScore, issues, suggestions }) {
    isLoading.value = true
    error.value = ''
    txHash.value = ''

    try {
      const contract = await getContract()

      // Create report data
      const reportData = {
        timestamp: Date.now(),
        contractAddress,
        riskScore,
        issues,
        suggestions,
        auditor: address.value
      }

      // Generate IPFS-like hash (mock for now)
      const ipfsHash = 'Qm' + Math.random().toString(36).substring(2, 15)

      try {
        // Estimate gas
        const gasEstimate = await contract.submitReport.estimateGas(
          contractAddress,
          ipfsHash,
          riskScore
        )

        // Add 20% buffer to gas estimate using BigInt math
        const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100)

        // Submit to blockchain
        const tx = await contract.submitReport(
          contractAddress,
          ipfsHash,
          riskScore,
          { gasLimit }
        )

        txHash.value = tx.hash

        // Wait for transaction confirmation
        const receipt = await tx.wait()

        return {
          success: true,
          receipt,
          reportData
        }
      } catch (gasError) {
        // If gas estimation fails, try without gas limit
        console.warn('Gas estimation failed, trying without gas limit:', gasError)

        const tx = await contract.submitReport(
          contractAddress,
          ipfsHash,
          riskScore
        )

        txHash.value = tx.hash

        const receipt = await tx.wait()

        return {
          success: true,
          receipt,
          reportData
        }
      }

    } catch (err) {
      console.error('Error submitting report:', err)
      error.value = err.message || 'Failed to submit report'
      return {
        success: false,
        error: err.message
      }
    } finally {
      isLoading.value = false
    }
  }

  // Rest of your existing functions remain the same...
  async function getReports(contractAddress) {
    error.value = ''

    try {
      const contract = await getContract()
      const reports = await contract.getReports(contractAddress)

      // Format the reports data
      return reports.map(report => ({
        contractAddress: report.contractAddress,
        ipfsHash: report.ipfsHash,
        riskScore: Number(report.riskScore),
        timestamp: Number(report.timestamp),
        auditor: report.auditor,
        isVerified: report.isVerified
      }))

    } catch (err) {
      console.error('Error getting reports:', err)
      error.value = err.message || 'Failed to fetch reports'
      throw err
    }
  }

  async function getAuditorDetails(auditorAddress) {
    error.value = ''

    try {
      const contract = await getContract()
      const details = await contract.getAuditorDetails(auditorAddress || address.value)

      return {
        isActive: details.isActive,
        reportsSubmitted: Number(details.reportsSubmitted),
        reputation: Number(details.reputation)
      }
    } catch (err) {
      console.error('Error getting auditor details:', err)
      error.value = err.message || 'Failed to fetch auditor details'
      throw err
    }
  }

  async function verifyReport(contractAddress, reportIndex) {
    isLoading.value = true
    error.value = ''
    txHash.value = ''

    try {
      const contract = await getContract()

      // Estimate gas
      const gasEstimate = await contract.verifyReport.estimateGas(
        contractAddress,
        reportIndex
      )
      const gasLimit = gasEstimate.mul(120).div(100)

      const tx = await contract.verifyReport(
        contractAddress,
        reportIndex,
        { gasLimit }
      )

      txHash.value = tx.hash
      const receipt = await tx.wait()

      return {
        success: true,
        receipt
      }

    } catch (err) {
      console.error('Error verifying report:', err)
      error.value = err.message || 'Failed to verify report'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function addAuditor(auditorAddress) {
    isLoading.value = true
    error.value = ''
    txHash.value = ''

    try {
      const contract = await getContract()
      const tx = await contract.addAuditor(auditorAddress)
      txHash.value = tx.hash
      await tx.wait()
      return true
    } catch (err) {
      console.error('Error adding auditor:', err)
      error.value = err.message || 'Failed to add auditor'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateAuditorReputation(auditorAddress, newReputation) {
    isLoading.value = true
    error.value = ''
    txHash.value = ''

    try {
      const contract = await getContract()
      const tx = await contract.updateAuditorReputation(auditorAddress, newReputation)
      txHash.value = tx.hash
      await tx.wait()
      return true
    } catch (err) {
      console.error('Error updating reputation:', err)
      error.value = err.message || 'Failed to update reputation'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    submitReport,
    getReports,
    getAuditorDetails,
    verifyReport,
    addAuditor,
    updateAuditorReputation,
    isLoading,
    error,
    txHash
  }
}