const sharp = require("sharp");
const fs = require("fs");
const errors = require("../utils/errors");

function makeId() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

async function processImage(res, image) {
  try {
    //TODO Сделать разбивку по 10000 файлов на каталог
    //Генерируем уникальный id
    let id = makeId();
    while (fs.existsSync(`${process.env.UPLOAD_FOLDER}/${id}`)) {
      id = makeId();
    }

    fs.mkdirSync(`${process.env.UPLOAD_FOLDER}/${id}`);

    const img = await sharp(image.buffer);
    //Обработка изображения
    const preview = img
      .resize(200, 200, {
        fit: "contain",
        background: "transparent",
      })
      .png()
      .toFile(`${process.env.UPLOAD_FOLDER}/${id}/preview-200x200.png`);

    const full = img
      .resize(1600, 900, {
        fit: "contain",
        background: "transparent",
      })
      .png()
      .toFile(`${process.env.UPLOAD_FOLDER}/${id}/1600x900.png`);

    const uploadPath = /public(\/.+)/.exec(process.env.UPLOAD_FOLDER)[1];

    res.status(200).json({
      status: "success",
      data: {
        images: [
          {
            type: "preview",
            src: `${uploadPath}/${id}/preview-200x200.png`,
          },
          {
            type: "full",
            src: `${uploadPath}/${id}/1600x900.png`,
          },
        ],
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json(errors.ImageProcessError);
  }
}

module.exports = function (req, res) {
  try {
    //Если файл не передан
    if (!req.files) return res.status(400).json(errors.ImageNotDefinedError);

    //Выбираем изображения из поля "image"
    const images = req.files.filter((e) => e.fieldname == "image");
    switch (images.length) {
      case 0: //Если нужного поля нет
        return res.status(400).json(errors.ImageNotDefinedError);
        break;

      case 1: // Если передано одно изображение
        const image = images[0];
        //Проверяем тип файла по mime
        if (!/image\/*/.test(image.mimetype)) {
          return res.status(400).json(errors.FileFormatError);
        }
        if (!/image\/(jpeg|jpg|png)/.test(image.mimetype)) {
          return res.status(400).json(errors.UnsupportedImageFormatError);
        }
        return processImage(res, image);
        break;

      default:
        // Если передано больше одного изображения
        return res.status(400).json(errors.MultipleImageError);
        break;
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json(errors.InternalServerError);
  }
  next();
};
