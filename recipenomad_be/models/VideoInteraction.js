// models/VideoInteraction.js
const mongoose = require('mongoose');

const videoControlSchema = new mongoose.Schema({
    state: String, // 'playing', 'paused', etc.
    currentTime: Number,
    playbackSpeed: Number
});

const videoInteractionSchema = new mongoose.Schema({
    recipeId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    isVoiceActivated: Boolean,
    videoControl: videoControlSchema
});

module.exports = mongoose.model('VideoInteraction', videoInteractionSchema);
