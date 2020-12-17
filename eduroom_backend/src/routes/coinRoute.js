const express = require('express');
const router = express.Router();

const { getStickers,getDailyRewardStatus,showCoinOwner,showStickerOwner, buySticker, getCoinFromEdqiz} = require('../controllers/Coin/coin');

router.get('/stickers', getStickers);
router.get('/dailyReward',getDailyRewardStatus);
// router.post('/coinTransaction',setCoinTransaction);
router.get('/coinOwner',showCoinOwner);
router.get('/stickerOwner',showStickerOwner);
// router.post('/coinTransaction',addReduceTransOwner);
router.post('/buySticker',buySticker)
router.post('/getCoinFromEdqiz',getCoinFromEdqiz)
module.exports = router;
