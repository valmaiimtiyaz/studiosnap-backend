const usersService = require("../service/snapService");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await usersService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Email not found", 
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Invalid password", 
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Login successful", 
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function getUserById(req, res) {
  try {
    const user = await usersService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function addUser(req, res) {
  try {
    const newUser = await usersService.addUser(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function updateUser(req, res) {
  try {
    const updatedUser = await usersService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const deletedUser = await usersService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}


function simulateFileUpload(base64Data, sessionId) {
  const fileExtension = 'image/jpeg';
  const assetUrl = `https://dummy-storage.com/assets/${sessionId}_${Date.now()}.jpeg`;
  return { assetUrl, mediaType: fileExtension };
}

async function startPhotoSession(req, res) {
  try {
    const { user_id, filter } = req.body; 

    if (!user_id || !filter) {
        return res.status(400).json({ status: "error", code: 400, message: "User ID and filter are required." });
    }
    
    const newSession = await usersService.startSession(user_id, filter);
    
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Photo session started successfully",
      data: newSession,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function uploadPhotoAsset(req, res) {
  try {
    const { session_id, photo_data } = req.body; 
    
    if (!session_id || !photo_data) {
        return res.status(400).json({ status: "error", code: 400, message: "Session ID and photo data are required." });
    }

    // 1. Unggah ke Cloud Storage
    const { assetUrl, mediaType } = simulateFileUpload(photo_data, session_id);
    // 2. Simpan URL di Database
    const newAsset = await usersService.savePhotoAsset(session_id, assetUrl, mediaType);
    // 3. Update jumlah foto di Sesi
    await usersService.incrementPhotoCount(session_id);

    res.status(201).json({
      status: "success",
      code: 201,
      message: "Photo asset uploaded successfully",
      data: newAsset,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

async function endPhotoSession(req, res) {
  try {
    const { session_id } = req.body; 

    if (!session_id) {
        return res.status(400).json({ status: "error", code: 400, message: "Session ID is required." });
    }
    
    const endedSession = await usersService.endSession(session_id);
    
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Photo session ended successfully",
      data: endedSession,
    });
  } catch (err) {
    res.status(500).json({ status: "error", code: 500, message: err.message });
  }
}

module.exports = {
  login,
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  startPhotoSession,
  uploadPhotoAsset,
  endPhotoSession,
};
