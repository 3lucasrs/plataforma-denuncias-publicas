// src/controllers/analytics.controller.js
const { Complaint, User, Response } = require("../models");
const { Sequelize, Op } = require("sequelize");

exports.getSummary = async (req, res) => {
  try {
    const [totalUsers, totalComplaints, statusCounts, categoryCounts] = await Promise.all(
      [
        User.count(),
        Complaint.count(),

        Complaint.findAll({
          attributes: [
            "status",

            [
              Sequelize.cast(Sequelize.fn("COUNT", Sequelize.col("status")), "INTEGER"),
              "count",
            ],
          ],
          group: ["status"],
        }),

        Complaint.findAll({
          attributes: [
            "category",

            [
              Sequelize.cast(Sequelize.fn("COUNT", Sequelize.col("category")), "INTEGER"),
              "count",
            ],
          ],
          group: ["category"],
          order: [[Sequelize.fn("COUNT", Sequelize.col("category")), "DESC"]],
          limit: 5,
        }),
      ]
    );

    const formattedStatusCounts = statusCounts.reduce((acc, item) => {
      acc[item.getDataValue("status")] = item.getDataValue("count");
      return acc;
    }, {});

    res.json({
      totalUsers,
      totalComplaints,
      statusCounts: formattedStatusCounts,

      categoryCounts: categoryCounts.map((item) => item.get({ plain: true })),
    });
  } catch (error) {
    console.error("ERRO AO GERAR RESUMO DE ANALYTICS:", error);
    res.status(500).json({ message: "Erro interno ao gerar resumo." });
  }
};
