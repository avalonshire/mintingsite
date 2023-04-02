import { StaticImageData } from "next/image";
import Eternl from "../../public/eternl.webp";
import Flint from "../../public/flint.svg";
import Gero from "../../public/gero.svg";
import Nami from "../../public/nami.svg";
import Typhon from "../../public/typhon.svg";

export interface WalletType {
  id: string;
  icon: StaticImageData;
  name: string;
}

const Wallet: {
  [key: string]: WalletType;
} = {
  eternl: {
    id: "eternl",
    icon: Eternl,
    name: "Eternl",
  },
  flint: {
    id: "flint",
    icon: Flint,
    name: "Flint",
  },
  gero: {
    id: "gero",
    icon: Gero,
    name: "Gero",
  },
  nami: {
    id: "nami",
    icon: Nami,
    name: "Nami",
  },
  typhon: {
    id: "typhon",
    icon: Typhon,
    name: "Typhon",
  },
};

export default Wallet;
