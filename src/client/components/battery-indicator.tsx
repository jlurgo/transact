import React, { useEffect } from 'react';
import { CapabilityContext, CapabilityContextProvider } from '@transitive-sdk/utils-web'
import { useContext } from 'react';
import { JWTContext, JWTContextProvider } from '@components/jwt-context';
import { getLogger} from '@transitive-sdk/utils-web';
import { BatteryWarning, BatteryCharging, BatteryFull, BatteryMedium, BatteryLow, Battery } from 'lucide-react';

const log = getLogger('BatteryIndicator');
log.setLevel('debug');


const SimpleBatteryIndicator = ({deviceData}) => {
  // get the battery status from the reactively updating device data
  const batteryStatus = deviceData?.ros?.[1].messages?.status?.battery;

  return <div>
    {!batteryStatus ? <BatteryWarning /> :
      batteryStatus.power_supply_status === 1 ? <BatteryCharging /> :
      batteryStatus.charge > 90 ? <BatteryFull /> :
      batteryStatus.charge <= 90 && batteryStatus.charge > 50 ? <BatteryMedium /> :
      batteryStatus.charge <= 50 && batteryStatus.charge > 20 ? <BatteryLow /> :
      <Battery />
    }
  </div>
}

const BatteryIndicatorProvidedWithCapability = () => {
  // import the API exposed by the ros-tool capability
  const { isReady, subscribe, unsubscribe, deviceData } = useContext(CapabilityContext)

  useEffect(() => {
    if (isReady?.()) {
      // subscribe to a ROS 1 topic on the robot
      subscribe(1, '/status/battery');
    }

    // unsubscribe when React component unmounts
    return () => {
      unsubscribe?.(1, '/status/battery');
    }
  }, [isReady, subscribe])
  
  return <SimpleBatteryIndicator deviceData={deviceData} />
}

const BatteryIndicatorProvidedWithJwt = () => {
  const jwt = useContext(JWTContext);
  return(
    <CapabilityContextProvider jwt={jwt}>
      <BatteryIndicatorProvidedWithCapability />
    </CapabilityContextProvider>
  );
}

export const BatteryIndicator = ({device}) => {
  return (
    <JWTContextProvider device={device} capability={'@transitive-robotics/ros-tool'}>
      <BatteryIndicatorProvidedWithJwt />
    </JWTContextProvider>
  );
}