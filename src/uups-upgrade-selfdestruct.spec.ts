import {
  EMPTY_CODE,
  UUPS_IMPLEMENTATION_UPGRADE_EVENT,
  ATTACKER_ADDRESS,
  IMPLEMENTATION_ADDRESS_WITH_CODE,
  IMPLEMENTATION_ADDRESS_WITH_EMPTY_CODE,
  SAMPLE_CONTRACT_CODE,
  UPGRADE_EVENT_WITH_CODE,
  UPGRADE_EVENT_WITH_EMPTY_CODE,
  CORRECT_FINDING_RESULT,
} from "./constants";

import uupsUpgradeSelfdestructAgent from "./uups-upgrade-selfdestruct";

describe("upgrade event agent which checks new implementation with empty code", () => {
  let handleTransaction: any;

  const mockTxEvent = {
    from: "",
    filterLog: jest.fn(),
  };

  const mockGetCodeFunction = jest.fn();

  beforeAll(() => {
    handleTransaction = uupsUpgradeSelfdestructAgent.handleTransaction;
  });

  beforeEach(() => {
    mockTxEvent.filterLog.mockReset();
    mockGetCodeFunction.mockReset();
  });

  it("returns empty findings if there are no `Upgrade` events", async () => {
    mockTxEvent.filterLog.mockReturnValueOnce([]);

    const findings = await handleTransaction(mockTxEvent, mockGetCodeFunction);

    expect(findings).toStrictEqual([]);
    expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
    expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
      UUPS_IMPLEMENTATION_UPGRADE_EVENT
    );
    expect(mockGetCodeFunction).toHaveBeenCalledTimes(0);
  });

  it("returns empty finding if there is an `Upgrade` event emitted from an non-empty-code address", async () => {
    mockTxEvent.from = ATTACKER_ADDRESS;
    mockTxEvent.filterLog.mockReturnValueOnce([UPGRADE_EVENT_WITH_CODE]);
    mockGetCodeFunction.mockReturnValue(
      new Promise((resolve) => resolve(SAMPLE_CONTRACT_CODE))
    );

    const findings = await handleTransaction(mockTxEvent, mockGetCodeFunction);

    expect(findings).toStrictEqual([]);
    expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
    expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
      UUPS_IMPLEMENTATION_UPGRADE_EVENT
    );
    expect(mockGetCodeFunction).toHaveBeenCalledTimes(1);
    expect(mockGetCodeFunction).toHaveBeenCalledWith(
      IMPLEMENTATION_ADDRESS_WITH_CODE
    );
  });

  it("returns 1 finding if there is an `Upgrade` event emitted from an empty-code address", async () => {
    mockTxEvent.from = ATTACKER_ADDRESS;
    mockTxEvent.filterLog.mockReturnValueOnce([UPGRADE_EVENT_WITH_EMPTY_CODE]);
    mockGetCodeFunction.mockReturnValue(
      new Promise((resolve) => resolve(EMPTY_CODE))
    );

    const findings = await handleTransaction(mockTxEvent, mockGetCodeFunction);

    expect(findings).toStrictEqual([CORRECT_FINDING_RESULT]);
    expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
    expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
      UUPS_IMPLEMENTATION_UPGRADE_EVENT
    );
    expect(mockGetCodeFunction).toHaveBeenCalledTimes(1);
    expect(mockGetCodeFunction).toHaveBeenCalledWith(
      IMPLEMENTATION_ADDRESS_WITH_EMPTY_CODE
    );
  });

  it("returns n findings if there are n `Upgrade` events emitted from n empty-code addresses", async () => {
    const n = 5;

    mockTxEvent.from = ATTACKER_ADDRESS;
    mockTxEvent.filterLog.mockReturnValueOnce(
      Array(n).fill(UPGRADE_EVENT_WITH_EMPTY_CODE)
    );
    mockGetCodeFunction.mockReturnValue(
      new Promise((resolve) => resolve(EMPTY_CODE))
    );

    const findings = await handleTransaction(mockTxEvent, mockGetCodeFunction);

    expect(findings).toStrictEqual(Array(n).fill(CORRECT_FINDING_RESULT));
    expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
    expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
      UUPS_IMPLEMENTATION_UPGRADE_EVENT
    );
    expect(mockGetCodeFunction).toHaveBeenCalledTimes(n);
    expect(mockGetCodeFunction).toHaveBeenCalledWith(
      IMPLEMENTATION_ADDRESS_WITH_EMPTY_CODE
    );
  });
});
