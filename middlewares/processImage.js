const sharp = require("sharp");
const fs = require("fs");

const NotDefinedError = {
  status: "error",
  errors: [
    {
      error: "IMAGE_NOT_DEFINED",
      msg: "Изображение не загружено.",
    },
  ],
};

const MultipleImageError = {
  status: "error",
  errors: [
    {
      error: "MULTIPLE_IMAGE_NOT_SUPPORTED",
      msg: "Загрузка нескольких изображений не поддерживается",
    },
  ],
};

const FileFormatError = {
  status: "error",
  errors: [
    {
      error: "FILE_FORMAT_ERROR",
      msg: "Загруженный файл не является изображением",
    },
  ],
};

const UnsupportedImageFormatError = {
  status: "error",
  errors: [
    {
      error: "UNSUPPORTED_IMAGE_FORMAT",
      msg: "Неподдерживаемый формат изображения",
    },
  ],
};

const InternalServerError = {
  status: "error",
  errors: [
    {
      error: "INTERNAL_ERROR",
      msg: "Внутренняя ошибка сервера",
    },
  ],
};

function makeId() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

const processImage = async (res, image) => {
  try {
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
  } catch (e) {}
};

module.exports = (req, res, next) => {
  //Если файл не передан
  if (!req.files) return res.status(400).json(NotDefinedError);

  //Выбираем изображения из поля "image"
  const images = req.files.filter((e) => e.fieldname == "image");
  switch (images.length) {
    case 0: //Если нужного поля нет
      return res.status(400).json(NotDefinedError);
      break;

    case 1: // Если передано одно изображение
      const image = images[0];
      //Проверяем тип файла по mime
      if (!/image\/*/.test(image.mimetype)) {
        return res.status(400).json(FileFormatError);
      }
      if (!/image\/(jpeg|jpg|png)/.test(image.mimetype)) {
        return res.status(400).json(UnsupportedImageFormatError);
      }
      return processImage(res, image);
      break;

    default:
      // Если передано больше одного изображения
      return res.status(400).json(MultipleImageError);
      break;
  }
};
