const cron = require("node-cron");
const { Crop, Farm } = require("../../models");
const GeeService = require("../geeService");

const runGeeAnalysis = async () => {
  console.log("=================================");
  console.log("GEE SCHEDULER START");
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

        console.log(`Processing Farm: ${farm.id} - ${farm.name}`);
        console.log(`Crop: ${crop.id} - ${crop.name}`);

        const result = await GeeService.saveGeeHistory(farm.id, date, crop.id);

        console.log(
          `GEE success | Farm ${farm.id} | Crop ${crop.id}`,
          result.action,
        );
      } catch (error) {
        console.error(`GEE failed | Crop ${crop.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error("GEE scheduler error:", error);
  }
};

const startGeeScheduler = () => {
  // untuk production
  cron.schedule("0 * * * *", async () => {
    await runGeeAnalysis();
  });
  //   testing
  // cron.schedule("* * * * *", async () => {
  //   console.log("⏰ GEE CRON TRIGGERED");
  //   await runGeeAnalysis();
  // });

  console.log("GEE scheduler started");
};

module.exports = {
  startGeeScheduler,
  runGeeAnalysis,
};
