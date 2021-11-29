import { Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import uupsUpgradeSelfdestructAgent from "./uups-upgrade-selfdestruct";
import { getCode } from "./utils";

export type GetCodeFunctionType = (address: string) => Promise<string>;

export type HandleTransactionFunctionType = (
  txEvent: TransactionEvent,
  getAddressCode: GetCodeFunctionType
) => Promise<Finding[]>;

function provideHandleTransaction(
  uupsUpgradeSelfdestructHandleTransaction: HandleTransactionFunctionType,
  getAddressCode: GetCodeFunctionType
): HandleTransaction {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings = await uupsUpgradeSelfdestructHandleTransaction(
      txEvent,
      getAddressCode
    );

    return findings;
  };
}

export default {
  provideHandleTransaction,
  handleTransaction: provideHandleTransaction(
    uupsUpgradeSelfdestructAgent.handleTransaction,
    getCode
  ),
};
