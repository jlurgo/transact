import React, {  createContext, useEffect, useContext, useState } from 'react';
import { CapabilityContext, CapabilityContextProvider } from '@transitive-sdk/utils-web'
import { _ } from 'lodash';
import { JWTContext, JWTContextProvider } from '@components/jwt-context';
import { getLogger} from '@transitive-sdk/utils-web';

const log = getLogger('ROSProvider');
log.setLevel('debug');

const host = import.meta.env.VITE_HOST; // Transitive deployment
const secure = !import.meta.env.VITE_INSECURE;

export const ROSContext = createContext({});

const ProviderWithROS = ({ children, ros1Topics }) => {
  // import the API exposed by the ros-tool capability
  const { isReady, subscribe, unsubscribe, deviceData, getApi} = useContext(CapabilityContext)

  // log.debug('ProviderWithROS', isReady, subscribe, unsubscribe, deviceData, getApi);
  
  useEffect(() => {
    if (isReady?.()) {
      // subscribe to a ROS 1 topic on the robot
      _.forEach(ros1Topics, (topic, i) => {
        log.debug('Subscribing to topic', topic);
        subscribe?.(1, topic);
      });
    }

    // unsubscribe when React component unmounts
    return () => {
      _.forEach(ros1Topics, (topic, i) => {
        log.debug('Unsubscribing from topic', topic);
        unsubscribe?.(1, topic);
      });
    }
  }, [isReady, subscribe]);

  return <ROSContext.Provider value={{deviceData}}>{children}</ROSContext.Provider>
}

const ProviderWithJwt = ({children}) => {
  const jwt = useContext(JWTContext);
  return(
    <CapabilityContextProvider jwt={jwt} host={host} ssl={secure}>
      {children}
    </CapabilityContextProvider>
  );
}

export const ROSContextProvider = ({ children, device, ros1Topics }) => {
  log.debug('ROSContextProvider', device, ros1Topics);
  return <JWTContextProvider device={device} capability={'@transitive-robotics/ros-tool'}>
    <ProviderWithJwt>
      <ProviderWithROS ros1Topics={ros1Topics}>
        {children}
      </ProviderWithROS>
    </ProviderWithJwt>
  </JWTContextProvider>
};


export const ROSContextInFleet = createContext({});
export const ROSContextProviderInFleet = ({ children, device, ros1Topics }) => {
  // get the battery status from the reactively updating device data
  const capabilityContext = useContext(CapabilityContext);
  const [deviceData, setDeviceData] = useState();

  useEffect(() => {
    const api = capabilityContext.getAPI(device);
    api?.subscribe && _.forEach(ros1Topics, (topic, i) => {
      log.debug('Subscribing to topic', topic);
      api.subscribe(1, topic);
    });
    setDeviceData(api?.deviceData);
    // unsubscribe when React component unmounts
    return () => {
      api?.unsubscribe && _.forEach(ros1Topics, (topic, i) => {
        log.debug('Unsubscribing from topic', topic);
        api.unsubscribe(1, topic);
      });
    }
  }, [capabilityContext?.ready]);

  return <ROSContextInFleet.Provider value={{deviceData}}>{children}</ROSContextInFleet.Provider>
}