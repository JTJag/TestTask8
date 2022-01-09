const ImageNotDefinedError = {
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

const ImageProcessError = {
  status: "error",
  errors: [
    {
      error: "IMAGE_PROCESSING_ERROR",
      msg: "Не удалось обработать изображение",
    },
  ],
};

module.exports = {
  ImageNotDefinedError,
  MultipleImageError,
  FileFormatError,
  UnsupportedImageFormatError,
  InternalServerError,
  ImageProcessError,
};
