import {
  Finding,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";
import { EMPTY_CODE, UUPS_IMPLEMENTATION_UPGRADE_EVENT } from "./constants";

async function handleTransaction(
  txEvent: TransactionEvent,
  getCode: (address: string) => Promise<string>
) {
  const findings: Finding[] = [];

  // if no events found for upgrading UUPS contracts, return
  const upgradeEvents = txEvent.filterLog(UUPS_IMPLEMENTATION_UPGRADE_EVENT);
  if (!upgradeEvents.length) return findings;

  // fetch code of new implementation contracts
  const reducer = (accumulator: any, element: any) => [
    ...accumulator,
    element.address,
  ];
  const reducedUpgradeEvents = upgradeEvents.reduce(reducer, []);
  const promises = reducedUpgradeEvents.map((item) => getCode(item));
  const upgradeCodes = await Promise.all(promises);

  // determine if current code is empty
  upgradeCodes.map((code, index) => {
    if (code === EMPTY_CODE) {
      findings.push(
        Finding.fromObject({
          name: "UUPS Proxy Bricked",
          description: `UUPS Implementation ${reducedUpgradeEvents[0]} got selfdestructed by ${txEvent.from}`,
          alertId: "UUPS_PROXY-1",
          protocol: "ethereum",
          severity: FindingSeverity.Critical,
          type: FindingType.Exploit,
          metadata: {
            attacker: txEvent.from,
            contractAttacker: upgradeEvents[index].args[0],
          },
        })
      );
    }
  });

  return findings;
}

export default {
  handleTransaction,
};
