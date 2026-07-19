// generator data palsu. hanya membuat data seolah-olah berasal dari ESP32:

const getSensorData = async () => {

    return {
        deviceCode: "ESP32-001",
       

        soilMoisture: Number(
            (Math.random() * (80 - 20) + 20).toFixed(2)
        ),

        temperature: Number(
            (Math.random() * (35 - 25) + 25).toFixed(2)
        ),

        humidity: Number(
            (Math.random() * (90 - 60) + 60).toFixed(2)
        ),

        lux: Math.floor(
            Math.random() * (30000 - 5000) + 5000
        ),

        ph: Number(
            (Math.random() * (7 - 5.5) + 5.5).toFixed(2)
        ),

        waterLevel: Number(
            (Math.random() * (100 - 20) + 20).toFixed(2)
        ),

        battery: Number(
            (Math.random() * (100 - 50) + 50).toFixed(2)
        )
    };

};

module.exports = {
    getSensorData
};
