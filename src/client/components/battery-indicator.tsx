import React from 'react';
import { useContext } from 'react';
import { getLogger} from '@transitive-sdk/utils-web';
import { BatteryWarning, BatteryCharging, BatteryFull, BatteryMedium, BatteryLow, Battery } from 'lucide-react';
import { ROSContextInFleet, ROSContextProviderInFleet } from '@components/ros-provider';

const log = getLogger('BatteryIndicator');
log.setLevel('debug');

//v4
export const BatteryIndicatorWithContext = () => {
  // get the battery status from the reactively updating device data
  const { deviceData } = useContext(ROSContextInFleet);
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

export const BatteryIndicator = ({device}) => {
  return (
    <ROSContextProviderInFleet device={device} ros1Topics={['/status/battery']}>
      <BatteryIndicatorWithContext />
    </ROSContextProviderInFleet>
  )
};


// v3 - takes data from fleet context
// export const BatteryIndicator = ({device}) => {
//   // get the battery status from the reactively updating device data
//   const context = useContext(CapabilityContext);
//   const [deviceData, setDeviceData] = useState();

//   useEffect(() => {
//     log.debug('Context', context);
//     const api = context.getAPI(device);
//     log.debug('API', api);
//     api?.subscribe(1, '/status/battery');
//     setDeviceData(api?.deviceData);
//     // unsubscribe when React component unmounts
//     return () => {
//       api?.unsubscribe?.(1, '/status/battery');
//     }
//   }, [context?.ready]);

//   const batteryStatus = deviceData?.ros?.[1].messages?.status?.battery;
//   if (batteryStatus) {
//     log.debug('Battery status', batteryStatus.charge);
//   }

//   return <div>
//     {!batteryStatus ? <BatteryWarning /> :
//       batteryStatus.power_supply_status === 1 ? <BatteryCharging /> :
//       batteryStatus.charge > 90 ? <BatteryFull /> :
//       batteryStatus.charge <= 90 && batteryStatus.charge > 50 ? <BatteryMedium /> :
//       batteryStatus.charge <= 50 && batteryStatus.charge > 20 ? <BatteryLow /> :
//       <Battery />
//     }
//   </div>
// }


// v2
// export const BatteryIndicatorWithContext = () => {
//   // get the battery status from the reactively updating device data
//   const {deviceData} = useContext(ROSContext);
//   const batteryStatus = deviceData?.ros?.[1].messages?.status?.battery;
//   if (batteryStatus) {
//     log.debug('Battery status', batteryStatus.charge);
//   }
//   return <div>
//     {!batteryStatus ? <BatteryWarning /> :
//       batteryStatus.power_supply_status === 1 ? <BatteryCharging /> :
//       batteryStatus.charge > 90 ? <BatteryFull /> :
//       batteryStatus.charge <= 90 && batteryStatus.charge > 50 ? <BatteryMedium /> :
//       batteryStatus.charge <= 50 && batteryStatus.charge > 20 ? <BatteryLow /> :
//       <Battery />
//     }
//   </div>
// }

// export const BatteryIndicator = ({device}) => {
//   return (
//     <ROSContextProvider device={device} ros1Topics={['/status/battery']}>
//       <BatteryIndicatorWithContext />
//     </ROSContextProvider>
//   )
// };














//v1
// const SimpleBatteryIndicator = ({deviceData}) => {
//   // get the battery status from the reactively updating device data
//   const batteryStatus = deviceData?.ros?.[1].messages?.status?.battery;

//   if (batteryStatus) {
//     log.debug('Battery status', batteryStatus.charge);
//   }
//   return <div>
//     {!batteryStatus ? <BatteryWarning /> :
//       batteryStatus.power_supply_status === 1 ? <BatteryCharging /> :
//       batteryStatus.charge > 90 ? <BatteryFull /> :
//       batteryStatus.charge <= 90 && batteryStatus.charge > 50 ? <BatteryMedium /> :
//       batteryStatus.charge <= 50 && batteryStatus.charge > 20 ? <BatteryLow /> :
//       <Battery />
//     }
//   </div>
// }

// const BatteryIndicatorProvidedWithCapability = () => {
//   // import the API exposed by the ros-tool capability
//   const { isReady, subscribe, unsubscribe, deviceData } = useContext(CapabilityContext)

//   useEffect(() => {
//     if (isReady?.()) {
//       // subscribe to a ROS 1 topic on the robot
//       subscribe(1, '/status/battery');
//     }

//     // unsubscribe when React component unmounts
//     return () => {
//       unsubscribe?.(1, '/status/battery');
//     }
//   }, [isReady, subscribe])
  
//   return <SimpleBatteryIndicator deviceData={deviceData} />
// }

// const BatteryIndicatorProvidedWithJwt = () => {
//   const jwt = useContext(JWTContext);
//   return(
//     <CapabilityContextProvider jwt={jwt} host={host} ssl={secure}>
//       <BatteryIndicatorProvidedWithCapability />
//     </CapabilityContextProvider>
//   );
// }

// export const BatteryIndicator = ({device}) => {
//   return (
//     <JWTContextProvider device={device} capability={'@transitive-robotics/ros-tool'}>
//       <BatteryIndicatorProvidedWithJwt />
//     </JWTContextProvider>
//   );
// }