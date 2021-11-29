import agent from "./agent";

describe("UUPS Implementation Bricked Agent", () => {
  let handleTransaction: any;

  const mockUupsUpgradeSelfdestructAgent = {
    handleTransaction: jest.fn(),
  };
  const mockTxEvent = {
    some: "event",
  };

  const mockGetCodeFunction = jest.fn();

  beforeAll(() => {
    handleTransaction = agent.provideHandleTransaction(
      mockUupsUpgradeSelfdestructAgent.handleTransaction,
      mockGetCodeFunction
    );
  });

  it("invokes uupsUpgradeSelfdestructAgent and returns its findings", async () => {
    const mockFinding = { some: "finding" };
    mockUupsUpgradeSelfdestructAgent.handleTransaction.mockReturnValueOnce([
      mockFinding,
    ]);

    const findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([mockFinding]);
    expect(
      mockUupsUpgradeSelfdestructAgent.handleTransaction
    ).toHaveBeenCalledTimes(1);
    expect(
      mockUupsUpgradeSelfdestructAgent.handleTransaction
    ).toHaveBeenCalledWith(mockTxEvent, mockGetCodeFunction);
  });
});
