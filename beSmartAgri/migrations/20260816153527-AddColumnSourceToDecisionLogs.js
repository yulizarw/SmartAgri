module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("DecisionLogs", "source", {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: "AUTOMATIC",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("DecisionLogs", "source");
  },
};
