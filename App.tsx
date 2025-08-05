import { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { BluetoothDevice } from 'react-native-bluetooth-classic';
import { requestBluetoothPermission } from './hooks/useBluetooth'

const NAME_OF_TARGET_DEVICE = "CASA-DOMOTICA"

function App() {
    const [device, setDevice] = useState<BluetoothDevice | null>(null);

    const sendDataToDevice = async (data: string) => {
        let isConnected = await device?.isConnected(); 
        if (!isConnected) {
            isConnected = await device?.connect();
            if (!isConnected) {
                console.error("No se pudo conectar al dispositivo");
                return;
            }
        }
        console.log("Sending \"", data, "\"");
        await device?.write(data);
    };

    return (
    <View style={styles.container}>
        {
            device ? (
                <>
                    <Button title='On' onPress={async () => {
                        sendDataToDevice("T");
                    }}></Button>
                    <Button title='Off' onPress={async () => {
                        sendDataToDevice("t");
                    }}></Button>
                </>
            ) : (
                <Button title='Scan' onPress={async () => {
                    console.log("Click at ", Date.now())
                    let hasPermission = await requestBluetoothPermission()
                    if (hasPermission) {
                        let bluetoothEnabled = await RNBluetoothClassic.isBluetoothEnabled();
                        if(bluetoothEnabled) {
                            let devices = await RNBluetoothClassic.getBondedDevices();
                            console.log("devices count: ", devices.length);
                            devices.map((iterDevice) => {
                                if(iterDevice.name == NAME_OF_TARGET_DEVICE) {
                                    setDevice(iterDevice);
                                }
                            });
                        }
                    }
                }}/>
            )
        }
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20
    },
});

export default App;
