# UUPSUpgradeable Vulnerability

## Description

This agent detects a [vulnerability in UUPSUpgradeable proxy](https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680) contracts.

The vulnerability lies in the `DELEGATECALL` instructions in the upgrade function, exposed by the `UUPSUpgradeable` base contract. A `DELEGATECALL` can be exploited by an attacker by having the implementation contract call into another contract that SELFDESTRUCTs itself, causing the caller to be destroyed.

## Supported Chains

- Ethereum
- List any other chains this agent can support e.g. BSC

## Alerts

Describe each of the type of alerts fired by this agent

- UUPS_PROXY-1
  - Fired when an `Upgraded` event is found and the code of the contract that emitted it is empty
  - Severity is always set to `critical` since it breaks the proxy functionality 
  - Type is always set to `exploit`
  - Additional metadata fields:
    - `attacker`: the address which performed the attack operation
    - `contractAttacker`: the address of the contract used to `selfdestruct` the implementation contract and left it without code