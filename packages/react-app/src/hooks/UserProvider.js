import { useMemo } from "react";
import { Web3Provider } from "@ethersproject/providers";
//import BurnerProvider from "burner-provider";
import Arkane from "@arkane-network/web3-arkane-provider";
import { INFURA_ID } from "../constants";

const useUserProvider = (injectedProvider, localProvider) =>
useMemo(() => {
  if (injectedProvider) {
    console.log("🦊 Using injected provider");
    return injectedProvider;
  }
  if (!localProvider) return undefined;

  let burnerConfig = {
    clientId: 'Creative-Platform',
    environment: 'staging',
    signMethod: 'POPUP', //optional, REDIRECT by default
    bearerTokenProvider: () => 'obtained_bearer_token', //optional, default undefined
  }

  if(window.location.pathname){
    if(window.location.pathname.indexOf("/pk")>=0){
      let incomingPK = window.location.hash.replace("#","")
      let rawPK
      if(incomingPK.length===64||incomingPK.length===66){
        console.log("🔑 Incoming Private Key...");
        rawPK=incomingPK
        burnerConfig.privateKey = rawPK
        window.history.pushState({},"", "/");
        let currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
        if(currentPrivateKey && currentPrivateKey!==rawPK){
          window.localStorage.setItem("metaPrivateKey_backup"+Date.now(),currentPrivateKey);
        }
        window.localStorage.setItem("metaPrivateKey",rawPK);
      }
    }
  }

  console.log("🔥 Using burner provider", burnerConfig);
  if (localProvider.connection && localProvider.connection.url) {
    burnerConfig.rpcUrl = localProvider.connection.url
    return Arkane;
  }else{
    // eslint-disable-next-line no-underscore-dangle
    const networkName = localProvider._network && localProvider._network.name;
    burnerConfig.rpcUrl = `https://${networkName || "mainnet"}.infura.io/v3/${INFURA_ID}`
    return Arkane;
  }
}, [injectedProvider, localProvider]);

export default useUserProvider;
