const cron = require("node-cron");
const { Crop, Farm } = require("../../models");

const WeatherForecastService = require("../weatherForecastService");

const runWeatherForecast = async () => {
  console.log("=================================");
  console.log("WEATHER FORECAST SCHEDULER START");
  console.log(new Date().toISOString());
  console.log("=================================");

  try {
    const crops = await Crop.findAll({
      include: [
        {
          model: Farm,
          required: true,
        },
      ],
    });

    console.log(`Found ${crops.length} crops`);

    const date = new Date().toISOString().split("T")[0];

    for (const crop of crops) {
      try {
        const farm = crop.Farm;

        if (!farm) {
          continue;
        }

        console.log(`Processing Weather | Farm: ${farm.id} - ${farm.name}`);

        console.log(`Crop: ${crop.id} - ${crop.name}`);

        const result = await WeatherForecastService.saveWeather(farm.id, date);

        console.log(
          `✅ WEATHER SUCCESS | Farm ${farm.id} | Crop ${crop.id} | ${result.action}`,
        );
      } catch (error) {
        console.error(`❌ WEATHER FAILED | Crop ${crop.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error("Weather forecast scheduler error:", error);
  }

  console.log("=================================");
  console.log("WEATHER FORECAST SCHEDULER FINISHED");
  console.log(new Date().toISOString());
  console.log("=================================");
};

const startWeatherScheduler = () => {
  cron.schedule(
    "0 * * * *",
    async () => {
      await runWeatherForecast();
    },
    {
      timezone: "Asia/Jakarta",
    },
  );

  console.log("Weather forecast scheduler started");
};

module.exports = {
  startWeatherScheduler,
  runWeatherForecast,
};
