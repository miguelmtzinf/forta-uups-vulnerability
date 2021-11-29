import { Finding, FindingSeverity, FindingType } from "forta-agent";

export const UUPS_IMPLEMENTATION_UPGRADE_EVENT =
  "event Upgraded(address indexed implementation)";

export const EMPTY_CODE = "0x";

// ////////
// TESTS
// ////////

export const IMPLEMENTATION_ADDRESS_WITH_EMPTY_CODE =
  "0x0000000000000000000000000000000000000001";
export const IMPLEMENTATION_ADDRESS_WITH_CODE =
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";

export const ATTACKER_ADDRESS = "0x0000000000000000000000000000000000000002";
const NEW_IMPLEMENTATION_ADDRESS_TO_UPGRADE =
  "0x0000000000000000000000000000000000000003";

export const SAMPLE_CONTRACT_CODE = "0x6080604052348015";

// Mock event of an `Upgrade event` from a non-empty-code address
export const UPGRADE_EVENT_WITH_CODE = {
  from: ATTACKER_ADDRESS,
  address: IMPLEMENTATION_ADDRESS_WITH_CODE,
  args: {
    0: NEW_IMPLEMENTATION_ADDRESS_TO_UPGRADE,
    implementation: NEW_IMPLEMENTATION_ADDRESS_TO_UPGRADE,
  },
};

// Mock event of an `Upgrade event` from an empty-code address
export const UPGRADE_EVENT_WITH_EMPTY_CODE = {
  from: ATTACKER_ADDRESS,
  address: IMPLEMENTATION_ADDRESS_WITH_EMPTY_CODE,
  args: {
    0: NEW_IMPLEMENTATION_ADDRESS_TO_UPGRADE,
    implementation: NEW_IMPLEMENTATION_ADDRESS_TO_UPGRADE,
  },
};

// Finding  result
export const CORRECT_FINDING_RESULT = Finding.fromObject({
  name: "UUPS Proxy Bricked",
  description: `UUPS Implementation ${IMPLEMENTATION_ADDRESS_WITH_EMPTY_CODE} got selfdestructed by ${ATTACKER_ADDRESS}`,
  alertId: "UUPS_PROXY-1",
  protocol: "ethereum",
  severity: FindingSeverity.Critical,
  type: FindingType.Exploit,
  metadata: {
    attacker: ATTACKER_ADDRESS,
    contractAttacker: NEW_IMPLEMENTATION_ADDRESS_TO_UPGRADE,
  },
});
