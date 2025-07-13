const { Complaint } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const complaintId = req.params.complaintId;

    const complaint = await Complaint.findByPk(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Denúncia não encontrada" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
