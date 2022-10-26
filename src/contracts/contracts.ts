import { ContractService } from "./contractService";
import { loadIdentityContracts } from "./loadIdentityContracts";
import { addresses } from "./addresses";
import Masa from "../masa";

export const contracts = (masa: Masa) => ({
  service: new ContractService(masa),
  loadIdentityContracts: () =>
    loadIdentityContracts({
      provider: masa.config.wallet.provider,
      network: masa.config.network,
    }),
  addresses,
});
