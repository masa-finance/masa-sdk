import Arweave from "arweave";

export const arweave = ({
  host,
  port,
  protocol,
  logging,
}: {
  host: string;
  port: number;
  protocol: string;
  logging: boolean;
}) => {
  return Arweave.init({
    host,
    port,
    protocol,
    logging,
  });
};
