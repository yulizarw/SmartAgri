const path = require("path");
const ee = require("@google/earthengine");
// const eeq = require('./geePrivateKey/ee-yulizarwidiatama-0062afbdf0a8.json')
const privateKey = require(
    path.join(
        __dirname,
        "./geePrivateKey/ee-yulizarwidiatama-0062afbdf0a8.json"
    )
);

const GEE_PROJECT_ID =
    process.env.GEE_PROJECT_ID;

let geeInitialized = false;

const initializeGee = () => {

    return new Promise((resolve, reject) => {

        if (geeInitialized) {
            return resolve();
        }

        ee.data.authenticateViaPrivateKey(
            privateKey,

            () => {

                ee.initialize(
                    null,
                    null,

                    () => {

                        geeInitialized = true;

                        console.log(
                            "Google Earth Engine berhasil diinisialisasi"
                        );

                        resolve();

                    },

                    (error) => {

                        console.error(
                            "GEE initialization error:",
                            error
                        );

                        reject(error);

                    },

                    null,

                    GEE_PROJECT_ID
                );

            },

            (error) => {

                console.error(
                    "GEE authentication error:",
                    error
                );

                reject(error);

            }
        );

    });

};

module.exports = {
    ee,
    initializeGee
};