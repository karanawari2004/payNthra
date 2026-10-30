const Club = require("../model/Club");

// ================= CREATE CLUB =================
exports.createClub = async (req, res) => {
  try {
    const {
      clubName,
      licenceFee,
      activationRate,
      manPowerRate,
      gstRate,
    } = req.body;

    // Check required fields
    if (
      typeof clubName !== "string" ||
      !clubName.trim() ||
      licenceFee === undefined ||
      activationRate === undefined ||
      manPowerRate === undefined ||
      gstRate === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    const licence = Number(licenceFee);
    const activation = Number(activationRate);
    const manpower = Number(manPowerRate);
    const gst = Number(gstRate);

    // Validate numbers
    if (
      [licence, activation, manpower, gst].some(
        (value) => !Number.isFinite(value) || value < 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid non-negative numbers.",
      });
    }

    if (licence > 100 || gst > 100) {
      return res.status(400).json({
        success: false,
        message: "Licence Fee and GST must be between 0 and 100%.",
      });
    }

    const club = await Club.create({
      clubName: clubName.trim(),
      licenceFee: licence,
      activationRate: activation,
      manPowerRate: manpower,
      gstRate: gst,
    });

    return res.status(201).json({
      success: true,
      message: "Club added successfully.",
      data: club,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A club with this name already exists.",
      });
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create club error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add club.",
    });
  }
};


// ================= GET ALL CLUBS =================
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs,
    });
  } catch (error) {
    console.error("Get clubs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch clubs.",
    });
  }
};


// ================= UPDATE CLUB =================
exports.updateClub = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      clubName,
      licenceFee,
      activationRate,
      manPowerRate,
      gstRate,
    } = req.body;

    // Validate MongoDB ID
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID.",
      });
    }

    // Validate required fields
    if (
      typeof clubName !== "string" ||
      !clubName.trim() ||
      licenceFee === undefined ||
      activationRate === undefined ||
      manPowerRate === undefined ||
      gstRate === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    const licence = Number(licenceFee);
    const activation = Number(activationRate);
    const manpower = Number(manPowerRate);
    const gst = Number(gstRate);

    // Validate numbers
    if (
      [licence, activation, manpower, gst].some(
        (value) => !Number.isFinite(value) || value < 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid non-negative numbers.",
      });
    }

    if (licence > 100 || gst > 100) {
      return res.status(400).json({
        success: false,
        message: "Licence Fee and GST must be between 0 and 100%.",
      });
    }

    // Find and update club
    const updatedClub = await Club.findByIdAndUpdate(
      id,
      {
        $set: {
          clubName: clubName.trim(),
          licenceFee: licence,
          activationRate: activation,
          manPowerRate: manpower,
          gstRate: gst,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedClub) {
      return res.status(404).json({
        success: false,
        message: "Club not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Club updated successfully.",
      data: updatedClub,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A club with this name already exists.",
      });
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update club error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update club.",
    });
  }
};


// ================= DELETE CLUB =================
exports.deleteClub = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID.",
      });
    }

    const deletedClub = await Club.findByIdAndDelete(id);

    if (!deletedClub) {
      return res.status(404).json({
        success: false,
        message: "Club not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Club deleted successfully.",
    });
  } catch (error) {
    console.error("Delete club error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete club.",
    });
  }
};