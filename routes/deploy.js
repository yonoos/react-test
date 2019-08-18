var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

const apps = [
  {id:"BCA", name:"Expotrans"},
  {id:"TSM", name:"Time Sheet Management"}
]

/* GET available applications listing. */
router.get('/apps', function(req, res, next) {
  res.send(apps);
});

router.get('/', function(req, res, next) {
  res.send(apps);
});

router.post('/', upload.any(), function(req, res, next) {
  const files = req.files;
  console.log('Received app: ', req.body.app);
  const file = req.files.forEach(file => {
    console.log('Received file: ', file.originalname, file.size, file.path);
  });
  res.sendStatus(200, 'ok');
});

module.exports = router;
