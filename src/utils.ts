import { getEthersProvider } from "forta-agent";

export const getCode = async (address: string) => {
  const code = await getEthersProvider().getCode(address);
  return code
}
  
